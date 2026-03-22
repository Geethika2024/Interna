import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [form, setForm] = useState({ availabilityStatus: 'immediate', availabilityDetails: '', resume: null });

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const [internRes, appRes] = await Promise.all([
          API.get('/internships/' + id),
          API.get('/applications/my')
        ]);
        setInternship(internRes.data);
        setAlreadyApplied(appRes.data.some(a => a.internshipId?._id === id));
      } catch (err) {
        toast.error('Failed to load internship');
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.resume) return toast.error('Please upload your resume');
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('internshipId', id);
      formData.append('availabilityStatus', form.availabilityStatus);
      formData.append('availabilityDetails', form.availabilityDetails);
      formData.append('resume', form.resume);
      await API.post('/applications/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted!');
      setAlreadyApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e8e4d9', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
    </div>
  );

  if (!internship) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <p style={{ color: '#9ca3af' }}>Internship not found</p>
    </div>
  );

  const daysLeft = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const serif = { fontFamily: 'Playfair Display, serif' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header bar */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            ← Back to Browse
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Main card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 24px rgba(26,39,68,0.06)' }}>

          {/* Gold top bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)' }}></div>

          <div style={{ padding: '40px' }}>

            {/* Top section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div style={{ flex: 1 }}>
                {/* IIT badge */}
                <div style={{ display: 'inline-block', backgroundColor: '#f0ebe0', color: '#8a6c2a', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px', marginBottom: '14px' }}>
                  {internship.iitName}
                </div>

                <h1 style={{ ...serif, fontSize: '28px', fontWeight: '700', color: '#1a2744', marginBottom: '10px', lineHeight: '1.2' }}>
                  {internship.title}
                </h1>

                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1a2744' }}>{internship.professorId?.name}</span>
                  {' · '}{internship.professorId?.department}
                </p>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                  {internship.professorId?.email}
                </p>
              </div>

              {/* Stipend + deadline */}
              <div style={{ textAlign: 'right', marginLeft: '32px' }}>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a2744', ...serif, marginBottom: '4px' }}>
                  {internship.stipend > 0 ? '₹' + internship.stipend.toLocaleString() : 'Unpaid'}
                </p>
                {internship.stipend > 0 && <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>per month</p>}
                <div style={{
                  display: 'inline-block', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                  backgroundColor: daysLeft <= 3 ? '#fef2f2' : daysLeft <= 7 ? '#fffbeb' : '#f0fdf4',
                  color: daysLeft <= 3 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#16a34a',
                  border: '1px solid ' + (daysLeft <= 3 ? '#fecaca' : daysLeft <= 7 ? '#fde68a' : '#bbf7d0')
                }}>
                  {daysLeft <= 0 ? 'Deadline passed' : daysLeft + ' days left'}
                </div>
              </div>
            </div>

            {/* Tags row */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '12px', backgroundColor: '#f0ebe0', color: '#8a6c2a', padding: '5px 14px', borderRadius: '20px', fontWeight: '600' }}>{internship.domain}</span>
              <span style={{ fontSize: '12px', backgroundColor: internship.mode === 'Online' ? '#e8f5ee' : '#fff3e0', color: internship.mode === 'Online' ? '#2d7a4f' : '#e65100', padding: '5px 14px', borderRadius: '20px', fontWeight: '600' }}>{internship.mode}</span>
              <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '5px 14px', borderRadius: '20px' }}>{internship.duration}</span>
              <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '5px 14px', borderRadius: '20px' }}>{internship.positions} position{internship.positions !== 1 ? 's' : ''}</span>
            </div>

            {/* About */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ ...serif, fontSize: '16px', fontWeight: '700', color: '#1a2744', marginBottom: '12px' }}>About this Internship</h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.9' }}>{internship.description}</p>
            </div>

            {/* Skills */}
            {internship.skills?.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ ...serif, fontSize: '16px', fontWeight: '700', color: '#1a2744', marginBottom: '12px' }}>Required Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {internship.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: '12px', backgroundColor: '#1a2744', color: 'white', padding: '5px 14px', borderRadius: '6px', fontWeight: '500' }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', backgroundColor: '#f9f8f5', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
              {[
                { label: 'Deadline', value: new Date(internship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Duration', value: internship.duration },
                { label: 'Mode', value: internship.mode },
                { label: 'Positions', value: internship.positions },
              ].map(d => (
                <div key={d.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '6px' }}>{d.label}</p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744' }}>{d.value}</p>
                </div>
              ))}
            </div>

            {/* Apply button */}
            {alreadyApplied ? (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#16a34a', fontWeight: '700', fontSize: '15px' }}>✓ You have already applied to this internship</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Track your status in My Applications</p>
              </div>
            ) : daysLeft <= 0 ? (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>Application deadline has passed</p>
              </div>
            ) : (
              <button
                onClick={() => setShowApplyForm(!showApplyForm)}
                style={{
                  width: '100%', padding: '16px',
                  backgroundColor: showApplyForm ? 'white' : '#1a2744',
                  color: showApplyForm ? '#1a2744' : 'white',
                  border: '2px solid #1a2744',
                  borderRadius: '12px', fontSize: '14px',
                  fontWeight: '700', letterSpacing: '1px',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {showApplyForm ? 'Cancel Application' : 'Apply Now →'}
              </button>
            )}
          </div>
        </div>

        {/* Apply Form */}
        {showApplyForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '40px', boxShadow: '0 4px 24px rgba(26,39,68,0.06)' }}>
            <h2 style={{ ...serif, fontSize: '22px', fontWeight: '700', color: '#1a2744', marginBottom: '28px' }}>
              Submit Your Application
            </h2>

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a2744', marginBottom: '16px' }}>
                  Are you available immediately?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { value: 'immediate', label: 'Yes, I am available immediately' },
                    { value: 'later', label: 'No, I have a specific timeline' },
                  ].map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px 18px', borderRadius: '10px', border: '1px solid', borderColor: form.availabilityStatus === opt.value ? '#c9a84c' : '#e8e4d9', backgroundColor: form.availabilityStatus === opt.value ? '#fdf8ec' : 'white', transition: 'all 0.2s' }}>
                      <input type="radio" name="availability" value={opt.value}
                        checked={form.availabilityStatus === opt.value}
                        onChange={() => setForm({ ...form, availabilityStatus: opt.value })}
                        style={{ accentColor: '#c9a84c' }}
                      />
                      <span style={{ fontSize: '14px', color: '#1a2744', fontWeight: form.availabilityStatus === opt.value ? '600' : '400' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>

                {form.availabilityStatus === 'later' && (
                  <textarea
                    value={form.availabilityDetails}
                    onChange={e => setForm({ ...form, availabilityDetails: e.target.value })}
                    placeholder="Describe your availability timeline..."
                    rows={3}
                    style={{ marginTop: '12px', width: '100%', border: '1px solid #e8e4d9', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#1a2744', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif' }}
                  />
                )}
              </div>

              {/* Resume upload */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a2744', marginBottom: '12px' }}>Upload Resume</p>
                <label htmlFor="resume-upload" style={{ display: 'block', border: '2px dashed', borderColor: form.resume ? '#c9a84c' : '#e8e4d9', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', backgroundColor: form.resume ? '#fdf8ec' : '#f9f8f5', transition: 'all 0.2s' }}>
                  <input type="file" accept=".pdf" id="resume-upload" onChange={e => setForm({ ...form, resume: e.target.files[0] })} style={{ display: 'none' }} />
                  {form.resume ? (
                    <div>
                      <p style={{ fontSize: '24px', marginBottom: '8px' }}>📄</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#c9a84c' }}>{form.resume.name}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '32px', marginBottom: '12px' }}>📄</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a2744', marginBottom: '4px' }}>Click to upload your resume</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>PDF only · Max 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                type="submit" disabled={applying}
                style={{ width: '100%', padding: '16px', backgroundColor: '#c9a84c', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer', opacity: applying ? 0.7 : 1, transition: 'opacity 0.2s' }}
              >
                {applying ? 'Submitting...' : 'Submit Application →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;