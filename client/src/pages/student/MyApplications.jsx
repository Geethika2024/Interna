import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await API.get('/applications/my');
        setApplications(data);
      } catch (err) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusStyle = (status) => {
    if (status === 'Applied') return { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
    if (status === 'In Review') return { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
    if (status === 'Accepted') return { backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
    if (status === 'Rejected') return { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
    return {};
  };

  const getModeStyle = (mode) => ({
    fontSize: '12px',
    backgroundColor: mode === 'Online' ? '#e8f5ee' : '#fff3e0',
    color: mode === 'Online' ? '#2d7a4f' : '#e65100',
    padding: '4px 12px', borderRadius: '20px', fontWeight: '600'
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e8e4d9', borderTopColor: '#c9a84c', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '28px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            My Applications
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9' }}>
            <p style={{ fontSize: '48px', marginBottom: '20px' }}>📋</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
              No applications yet
            </p>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
              Browse internships and apply to get started
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              style={{ backgroundColor: '#1a2744', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              Browse Internships
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map(app => {
              const internship = app.internshipId;
              const daysLeft = Math.ceil((new Date(internship?.deadline) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={app._id} style={{
                  backgroundColor: 'white', border: '1px solid #e8e4d9',
                  borderRadius: '14px', padding: '28px 32px',
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4d9'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Left accent */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#1a2744', borderRadius: '14px 0 0 14px' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>

                      {/* Title + professor */}
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '5px' }}>
                        {internship?.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
                        {internship?.professorId?.name} · {internship?.iitName}
                      </p>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <span style={getModeStyle(internship?.mode)}>{internship?.mode}</span>
                        <span style={{ fontSize: '12px', backgroundColor: '#f0ebe0', color: '#8a6c2a', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                          {internship?.domain}
                        </span>
                        {internship?.duration && (
                          <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '4px 12px', borderRadius: '20px' }}>
                            {internship?.duration}
                          </span>
                        )}
                      </div>

                      {/* Dates row */}
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '2px' }}>Applied on</p>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>
                            {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '2px' }}>Deadline</p>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: daysLeft <= 3 ? '#dc2626' : '#1a2744' }}>
                            {new Date(internship?.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        {app.resumeUrl && (
                          <div>
                            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '2px' }}>Resume</p>

  <a href={"http://localhost:5000" + app.resumeUrl}
  target="_blank"
  rel="noopener noreferrer"
  style={{ fontSize: '13px', fontWeight: '600', color: '#c9a84c', textDecoration: 'none' }}
>
  View PDF ↗
</a>
                              
                            
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div style={{ marginLeft: '24px', textAlign: 'center' }}>
                      <span style={{ ...getStatusStyle(app.status), fontSize: '12px', fontWeight: '700', padding: '8px 16px', borderRadius: '20px', display: 'block', whiteSpace: 'nowrap' }}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;