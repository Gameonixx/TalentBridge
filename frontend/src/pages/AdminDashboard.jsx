import { Users, Building2, FileText, CheckCircle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';

export const AdminDashboard = () => {
  const columns = [
    { header: 'Activity', accessor: 'activity' },
    { header: 'User/Company', accessor: 'entity' },
    { header: 'Date', accessor: 'date' },
  ];

  const recentActivity = [
    // Placeholder data
    { activity: 'New Job Posted: Frontend Dev', entity: 'TechCorp', date: 'Just now' },
    { activity: 'Student Registered', entity: 'Alice Johnson', date: '2 hours ago' },
    { activity: 'Company Onboarded', entity: 'InnovateInc', date: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and system activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Students" value="1,245" icon={Users} trend={12} />
        <StatsCard title="Companies Visited" value="48" icon={Building2} trend={3} />
        <StatsCard title="Total Applications" value="3,892" icon={FileText} trend={24} />
        <StatsCard title="Students Placed" value="840" icon={CheckCircle} trend={8} />
      </div>

      <div className="mt-8">
        <DataTable 
          title="System Activity" 
          columns={columns} 
          data={recentActivity} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
