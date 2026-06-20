import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import { Briefcase, MapPin, DollarSign, Calendar, GraduationCap } from 'lucide-react';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(prev => ({ ...prev, [jobId]: true }));
      await applicationService.applyToJob(jobId);
      
      // Update job state locally to reflect 'Applied' without full refetch
      setJobs(prevJobs => prevJobs.map(job => 
        job._id === jobId ? { ...job, hasApplied: true } : job
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply for this job.');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) return <LoadingState message="Loading available jobs..." />;
  
  if (error) return (
    <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg border border-red-100">
      {error}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Job Board</h1>
        <p className="text-gray-500 mt-1">Discover and apply to new opportunities matching your profile.</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No Jobs Available" description="Check back later for new placement opportunities." />
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                      <p className="text-lg text-primary-600 font-medium">{job.company || 'Company Name TBA'}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location || 'Not specified'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        {job.ctc || job.salaryRange || 'Not disclosed'}
                      </div>
                      {job.cgpaCriteria && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          Min CGPA: {job.cgpaCriteria}
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Requirements & Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements?.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 md:w-32">
                    <Button 
                      variant={job.hasApplied ? 'secondary' : 'primary'}
                      className="w-full"
                      disabled={job.hasApplied || applying[job._id]}
                      onClick={() => handleApply(job._id)}
                    >
                      {applying[job._id] ? 'Applying...' : job.hasApplied ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentJobs;
