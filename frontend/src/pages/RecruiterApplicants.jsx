import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import jobService from '../services/jobService';
import recruiterService from '../services/recruiterService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import LoadingState from '../components/LoadingState';
import { User, FileText, CheckCircle, XCircle, Calendar, Link as LinkIcon } from 'lucide-react';

const STATUS_FLOW = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const RecruiterApplicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applicants, setApplicants] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      setSearchParams({ jobId: selectedJobId });
      fetchApplicants(selectedJobId);
    } else {
      setApplicants([]);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await jobService.getJobs();
      setJobs(data);
      if (!selectedJobId && data.length > 0) {
        setSelectedJobId(data[0]._id);
      }
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoadingApplicants(true);
      const data = await recruiterService.getJobApplicants(jobId);
      setApplicants(data);
    } catch (err) {
      setError('Failed to load applicants for this job.');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await recruiterService.updateApplicationStatus(applicationId, newStatus);
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loadingJobs) return <LoadingState message="Loading your jobs..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Applicant Tracking</h1>
        <p className="text-gray-500 mt-1">Review candidates and manage their application status.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Job Posting</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
          >
            <option value="" disabled>Select a job...</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title} ({job.status})</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Candidates {applicants.length > 0 && `(${applicants.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingApplicants ? (
            <div className="py-12 text-center text-gray-500">Loading applicants...</div>
          ) : !selectedJobId ? (
            <div className="py-12 text-center text-gray-500">Please select a job to view its applicants.</div>
          ) : applicants.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No applications received yet for this job.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academics</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{app.student.name}</div>
                            <div className="text-sm text-gray-500">{app.student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.student.profile?.college || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          {app.student.profile?.branch || 'N/A'} • CGPA: {app.student.profile?.cgpa || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        {app.student.profile?.resumeUrl && (
                          <a href={app.student.profile.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary-600 hover:text-primary-900">
                            <FileText className="w-4 h-4 mr-1" /> Resume
                          </a>
                        )}
                        {app.student.profile?.linkedinUrl && (
                          <a href={app.student.profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary-600 hover:text-primary-900">
                            <LinkIcon className="w-4 h-4 mr-1" /> LinkedIn
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                          app.status === 'Selected' ? 'bg-indigo-100 text-indigo-800' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-1.5 border"
                        >
                          {STATUS_FLOW.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterApplicants;
