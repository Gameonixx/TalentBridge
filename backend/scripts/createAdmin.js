const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

// Load env vars
dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin@talentbridge.com' });

    if (existingAdmin) {
      console.log('Admin account already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Placement Admin',
      email: 'admin@talentbridge.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('Admin account created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
