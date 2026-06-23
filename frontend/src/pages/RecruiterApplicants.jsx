import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import jobService from '../services/jobService';
import recruiterService from '../services/recruiterService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import LoadingState from '../components/LoadingState';
import { User, FileText, CheckCircle, XCircle, Calendar, Link as LinkIcon, Sparkles, BrainCircuit } from 'lucide-react';
import aiService from '../services/aiService';

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

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiCandidate, setAiCandidate] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [aiQuestions, setAiQuestions] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

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

  const openResume = (candidate) => {
    console.log("Candidate resume:", candidate.profile?.resumeUrl);
    if (!candidate.profile?.resumeUrl) {
      alert("No resume uploaded");
      return;
    }
    window.open("http://localhost:5000" + candidate.profile.resumeUrl, "_blank");
  };

  const openAiAnalysis = async (candidateId) => {
    setAiCandidate(candidateId);
    setAiModalOpen(true);
    setAiReport(null);
    setAiQuestions(null);
    setLoadingAi(true);
    try {
      const data = await aiService.getStudentIntelligence(candidateId);
      setAiReport(data.report);
    } catch (err) {
      alert('Failed to load AI Intelligence');
    } finally {
      setLoadingAi(false);
    }
  };

  const generateQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const data = await aiService.getInterviewQuestions(aiCandidate, selectedJobId);
      setAiQuestions(data.questions);
    } catch (err) {
      alert('Failed to generate interview questions');
    } finally {
      setLoadingQuestions(false);
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
                            {app.matchDetails && (
                              <div className="mt-3 p-2.5 bg-orange-50 rounded-md border border-orange-100 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-orange-700">
                                    AI Score: {app.matchDetails.score}
                                  </span>
                                  {app.matchDetails.level && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      app.matchDetails.level === 'Strong Match' ? 'bg-green-100 text-green-800' :
                                      app.matchDetails.level === 'Moderate Match' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {app.matchDetails.level}
                                    </span>
                                  )}
                                </div>
                                
                                {app.matchDetails.reasons && app.matchDetails.reasons.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-700">
                                    <div className="font-semibold mb-1 text-gray-900">Why this match:</div>
                                    <ul className="space-y-1">
                                      {app.matchDetails.reasons.map((reason, i) => (
                                        <li key={i} className="flex items-center"><span className="text-green-600 mr-1">✓</span> {reason}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {app.matchDetails.missingSkills && app.matchDetails.missingSkills.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-700">
                                    <div className="font-semibold mb-1 text-red-700">Missing:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {app.matchDetails.missingSkills.join(', ')}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
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
                          <button 
                            onClick={() => openResume(app.student)}
                            className="flex items-center text-sm text-primary-600 hover:text-primary-900 focus:outline-none"
                          >
                            <FileText className="w-4 h-4 mr-1" /> Resume
                          </button>
                          {app.student.profile?.linkedinUrl && (
                            <a href={app.student.profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary-600 hover:text-primary-900">
                              <LinkIcon className="w-4 h-4 mr-1" /> LinkedIn
                            </a>
                          )}
                          <button 
                            onClick={() => openAiAnalysis(app.student._id)}
                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-900 focus:outline-none font-medium mt-1"
                          >
                            <Sparkles className="w-4 h-4 mr-1" /> AI Analysis
                          </button>
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

      {/* AI Analysis Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-indigo-600" />
                AI Candidate Report
              </h2>
              <button onClick={() => setAiModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {loadingAi ? (
                <div className="py-12 flex flex-col items-center justify-center text-indigo-600">
                  <Sparkles className="w-8 h-8 animate-pulse mb-4" />
                  <p className="font-medium">Analyzing Candidate Intelligence...</p>
                </div>
              ) : aiReport ? (
                <div className="space-y-6">
                  {/* Summary & Recommendation */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Candidate Overview</h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {aiReport.summary}
                      </p>
                    </div>
                    <div className="md:w-64 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recommendation</h3>
                      <div className={`p-4 rounded-lg border flex flex-col items-center justify-center h-full min-h-[100px] ${
                        aiReport.recommendation === 'Strong Hire' ? 'bg-green-50 border-green-200 text-green-800' :
                        aiReport.recommendation === 'Consider' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                        'bg-red-50 border-red-200 text-red-800'
                      }`}>
                        <span className="text-xl font-bold text-center">{aiReport.recommendation}</span>
                        {aiReport.score && <span className="text-sm mt-1 opacity-80">Score: {aiReport.score}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </h3>
                      <ul className="space-y-2">
                        {aiReport.strengths?.map((strength, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                            <span className="text-green-500 mr-2 mt-0.5">✓</span> {strength}
                          </li>
                        ))}
                        {(!aiReport.strengths || aiReport.strengths.length === 0) && (
                          <li className="text-sm text-gray-500 italic">No specific strengths identified.</li>
                        )}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Improvement Areas
                      </h3>
                      <ul className="space-y-2">
                        {aiReport.improvements?.map((imp, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700 bg-red-50/50 p-2 rounded border border-red-100">
                            <span className="text-red-400 mr-2 mt-0.5">•</span> {imp}
                          </li>
                        ))}
                        {(!aiReport.improvements || aiReport.improvements.length === 0) && (
                          <li className="text-sm text-gray-500 italic">No specific improvements identified.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Explanations */}
                  {aiReport.reasons && aiReport.reasons.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Why this recommendation?</h3>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {aiReport.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interview Questions Generator */}
                  <div className="pt-6 border-t border-gray-100">
                    {!aiQuestions && !loadingQuestions && (
                      <button 
                        onClick={generateQuestions}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex justify-center items-center gap-2 transition-colors focus:outline-none"
                      >
                        <BrainCircuit className="w-5 h-5" />
                        Generate Interview Questions
                      </button>
                    )}
                    
                    {loadingQuestions && (
                      <div className="py-6 text-center text-indigo-600 flex flex-col items-center">
                        <Sparkles className="w-6 h-6 animate-pulse mb-2" />
                        <p className="text-sm font-medium">Drafting dynamic technical questions...</p>
                      </div>
                    )}

                    {aiQuestions && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider flex items-center gap-2 bg-indigo-50 p-3 rounded-t-lg border-b border-indigo-100">
                          <BrainCircuit className="w-4 h-4" /> Recommended Technical Questions
                        </h3>
                        <ol className="space-y-3 px-2 list-decimal list-inside">
                          {aiQuestions.map((q, idx) => (
                            <li key={idx} className="text-gray-800 text-sm leading-relaxed pb-2 border-b border-gray-50 last:border-0 font-medium">
                              {q}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-red-500">Failed to load report.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicants;
