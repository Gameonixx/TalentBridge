const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedJobs = async () => {
  try {
    await connectDB();
    
    // Check if jobs already exist
    const count = await Job.countDocuments();
    if (count > 0) {
      console.log('Jobs already exist in the database. No seeding required.');
      process.exit(0);
    }

    // Need a recruiter to assign jobs to
    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      console.log('No recruiter found. Creating a dummy recruiter...');
      recruiter = await User.create({
        name: 'John Recruiter',
        email: 'recruiter@example.com',
        password: 'password123',
        role: 'recruiter',
        company: 'Google'
      });
    }

    const jobs = [
      {
        recruiter: recruiter._id,
        title: 'Frontend Software Engineer',
        company: 'Google',
        description: 'Build the next generation of web applications using React and modern JavaScript.',
        requirements: ['React', 'JavaScript', 'CSS', 'HTML'],
        location: 'Bangalore, India',
        ctc: '24 LPA',
        cgpaCriteria: 8.0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'open'
      },
      {
        recruiter: recruiter._id,
        title: 'Backend Developer',
        company: 'Amazon',
        description: 'Design and implement scalable microservices using Node.js and AWS.',
        requirements: ['Node.js', 'Express', 'MongoDB', 'AWS'],
        location: 'Hyderabad, India',
        ctc: '28 LPA',
        cgpaCriteria: 7.5,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: 'open'
      },
      {
        recruiter: recruiter._id,
        title: 'Data Scientist',
        company: 'Microsoft',
        description: 'Apply machine learning models to solve complex business problems.',
        requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
        location: 'Noida, India',
        ctc: '26 LPA',
        cgpaCriteria: 8.5,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        status: 'open'
      }
    ];

    await Job.insertMany(jobs);
    console.log('Sample jobs successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding jobs: ${error.message}`);
    process.exit(1);
  }
};

seedJobs();
