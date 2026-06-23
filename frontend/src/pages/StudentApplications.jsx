import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import EmptyState from '../components/EmptyState';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import applicationService from '../services/applicationService';
import toast from 'react-hot-toast';
import { Briefcase, CheckCircle2, Clock, CalendarCheck, XCircle } from 'lucide-react';

const TRACKING_STEPS = [
  { status: 'Applied', icon: Clock },
  { status: 'Under Review', icon: Briefcase },
  { status: 'Shortlisted', icon: CheckCircle2 },
  { status: 'Interview Scheduled', icon: CalendarCheck },
  { status: 'Selected', icon: CheckCircle2 },
];

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err) {
      toast.error('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (currentStatus, stepStatus) => {
    if (currentStatus === 'Rejected') return 'rejected';
    
    const currentIndex = TRACKING_STEPS.findIndex(s => s.status === currentStatus);
    const stepIndex = TRACKING_STEPS.findIndex(s => s.status === stepStatus);
    
    if (currentIndex === -1 || stepIndex === -1) return 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Applications</h1>
        <p className="text-gray-500 mt-1">Track the status of your placement applications.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState title="No Applications Yet" description="Visit the Job Board to start applying for opportunities." />
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{app.job?.title || 'Unknown Role'}</h2>
                    <p className="text-lg text-primary-600 font-medium">{app.job?.company || 'Unknown Company'}</p>
                    <p className="text-sm text-gray-500 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  {app.status === 'Rejected' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Not Selected
                    </span>
                  )}
                </div>

                {/* Tracking Pipeline */}
                <div className="relative">
                  <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200" aria-hidden="true"></div>
                  
                  <ul className="relative flex justify-between w-full">
                    {TRACKING_STEPS.map((step, idx) => {
                      const state = getStepStatus(app.status, step.status);
                      const StepIcon = step.icon;
                      
                      let circleClasses = "w-10 h-10 rounded-full flex items-center justify-center border-2 ring-4 ring-white z-10 transition-colors duration-200";
                      let textClasses = "mt-3 text-sm font-medium text-center transition-colors duration-200";
                      let iconClasses = "w-5 h-5";

                      if (app.status === 'Rejected') {
                         circleClasses += " bg-gray-100 border-gray-300";
                         textClasses += " text-gray-400";
                         iconClasses += " text-gray-400";
                      } else if (state === 'completed') {
                        circleClasses += " bg-primary-600 border-primary-600";
                        textClasses += " text-gray-900";
                        iconClasses += " text-white";
                      } else if (state === 'current') {
                        circleClasses += " bg-white border-primary-600";
                        textClasses += " text-primary-600";
                        iconClasses += " text-primary-600";
                      } else {
                        circleClasses += " bg-white border-gray-300";
                        textClasses += " text-gray-400";
                        iconClasses += " text-gray-300";
                      }

                      return (
                        <li key={idx} className="flex flex-col items-center relative w-24">
                          {/* Active track fill */}
                          {idx !== 0 && (state === 'completed' || state === 'current') && app.status !== 'Rejected' && (
                            <div className="absolute top-5 right-1/2 w-full h-0.5 bg-primary-600 -z-0" aria-hidden="true"></div>
                          )}
                          
                          <div className={circleClasses}>
                            <StepIcon className={iconClasses} />
                          </div>
                          <span className={textClasses}>{step.status}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
