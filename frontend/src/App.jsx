import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateJob from './pages/CreateJob';
import StudentJobs from './pages/StudentJobs';
import StudentApplications from './pages/StudentApplications';
import StudentProfile from './pages/StudentProfile';
import RecruiterJobs from './pages/RecruiterJobs';
import RecruiterApplicants from './pages/RecruiterApplicants';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes wrapped in DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                
                {/* Role-based Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/jobs" element={<StudentJobs />} />
                  <Route path="/student/applications" element={<StudentApplications />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                  <Route path="/student/*" element={<div className="p-8 text-center text-gray-500">Page under construction</div>} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                  <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                  <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
                  <Route path="/recruiter/jobs/create" element={<CreateJob />} />
                  <Route path="/recruiter/jobs/edit/:id" element={<CreateJob />} />
                  <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
                  <Route path="/recruiter/*" element={<div className="p-8 text-center text-gray-500">Page under construction</div>} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/*" element={<div className="p-8 text-center text-gray-500">Page under construction</div>} />
                </Route>
                
              </Route>
            </Route>

            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
