import { FileText, CheckCircle, Calendar, User } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';

export const StudentDashboard = () => {
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
