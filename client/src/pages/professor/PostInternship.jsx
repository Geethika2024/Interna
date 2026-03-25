import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const PostInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', skills: [], domain: '',
    duration: '', stipend: '', positions: 1,
    iitName: '', mode: 'Online', deadline: ''
  });

  const serif = { fontFamily: 'Playfair Display, serif' };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/internships', { ...form, stipend: Number(form.stipend) || 0 });
      toast.success('Internship posted successfully!');
      navigate('/professor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', border: '1px solid #e8e4d9',
    borderRadius: '10px', padding: '12px 16px',
    fontSize: '14px', color: '#1a2744',
    outline: 'none', backgroundColor: '#fafaf8',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block', fontSize: '11px',
    fontWeight: '700', letterSpacing: '1.5px',
    textTransform: 'uppercase', color: '#9ca3af',
    marginBottom: '8px'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '24px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ ...serif, fontSize: '26px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              Post a New Internship
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              Fill in the details to attract the best research candidates
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '32px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(26,39,68,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
              <h2 style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744' }}>Basic Information</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Internship Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. Machine Learning Research Intern"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                />
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required
                  rows={5} placeholder="Describe the research work, expectations, and what students will learn..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Domain *</label>
                  <input type="text" name="domain" value={form.domain} onChange={handleChange} required
                    placeholder="e.g. Machine Learning"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c9a84c'}
                    onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>IIT Name *</label>
                  <input type="text" name="iitName" value={form.iitName} onChange={handleChange} required
                    placeholder="e.g. IIT Bombay"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c9a84c'}
                    onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '32px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(26,39,68,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
              <h2 style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744' }}>Internship Details</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Duration *</label>
                <input type="text" name="duration" value={form.duration} onChange={handleChange} required
                  placeholder="e.g. 2 months"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                />
              </div>
              <div>
                <label style={labelStyle}>Stipend (₹/month)</label>
                <input type="number" name="stipend" value={form.stipend} onChange={handleChange}
                  placeholder="0 for unpaid"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                />
              </div>
              <div>
                <label style={labelStyle}>Positions *</label>
                <input type="number" name="positions" value={form.positions} onChange={handleChange} min={1} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                />
              </div>
              <div>
                <label style={labelStyle}>Deadline *</label>
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#e8e4d9'}
                />
              </div>
            </div>

            {/* Mode toggle */}
            <div>
              <label style={labelStyle}>Mode *</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Online', 'Offline'].map(m => (
                  <button
                    key={m} type="button"
                    onClick={() => setForm({ ...form, mode: m })}
                    style={{
                      padding: '10px 28px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '600',
                      border: '1px solid',
                      cursor: 'pointer', transition: 'all 0.2s',
                      backgroundColor: form.mode === m ? '#1a2744' : 'white',
                      borderColor: form.mode === m ? '#1a2744' : '#e8e4d9',
                      color: form.mode === m ? 'white' : '#6b7280'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '32px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(26,39,68,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
              <h2 style={{ ...serif, fontSize: '18px', fontWeight: '700', color: '#1a2744' }}>Required Skills</h2>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text" value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                placeholder="Type a skill and press Enter or click Add"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = '#c9a84c'}
                onBlur={e => e.target.style.borderColor = '#e8e4d9'}
              />
              <button
                type="button" onClick={addSkill}
                style={{ backgroundColor: '#1a2744', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                + Add
              </button>
            </div>

            {form.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {form.skills.map(skill => (
                  <span key={skill} style={{ backgroundColor: '#1a2744', color: 'white', fontSize: '13px', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {skill}
                    <button
                      type="button" onClick={() => removeSkill(skill)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#d1d5db', fontStyle: 'italic' }}>No skills added yet</p>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit" disabled={loading}
              style={{ flex: 1, backgroundColor: '#c9a84c', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}
            >
              {loading ? 'Posting...' : 'Post Internship →'}
            </button>
            <button
              type="button" onClick={() => navigate(-1)}
              style={{ padding: '16px 32px', backgroundColor: 'white', color: '#6b7280', border: '1px solid #e8e4d9', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostInternship;
