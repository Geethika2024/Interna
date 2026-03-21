import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">In</span>
            </div>
            <span className="text-xl font-bold text-indigo-600">Interna</span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              {user.role === 'student' ? (
                <>
                  <Link to="/student/dashboard"    className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Browse</Link>
                  <Link to="/student/wishlist"      className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Wishlist</Link>
                  <Link to="/student/applications"  className="text-gray-600 hover:text-indigo-600 text-sm font-medium">My Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/professor/dashboard"   className="text-gray-600 hover:text-indigo-600 text-sm font-medium">My Internships</Link>
                  <Link to="/professor/applicants"  className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Applicants</Link>
                  <Link to="/professor/post"        className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Post Internship</Link>
                </>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden md:block">
                  Hi, <strong>{user.name.split(' ')[0]}</strong>
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  user.role === 'professor'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"  className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/signup" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign Up</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;