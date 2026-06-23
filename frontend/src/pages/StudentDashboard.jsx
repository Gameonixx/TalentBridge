import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileText, CheckCircle, Calendar, User, Megaphone, Target } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import announcementService from '../services/announcementService';
import aiService from '../services/aiService';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [readiness, setReadiness] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        const parsedAnnouncements = Array.isArray(data) ? data
          : Array.isArray(data?.announcements) ? data.announcements
          : Array.isArray(data?.data?.announcements) ? data.data.announcements
          : Array.isArray(data?.data) ? data.data
          : [];
        setAnnouncements(parsedAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    const fetchReadiness = async () => {
      if (!user?._id) return;
      try {
        const data = await aiService.getStudentIntelligence(user._id);
        if (data && data.readiness) {
          setReadiness(data.readiness);
        }
      } catch (err) {
        console.error('Error fetching readiness:', err);
      }
    };

    fetchAnnouncements();
    fetchReadiness();
  }, [user]);

  const columns = [
    { header: 'Company', accessor: 'company' },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {row.status}
      </span>
    )},
    { header: 'Applied On', accessor: 'date' },
  ];

  const recentApplications = [
    // Placeholder data
    { company: 'TechCorp', role: 'Frontend Developer', status: 'In Review', date: 'Oct 24, 2023' },
    { company: 'InnovateInc', role: 'Software Engineer', status: 'Shortlisted', date: 'Oct 22, 2023' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here is an overview of your placement journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Applications Submitted" value="12" icon={FileText} trend={8} />
        <StatsCard title="Shortlisted" value="3" icon={CheckCircle} trend={12} />
        <StatsCard title="Interviews" value="1" icon={Calendar} trend={0} />
        <StatsCard title="Profile Completion" value="85%" icon={User} trend={5} />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              Placement Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(announcements) && announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann._id} className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                      <span className="text-xs text-gray-500 font-medium">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{ann.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No announcements yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {readiness && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                AI Placement Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Overall Score</span>
                    <span className="text-sm font-bold text-indigo-600">{readiness.overallScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${readiness.overallScore}%` }}></div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Resume Quality</span>
                      <span className="text-xs font-bold text-gray-700">{readiness.resumeQuality}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${readiness.resumeQuality}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Match</span>
                      <span className="text-xs font-bold text-gray-700">{readiness.skillMatch}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${readiness.skillMatch}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project Strength</span>
                      <span className="text-xs font-bold text-gray-700">{readiness.projectStrength}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${readiness.projectStrength}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <DataTable 
          title="Recent Applications" 
          columns={columns} 
          data={recentApplications} 
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
