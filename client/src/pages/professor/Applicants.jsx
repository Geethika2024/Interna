import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Applicants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const serif = { fontFamily: 'Playfair Display, serif' };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await API.get('/applications/professor/all');
        setApplications(data);
      } catch (err) {
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleStatus = async (appId, status) => {
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

  const filters = ['All', 'Applied', 'In Review', 'Accepted', 'Rejected'];
  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    inReview: applications.filter(a => a.status === 'In Review').length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e8e4d9', borderTopColor: '#c9a84c', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '24px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ ...serif, fontSize: '26px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              All Applicants
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              Managing applications for {user?.name}
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Total', value: stats.total, color: '#c9a84c' },
              { label: 'Applied', value: stats.applied, color: '#60a5fa' },
              { label: 'In Review', value: stats.inReview, color: '#fbbf24' },
              { label: 'Accepted', value: stats.accepted, color: '#34d399' },
              { label: 'Rejected', value: stats.rejected, color: '#f87171' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '22px', fontWeight: '700', color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '600',
                border: '1px solid',
                cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: filter === f ? '#1a2744' : 'white',
                borderColor: filter === f ? '#1a2744' : '#e8e4d9',
                color: filter === f ? 'white' : '#6b7280'
              }}
            >
              {f} {f === 'All' ? '(' + stats.total + ')' : f === 'Applied' ? '(' + stats.applied + ')' : f === 'In Review' ? '(' + stats.inReview + ')' : f === 'Accepted' ? '(' + stats.accepted + ')' : '(' + stats.rejected + ')'}
            </button>
          ))}
        </div>

        {/* Applications list */}
        {filtered.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '80px', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>👥</p>
            <p style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>
              No {filter === 'All' ? '' : filter.toLowerCase()} applications
            </p>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>
              {filter === 'All' ? 'Applications will appear here once students apply' : 'No applications with this status yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(app => (
              <div key={app._id}
                style={{ backgroundColor: 'white', border: '1px solid #e8e4d9', borderRadius: '14px', padding: '24px 28px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4d9'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Left accent */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: getStatusBg(app.status), borderLeft: '4px solid ' + getStatusColor(app.status), borderRadius: '14px 0 0 14px' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                  {/* Avatar */}
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#f0ebe0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#8a6c2a', flexShrink: 0 }}>
                    {app.studentId?.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Student info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '3px' }}>
                      {app.studentId?.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{app.studentId?.email}</p>
                  </div>

                  {/* Internship */}
                  <div style={{ flex: 1, padding: '0 16px', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px' }}>Applied For</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a2744', marginBottom: '2px' }}>{app.internshipId?.title}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{app.internshipId?.iitName}</p>
                  </div>

                  {/* Availability */}
                  <div style={{ flex: 1, padding: '0 16px', borderRight: '1px solid #f3f4f6' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px' }}>Availability</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>
                      {app.availabilityStatus === 'immediate' ? 'Immediate' : 'Later'}
                    </p>
                    {app.availabilityDetails && (
                      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{app.availabilityDetails}</p>
                    )}
                  </div>

                  {/* Applied date */}
                  <div style={{ padding: '0 16px', borderRight: '1px solid #f3f4f6' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px' }}>Applied</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  {/* Resume */}
                  <div style={{ padding: '0 16px', borderRight: '1px solid #f3f4f6' }}>
                    <a
                      href={"http://localhost:5000" + app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', fontWeight: '600', color: '#c9a84c', textDecoration: 'none', backgroundColor: '#fdf8ec', padding: '6px 14px', borderRadius: '20px', border: '1px solid #f0ebe0', whiteSpace: 'nowrap' }}
                    >
                      View Resume
                    </a>
                  </div>

                  {/* Status + Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 14px', borderRadius: '20px', backgroundColor: getStatusBg(app.status), color: getStatusColor(app.status), border: getStatusBorder(app.status), whiteSpace: 'nowrap' }}>
                      {app.status}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Accepted', 'In Review', 'Rejected'].map(s => (
                        <button
                          key={s}
                          onClick={() => s !== app.status && handleStatus(app._id, s)}
                          style={{ fontSize: '11px', fontWeight: '600', padding: '5px 10px', borderRadius: '6px', cursor: s === app.status ? 'default' : 'pointer', backgroundColor: getBtnBg(s, app.status), color: getBtnColor(s, app.status), border: getBtnBorder(s, app.status) }}
                        >
                          {s === 'In Review' ? 'Review' : s === 'Accepted' ? 'Accept' : 'Reject'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
