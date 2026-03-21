import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';

// Auth pages
import Login  from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Student pages (we'll create these next)
import StudentDashboard  from './pages/student/Dashboard';
import StudentWishlist   from './pages/student/Wishlist';
import MyApplications    from './pages/student/MyApplications';
import InternshipDetail  from './pages/student/InternshipDetail';

// Professor pages (we'll create these next)
import ProfessorDashboard from './pages/professor/Dashboard';
import PostInternship     from './pages/professor/PostInternship';
import ViewApplicants     from './pages/professor/ViewApplicants';
import EditInternship     from './pages/professor/EditInternship';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"        element={<Navigate to="/login" />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />

          {/* Student routes */}
          <Route path="/student/dashboard"         element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/wishlist"           element={<ProtectedRoute role="student"><StudentWishlist /></ProtectedRoute>} />
          <Route path="/student/applications"       element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>} />
          <Route path="/student/internship/:id"     element={<ProtectedRoute role="student"><InternshipDetail /></ProtectedRoute>} />

          {/* Professor routes */}
          <Route path="/professor/dashboard"        element={<ProtectedRoute role="professor"><ProfessorDashboard /></ProtectedRoute>} />
          <Route path="/professor/post"             element={<ProtectedRoute role="professor"><PostInternship /></ProtectedRoute>} />
          <Route path="/professor/applicants/:id"   element={<ProtectedRoute role="professor"><ViewApplicants /></ProtectedRoute>} />
          <Route path="/professor/edit/:id"         element={<ProtectedRoute role="professor"><EditInternship /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;