import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';


import Login  from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import StudentDashboard  from './pages/student/Dashboard';
import StudentWishlist   from './pages/student/Wishlist';
import MyApplications    from './pages/student/MyApplications';
import InternshipDetail  from './pages/student/InternshipDetail';
import ProfessorDashboard from './pages/professor/Dashboard';
import PostInternship     from './pages/professor/PostInternship';
import ViewApplicants     from './pages/professor/ViewApplicants';
import EditInternship     from './pages/professor/EditInternship';
import Applicants         from './pages/professor/Applicants';

const AppLayout = () => {
  const location = useLocation();
 const hideNavbar = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/student/dashboard"       element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/wishlist"         element={<ProtectedRoute role="student"><StudentWishlist /></ProtectedRoute>} />
        <Route path="/student/applications"     element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>} />
        <Route path="/student/internship/:id"   element={<ProtectedRoute role="student"><InternshipDetail /></ProtectedRoute>} />
        <Route path="/professor/dashboard"      element={<ProtectedRoute role="professor"><ProfessorDashboard /></ProtectedRoute>} />
        <Route path="/professor/post"           element={<ProtectedRoute role="professor"><PostInternship /></ProtectedRoute>} />
        <Route path="/professor/applicants/:id" element={<ProtectedRoute role="professor"><ViewApplicants /></ProtectedRoute>} />
        <Route path="/professor/applicants"     element={<ProtectedRoute role="professor"><Applicants /></ProtectedRoute>} />
        <Route path="/professor/edit/:id"       element={<ProtectedRoute role="professor"><EditInternship /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;