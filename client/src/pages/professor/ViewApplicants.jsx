import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ViewApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const serif = { fontFamily: 'Playfair Display, serif' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, intRes] = await Promise.all([
          API.get('/applications/internship/' + id),
          API.get('/internships/' + id)
        ]);
        setApplications(appRes.data);
        setInternship(intRes.data);
      } catch (err) {
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e8e4d9', borderTopColor: '#c9a84c', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '24px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            ← Back to Dashboard
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ ...serif, fontSize: '26px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                {internship?.title}
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                {internship?.iitName} · {internship?.domain} · {internship?.mode}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Total', value: applications.length, color: '#c9a84c' },
                { label: 'Accepted', value: applications.filter(a => a.status === 'Accepted').length, color: '#34d399' },
                { label: 'In Review', value: applications.filter(a => a.status === 'In Review').length, color: '#fbbf24' },
                { label: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, color: '#f87171' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '22px', fontWeight: '700', color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

        {applications.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '80px', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>👥</p>
            <p style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '8px' }}>No applications yet</p>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>Students haven't applied to this internship yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {applications.map((app, index) => (
              <div key={app._id}
                style={{ backgroundColor: 'white', border: '1px solid #e8e4d9', borderRadius: '14px', padding: '24px 28px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4d9'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Status left accent */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: getStatusColor(app.status), borderRadius: '14px 0 0 14px' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                  {/* Index + Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', color: '#d1d5db', fontWeight: '600', width: '20px' }}>#{index + 1}</span>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f0ebe0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#8a6c2a' }}>
                      {app.studentId?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Student info */}
                  <div style={{ flex: 1.5 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '3px' }}>
                      {app.studentId?.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{app.studentId?.email}</p>
                  </div>

                  {/* Availability */}
                  <div style={{ flex: 1, borderLeft: '1px solid #f3f4f6', paddingLeft: '20px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px' }}>Availability</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>
                      {app.availabilityStatus === 'immediate' ? '✓ Immediate' : 'Later'}
                    </p>
                    {app.availabilityDetails && (
                      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{app.availabilityDetails}</p>
                    )}
                  </div>

                  {/* Applied date */}
                  <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: '20px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px' }}>Applied On</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a2744' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Resume */}
                  <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: '20px' }}>
                    
                     <a href={"http://localhost:5000" + app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', fontWeight: '600', color: '#c9a84c', textDecoration: 'none', backgroundColor: '#fdf8ec', padding: '8px 16px', borderRadius: '20px', border: '1px solid #f0ebe0', whiteSpace: 'nowrap', display: 'block' }}
                    >
                      View Resume ↗
                    </a>
                  </div>

                  {/* Status + Actions */}
                  <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
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

export default ViewApplicants;