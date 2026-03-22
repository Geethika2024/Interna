import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#1a2744' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div style={{ backgroundColor: '#c9a84c' }} className="w-9 h-9 rounded-lg flex items-center justify-center shadow">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>In</span>
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.5px' }}>
              Interna
            </span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              {user.role === 'student' ? (
                <>
                  <Link to="/student/dashboard" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition">Browse</Link>
                  <Link to="/student/wishlist" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition">Wishlist</Link>
                  <Link to="/student/applications" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition">My Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/professor/dashboard" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition">My Internships</Link>
                  <Link to="/professor/applicants" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition">Applicants</Link>
                  <Link to="/professor/post" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition">Post Internship</Link>
                </>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div style={{ backgroundColor: '#c9a84c' }} className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    <span className="text-white font-medium">{user.name}</span>
                  </span>
                  <span style={{ backgroundColor: 'rgba(201,168,76,0.2)', color: '#c9a84c' }} className="text-xs px-2 py-1 rounded-full font-medium border border-yellow-600">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
                  className="text-sm border px-4 py-1.5 rounded-lg hover:bg-yellow-600 hover:text-white transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white font-medium transition">Login</Link>
                <Link to="/signup" style={{ backgroundColor: '#c9a84c' }} className="text-sm text-white px-4 py-2 rounded-lg hover:opacity-90 font-medium transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;