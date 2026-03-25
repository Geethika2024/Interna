import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const taglines = [
  'Shaping the next generation of researchers.',
  'Your research, their future.',
  'Building tomorrow\'s innovators today.',
  'Excellence in research starts here.',
];

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const tagline = taglines[new Date().getDay() % taglines.length];
  const serif = { fontFamily: 'Playfair Display, serif' };

  const fetchData = async () => {
    try {
      const [intRes, appRes] = await Promise.all([
        API.get('/internships/professor/my'),
        API.get('/applications/professor/all'),
      ]);
      setInternships(intRes.data);
      setApplications(appRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await API.delete('/internships/' + id);
      setInternships(internships.filter(i => i._id !== id));
      toast.success('Internship deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await API.put('/applications/' + appId + '/status', { status });
      setApplications(applications.map(a => a._id === appId ? { ...a, status } : a));
      toast.success('Marked as ' + status);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const getStatusBg = (status) => {
    if (status === 'Applied') return '#eff6ff';
    if (status === 'In Review') return '#fffbeb';
    if (status === 'Accepted') return '#f0fdf4';
    if (status === 'Rejected') return '#fef2f2';
    return '#f3f4f6';
  };

  const getStatusColor = (status) => {
    if (status === 'Applied') return '#1d4ed8';
    if (status === 'In Review') return '#b45309';
    if (status === 'Accepted') return '#15803d';
    if (status === 'Rejected') return '#b91c1c';
    return '#6b7280';
  };

  const getStatusBorder = (status) => {
    if (status === 'Applied') return '1px solid #bfdbfe';
    if (status === 'In Review') return '1px solid #fde68a';
    if (status === 'Accepted') return '1px solid #bbf7d0';
    if (status === 'Rejected') return '1px solid #fecaca';
    return '1px solid #e5e7eb';
  };

  const getBtnBg = (s, current) => {
    if (s === current) return '#f3f4f6';
    if (s === 'Accepted') return '#f0fdf4';
    if (s === 'Rejected') return '#fef2f2';
    return '#fffbeb';
  };

  const getBtnColor = (s, current) => {
    if (s === current) return '#9ca3af';
    if (s === 'Accepted') return '#15803d';
    if (s === 'Rejected') return '#b91c1c';
    return '#b45309';
  };

  const getBtnBorder = (s, current) => {
    if (s === current) return '1px solid #e5e7eb';
    if (s === 'Accepted') return '1px solid #bbf7d0';
    if (s === 'Rejected') return '1px solid #fecaca';
    return '1px solid #fde68a';
  };

  const stats = {
    total: applications.length,
    active: internships.filter(i => i.isActive).length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
  };

  const urgentInternships = internships.filter(i => {
    const days = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 5 && days > 0;
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e8e4d9', borderTopColor: '#c9a84c', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header banner */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '24px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ ...serif, fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              Hello, {user?.name} 👋
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>{tagline}</p>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {[
              { label: 'Applications', value: stats.total, color: '#c9a84c' },
              { label: 'Active', value: stats.active, color: '#60a5fa' },
              { label: 'Selected', value: stats.accepted, color: '#34d399' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
            <button
              onClick={() => navigate('/professor/post')}
              style={{ backgroundColor: '#c9a84c', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              + Post Internship
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

        

        {/* My Internships */}
        <div style={{ marginBottom: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
              <h2 style={{ ...serif, fontSize: '20px', fontWeight: '700', color: '#1a2744' }}>My Internships</h2>
            </div>
            <button onClick={() => navigate('/professor/post')}
              style={{ backgroundColor: 'transparent', border: '1px solid #1a2744', color: '#1a2744', borderRadius: '8px', padding: '8px 18px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              + New
            </button>
          </div>

          {internships.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
              <p style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>No internships posted yet</p>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>Post your first internship to start receiving applications</p>
              <button onClick={() => navigate('/professor/post')}
                style={{ backgroundColor: '#1a2744', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Post Internship
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {internships.map(i => {
                const daysLeft = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={i._id}
                    style={{ backgroundColor: 'white', border: '1px solid #e8e4d9', borderRadius: '14px', padding: '24px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4d9'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#c9a84c', opacity: 0.6 }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ ...serif, fontSize: '15px', fontWeight: '700', color: '#1a2744', flex: 1, marginRight: '8px' }}>{i.title}</h3>
                      <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', backgroundColor: daysLeft <= 0 ? '#fef2f2' : '#f0fdf4', color: daysLeft <= 0 ? '#b91c1c' : '#15803d' }}>
                        {daysLeft <= 0 ? 'Expired' : 'Active'}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>{i.domain} · {i.mode} · {i.duration}</p>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '2px' }}>Applicants</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#1a2744', fontFamily: 'Playfair Display, serif' }}>{i.applicantCount || 0}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '2px' }}>Deadline</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: daysLeft <= 3 ? '#dc2626' : '#1a2744' }}>
                          {new Date(i.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '2px' }}>Stipend</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>
                          {i.stipend > 0 ? '₹' + i.stipend.toLocaleString() : 'Unpaid'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                      <button onClick={() => navigate('/professor/applicants/' + i._id)}
                        style={{ flex: 1, padding: '8px', backgroundColor: '#1a2744', color: 'white', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                        View Applicants
                      </button>
                      <button onClick={() => navigate('/professor/edit/' + i._id)}
                        style={{ padding: '8px 14px', backgroundColor: 'white', color: '#1a2744', border: '1px solid #e8e4d9', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(i._id)}
                        style={{ padding: '8px 14px', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div style={{ marginBottom: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
            <h2 style={{ ...serif, fontSize: '20px', fontWeight: '700', color: '#1a2744' }}>Recent Applications</h2>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{applications.length} total</span>
          </div>

          {applications.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>👥</p>
              <p style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>No applications yet</p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Applications will appear here once students apply</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {applications.slice(0, 8).map(app => (
                <div key={app._id}
                  style={{ backgroundColor: 'white', border: '1px solid #e8e4d9', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,168,76,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4d9'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f0ebe0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: '#8a6c2a', flexShrink: 0 }}>
                      {app.studentId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a2744', marginBottom: '2px' }}>{app.studentId?.name}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>{app.studentId?.email}</p>
                    </div>
                  </div>

                  {/* Internship */}
                  <div style={{ flex: 1, padding: '0 16px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744', marginBottom: '2px' }}>{app.internshipId?.title}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af' }}>{app.internshipId?.iitName}</p>
                  </div>

                  {/* Resume */}
                  <div style={{ marginRight: '20px' }}>
                    <a
                      href={"http://localhost:5000" + app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', fontWeight: '600', color: '#c9a84c', textDecoration: 'none', backgroundColor: '#fdf8ec', padding: '6px 14px', borderRadius: '20px', border: '1px solid #f0ebe0' }}
                    >
                      Resume
                    </a>
                  </div>

                  {/* Status badge */}
                  <div style={{ marginRight: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 14px', borderRadius: '20px', backgroundColor: getStatusBg(app.status), color: getStatusColor(app.status), border: getStatusBorder(app.status) }}>
                      {app.status}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Accepted', 'In Review', 'Rejected'].map(s => (
                      <button
                        key={s}
                        onClick={() => s !== app.status && handleStatusUpdate(app._id, s)}
                        style={{ fontSize: '11px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', cursor: s === app.status ? 'default' : 'pointer', backgroundColor: getBtnBg(s, app.status), color: getBtnColor(s, app.status), border: getBtnBorder(s, app.status) }}
                      >
                        {s === 'In Review' ? 'Review' : s === 'Accepted' ? 'Accept' : 'Reject'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {applications.length > 8 && (
                <button onClick={() => navigate('/professor/applicants')}
                  style={{ width: '100%', padding: '14px', backgroundColor: 'white', border: '1px dashed #c9a84c', borderRadius: '12px', color: '#c9a84c', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  View all {applications.length} applications
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer>
          <div style={{ backgroundColor: '#1a2744', borderRadius: '16px', padding: '48px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              <div>
                <h3 style={{ ...serif, fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Interna</h3>
                <p style={{ fontSize: '11px', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Research Internship Portal</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', maxWidth: '260px' }}>
                  Empowering IIT professors to find the brightest research minds across India.
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>Professor</p>
                {['Post Internship', 'View Applicants', 'Manage Listings', 'Dashboard'].map(l => (
                  <p key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#c9a84c'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >{l}</p>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>Students</p>
                {['Browse Internships', 'Apply Now', 'Track Status', 'Wishlist'].map(l => (
                  <p key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>{l}</p>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>IIT Network</p>
                {['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur', '+ 18 more'].map(l => (
                  <p key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>{l}</p>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>2026 Interna. All rights reserved.</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Indian Institutes of Technology</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ProfessorDashboard;