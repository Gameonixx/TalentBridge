import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import announcementService from '../services/announcementService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import LoadingState from '../components/LoadingState';
import Button from '../components/Button';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText, CheckCircle, BrainCircuit, FileUp, Sparkles, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Announcement form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, studentsData, companiesData, announcementsData] = await Promise.all([
        adminService.getStats(),
        adminService.getStudents(),
        adminService.getCompanies(),
        announcementService.getAnnouncements()
      ]);

      console.log("ADMIN STATS:", statsData);
      console.log("ADMIN STUDENTS:", studentsData);
      console.log("ADMIN COMPANIES:", companiesData);

      const parsedStats = statsData?.stats || statsData?.data?.stats || statsData?.data || statsData || {};
      setStats(parsedStats);
      
      const parsedStudents = Array.isArray(studentsData) ? studentsData 
        : Array.isArray(studentsData?.students) ? studentsData.students
        : Array.isArray(studentsData?.data?.students) ? studentsData.data.students
        : Array.isArray(studentsData?.data) ? studentsData.data
        : [];
      setStudents(parsedStudents);

      const parsedCompanies = Array.isArray(companiesData) ? companiesData
        : Array.isArray(companiesData?.companies) ? companiesData.companies
        : Array.isArray(companiesData?.data?.companies) ? companiesData.data.companies
        : Array.isArray(companiesData?.data) ? companiesData.data
        : [];
      setCompanies(parsedCompanies);
      
      const parsedAnnouncements = Array.isArray(announcementsData) ? announcementsData
        : Array.isArray(announcementsData?.announcements) ? announcementsData.announcements
        : Array.isArray(announcementsData?.data?.announcements) ? announcementsData.data.announcements
        : Array.isArray(announcementsData?.data) ? announcementsData.data
        : [];
      setAnnouncements(parsedAnnouncements);
    } catch (err) {
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const newAnnouncement = await adminService.createAnnouncement({ title, message });
      setAnnouncements(prev => Array.isArray(prev) ? [newAnnouncement, ...prev] : [newAnnouncement]);
      setTitle('');
      setMessage('');
      toast.success('Announcement posted successfully');
    } catch (err) {
      toast.error('Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">{error}</div>;

  // Funnel data
  const funnelData = [
    { name: 'Total Applications', value: stats?.totalApplications || 0, fill: '#8884d8' },
    { name: 'Placed Students', value: stats?.placedStudents || 0, fill: '#82ca9d' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Placement Cell Analytics and Management.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Recruiters</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalRecruiters || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Students Placed</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.placedStudents || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Stats Cards */}
      <div className="mt-8 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          AI Matching Insights
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-800">Average AI Match</p>
                <h3 className="text-2xl font-bold text-indigo-900">{stats?.averageCandidateMatchScore || 0}%</h3>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800">Strong Candidates</p>
                <h3 className="text-2xl font-bold text-emerald-900">{stats?.strongMatchCandidates || 0}</h3>
              </div>
              <Users className="w-8 h-8 text-emerald-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-800">Resumes Analyzed</p>
                <h3 className="text-2xl font-bold text-violet-900">{stats?.totalResumesAnalyzed || 0}</h3>
              </div>
              <FileUp className="w-8 h-8 text-violet-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Funnel Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Placement Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full" style={{ width: "100%", height: "300px" }}>
              {funnelData?.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Announcement Manager */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gray-500" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-64 space-y-4">
            <form onSubmit={handleCreateAnnouncement} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
                <input
                  type="text"
                  placeholder="Message..."
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
              </div>
              <Button type="submit" disabled={submitting} className="self-end mb-1">
                {submitting ? 'Posting...' : 'Post'}
              </Button>
            </form>
            
            <div className="space-y-3 mt-4 border-t pt-4 border-gray-100">
              {Array.isArray(announcements) && announcements.map(ann => (
                <div key={ann._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                    <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{ann.message}</p>
                </div>
              ))}
              {Array.isArray(announcements) && announcements.length === 0 && (
                <EmptyState title="No announcements" description="Post an announcement to notify students and recruiters." />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Directory & Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch/CGPA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Profile Strength</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(students) && students.map(student => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.branch}</div>
                      <div className="text-sm text-gray-500">CGPA: {student.cgpa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.aiProfileStrength === 'Strong' ? 'bg-green-100 text-green-800' : 
                        student.aiProfileStrength === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.aiProfileStrength}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.resumeUploaded ? (
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Uploaded</span>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">Missing</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status === 'Placed' ? (
                        <div>
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Placed</span>
                          <div className="text-xs text-gray-500 mt-1">{student.placedCompany}</div>
                        </div>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unplaced</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Array.isArray(students) && students.length === 0 && (
              <div className="p-8">
                <EmptyState title="No students found" description="There are currently no students registered in the system." />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recruiter Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recruiter Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs Posted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Applicants</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(companies) && companies.map(company => (
                  <tr key={company._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{company.name}</div>
                      <div className="text-xs">{company.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.jobsPosted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.totalApplicants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Array.isArray(companies) && companies.length === 0 && (
              <div className="p-8">
                <EmptyState title="No recruiters found" description="There are currently no recruiters registered in the system." />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default AdminDashboard;
