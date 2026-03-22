import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.3px',
    color: isActive(path) ? '#c9a84c' : 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    paddingBottom: '2px',
    borderBottom: isActive(path) ? '1px solid #c9a84c' : '1px solid transparent',
    transition: 'all 0.2s'
  });

  return (
    <nav style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.15)' }}
      className="sticky top-0 z-50">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo text only */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '22px', fontWeight: '700',
              color: 'white', letterSpacing: '0.5px'
            }}>Interna</span>
            <span style={{
              fontSize: '9px', color: '#c9a84c',
              letterSpacing: '2px', textTransform: 'uppercase',
              marginTop: '4px', fontWeight: '500'
            }}>Portal</span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
              {user.role === 'student' ? (
                <>
                  <Link to="/student/dashboard" style={navLinkStyle('/student/dashboard')}>Browse</Link>
                  <Link to="/student/wishlist" style={navLinkStyle('/student/wishlist')}>Wishlist</Link>
                  <Link to="/student/applications" style={navLinkStyle('/student/applications')}>My Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/professor/dashboard" style={navLinkStyle('/professor/dashboard')}>My Internships</Link>
                  <Link to="/professor/applicants" style={navLinkStyle('/professor/applicants')}>Applicants</Link>
                  <Link to="/professor/post" style={navLinkStyle('/professor/post')}>Post Internship</Link>
                </>
              )}
            </div>
          )}

          {/* Right side */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px',
                  backgroundColor: '#c9a84c',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700', color: 'white'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: 'white', fontWeight: '500', lineHeight: '1.2' }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: '#c9a84c',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#c9a84c';
                  e.target.style.color = '#1a2744';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#c9a84c';
                }}
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;