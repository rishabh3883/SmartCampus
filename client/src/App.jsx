import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import AdminEvents from './pages/admin/AdminEvents';
import StudentEvents from './pages/student/StudentEvents';
import AdminLibrary from './pages/admin/AdminLibrary';
import AdminReports from './pages/admin/AdminReports';
import AdminEnvironment from './pages/admin/AdminEnvironment';
import InfraNews from './pages/employee/InfraNews';
import StudentLibrary from './pages/student/StudentLibrary';
import SecurityDashboard from './pages/security/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />



          {/* Student Routes */}
          <Route element={<ProtectedRoute roles={['Student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/events" element={<StudentEvents />} />
            <Route path="/student/library" element={<StudentLibrary />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/library" element={<AdminLibrary />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/environment" element={<AdminEnvironment />} />
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRoute roles={['Employee', 'Admin']} />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/infra-news" element={<InfraNews />} />
          </Route>

          {/* Security Routes */}
          <Route element={<ProtectedRoute roles={['Security', 'Admin']} />}>
            <Route path="/security" element={<SecurityDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
