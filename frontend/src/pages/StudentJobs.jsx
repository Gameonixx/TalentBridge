import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import { Briefcase, MapPin, DollarSign, Calendar, GraduationCap } from 'lucide-react';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState({});
  const [matchData, setMatchData] = useState({});
  const [loadingMatches, setLoadingMatches] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      setJobs(data);
      // Fetch match data for all jobs
      data.forEach(job => {
        fetchMatchScore(job._id);
      });
    } catch (err) {
      toast.error('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchScore = async (jobId) => {
    try {
      setLoadingMatches(prev => ({ ...prev, [jobId]: true }));
      const match = await jobService.getJobMatch(jobId);
      setMatchData(prev => ({ ...prev, [jobId]: match }));
    } catch (err) {
      console.error('Failed to fetch match for job', jobId);
    } finally {
      setLoadingMatches(prev => ({ ...prev, [jobId]: false }));
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
      toast.success('Successfully applied for the job!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply for this job.');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) return <DashboardSkeleton />;
  
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
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                        {matchData[job._id] && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                            🔥 AI Score: {matchData[job._id].score}
                          </span>
                        )}
                      </div>
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
                      {loadingMatches[job._id] ? (
                        <span className="text-sm text-gray-500 animate-pulse">Calculating AI Match...</span>
                      ) : matchData[job._id] ? (
                        <div className="space-y-3">
                          {matchData[job._id].matchedSkills.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold text-green-700 block mb-1">Matched:</span>
                              <div className="flex flex-wrap gap-2">
                                {matchData[job._id].matchedSkills.map((skill, idx) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {matchData[job._id].missingSkills.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold text-red-700 block mb-1">Missing:</span>
                              <div className="flex flex-wrap gap-2">
                                {matchData[job._id].missingSkills.map((skill, idx) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {job.requirements?.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
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
