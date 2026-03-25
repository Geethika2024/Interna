import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '', facultyCode: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email: form.email, password: form.password });
      login(data.token, data.user);
      toast.success('Welcome back!');
      if (data.user.role === 'student') navigate('/student/dashboard');
      else navigate('/professor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const serif = { fontFamily: 'Playfair Display, serif' };

  const inputStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 0',
    fontSize: '14px',
    color: '#1a2744',
    outline: 'none',
    backgroundColor: 'transparent',
    letterSpacing: '0.3px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: '4px'
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div style={{ backgroundColor: '#1a2744', width: '42%' }}
        className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Dot texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        {/* Circles */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '350px', height: '350px', borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.12)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '280px', height: '280px', borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.08)'
        }}></div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          
          <h1 style={{ ...serif, color: 'white', fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            Interna
          </h1>

          <p style={{ color: '#c9a84c', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>
            Research Internship Portal
          </p>

          <div style={{ width: '40px', height: '2px', backgroundColor: '#c9a84c', margin: '0 auto 32px' }}></div>

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: '1.9', maxWidth: '260px' }}>
            Connecting students with IIT professors for research opportunities.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, backgroundColor: '#ffffff' }}
        className="flex flex-col">

        {/* Top right */}
        <div className="flex justify-end p-8">
          <Link to="/signup" style={{ color: '#9ca3af', fontSize: '13px' }}
            className="hover:text-gray-600 transition">
            Create a new account
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <div style={{ width: '100%', maxWidth: '380px' }}>

            <h2 style={{ ...serif, color: '#1a2744', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
              Sign In
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '36px' }}>
              Select your role to continue
            </p>

            {/* Role Tabs */}
            <div style={{
              display: 'flex', gap: '0',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '36px'
            }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  flex: 1, padding: '12px',
                  fontSize: '13px', fontWeight: '600',
                  letterSpacing: '0.5px',
                  backgroundColor: role === 'student' ? '#1a2744' : 'white',
                  color: role === 'student' ? 'white' : '#9ca3af',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('professor')}
                style={{
                  flex: 1, padding: '12px',
                  fontSize: '13px', fontWeight: '600',
                  letterSpacing: '0.5px',
                  backgroundColor: role === 'professor' ? '#1a2744' : 'white',
                  color: role === 'professor' ? 'white' : '#9ca3af',
                  border: 'none', cursor: 'pointer',
                  borderLeft: '1px solid #e5e7eb',
                  transition: 'all 0.2s'
                }}
              >
                Professor
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                {/* Email */}
                <div>
                  <label style={labelStyle}>IIT Email Address</label>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange}
                    placeholder="you@iitb.ac.in"
                    required style={inputStyle}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <input
                    type="password" name="password" value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required style={inputStyle}
                  />
                </div>

                {/* Faculty Code - professor only */}
                {role === 'professor' && (
                  <div>
                    <label style={labelStyle}>Faculty Code</label>
                    <input
                      type="text" name="facultyCode" value={form.facultyCode}
                      onChange={handleChange}
                      placeholder="e.g. FAC001"
                      style={inputStyle}
                    />
                  </div>
                )}

                {/* Submit */}
                <div style={{ paddingTop: '8px' }}>
                  <button
                    type="submit" disabled={loading}
                    style={{
                      width: '100%',
                      backgroundColor: '#c9a84c',
                      color: 'white',
                      border: 'none',
                      padding: '15px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      opacity: loading ? 0.7 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>

                

              </div>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '36px' }}>
              New to Interna?{' '}
              <Link to="/signup" style={{ color: '#c9a84c', fontWeight: '600' }}>
                Create account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;