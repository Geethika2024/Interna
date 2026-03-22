import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
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

  return (
    <div className="min-h-screen flex">

      {/* Left Panel - Navy with background */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: '#1a2744' }}
      >
        {/* Background pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.15)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.1)'
        }}></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div style={{ backgroundColor: '#c9a84c' }} className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-bold text-3xl" style={serif}>In</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2" style={serif}>Interna</h1>
          <p style={{ color: '#c9a84c' }} className="text-sm font-medium tracking-widest uppercase mb-10">
            Research Internship Portal
          </p>

          <div style={{ width: '60px', height: '2px', backgroundColor: '#c9a84c', margin: '0 auto 24px' }}></div>

          <h2 className="text-2xl font-bold text-white mb-4" style={serif}>
            Hey! Welcome
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Connect with IIT professors and discover research opportunities that shape your future.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 py-12 bg-white">

        {/* Top right link */}
        <div className="flex justify-end mb-8">
          <Link to="/signup" className="text-sm text-gray-400 hover:text-gray-600">
            Create a new Account
          </Link>
        </div>

        <div className="max-w-sm mx-auto w-full flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ ...serif, color: '#1a2744' }}>
            Log in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email input */}
            <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 gap-3 focus-within:border-yellow-500 transition"
              style={{ backgroundColor: '#f9f9f9' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="IIT Email Address" required
                className="flex-1 text-sm focus:outline-none bg-transparent text-gray-700"
              />
            </div>

            {/* Password input */}
            <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 gap-3 focus-within:border-yellow-500 transition"
              style={{ backgroundColor: '#f9f9f9' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Password" required
                className="flex-1 text-sm focus:outline-none bg-transparent text-gray-700"
              />
            </div>

            {/* Log in button */}
            <div className="pt-2">
              <button
                type="submit" disabled={loading}
                style={{ backgroundColor: '#c9a84c' }}
                className="w-full text-white py-3.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition text-sm tracking-wide shadow-md"
              >
                {loading ? 'Signing in...' : 'Log in'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">Or with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Demo buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ email: 'rahul@iitb.ac.in', password: 'test1234' })}
                style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
                className="py-2.5 rounded-lg text-xs font-semibold border-2 hover:bg-yellow-50 transition"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: 'priya@iitd.ac.in', password: 'test1234' })}
                style={{ borderColor: '#1a2744', color: '#1a2744' }}
                className="py-2.5 rounded-lg text-xs font-semibold border-2 hover:bg-blue-50 transition"
              >
                Demo Professor
              </button>
            </div>

          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center text-sm text-gray-400 mt-8">
          New to Interna?{' '}
          <Link to="/signup" style={{ color: '#c9a84c' }} className="font-semibold hover:underline">
            Sign up here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;