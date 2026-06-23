import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recruiterService from '../services/recruiterService';
import { Briefcase, Users, Plus, CheckCircle, Calendar } from 'lucide-react';
// Note: StatsCard and DataTable should be imported correctly if they exist. 
// Replacing them with custom UI here or using existing if sure.
import { Card, CardContent } from '../components/Card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../components/Table';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <Card>
    <CardContent className="flex items-center p-6">
      <div className="p-3 rounded-full bg-primary-50 text-primary-600 mr-4">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0,
    recentApplicants: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await recruiterService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your active job postings and candidate pipeline.</p>
        </div>
        <Button onClick={() => navigate('/recruiter/jobs/create')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} />
        <StatsCard title="Total Applications" value={stats.totalApplications} icon={Users} />
        <StatsCard title="Shortlisted" value={stats.shortlisted} icon={CheckCircle} />
        <StatsCard title="Interviews" value={stats.interviews} icon={Calendar} />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Applicants</h2>
          <Button variant="outline" onClick={() => navigate('/recruiter/applicants')}>View All</Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableHead>Candidate Name</TableHead>
              <TableHead>Applied Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Applied</TableHead>
            </TableHeader>
            <TableBody>
              {stats.recentApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="p-0">
                    <EmptyState title="No applicants yet" description="You don't have any recent applicants." />
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentApplicants.map((applicant) => (
                  <TableRow key={applicant._id}>
                    <TableCell className="font-medium text-gray-900">{applicant.name}</TableCell>
                    <TableCell>{applicant.role}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        applicant.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        applicant.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                        applicant.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {applicant.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(applicant.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
