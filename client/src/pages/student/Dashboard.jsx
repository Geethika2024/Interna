import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const taglines = [
  'Your next breakthrough starts here.',
  'Research that shapes the future.',
  'Where curiosity meets opportunity.',
  'Explore. Learn. Innovate.',
];

const FEATURED = [
  { title: 'Quantum Computing Research', professor: 'Dr. Arjun Nair', iit: 'IIT Bombay', domain: 'Quantum Physics', mode: 'Offline', stipend: 20000, deadline: '2026-05-30' },
  { title: 'AI in Healthcare', professor: 'Dr. Meera Iyer', iit: 'IIT Madras', domain: 'Artificial Intelligence', mode: 'Online', stipend: 18000, deadline: '2026-06-15' },
  { title: 'Robotics & Automation', professor: 'Dr. Sanjay Rao', iit: 'IIT Kharagpur', domain: 'Robotics', mode: 'Offline', stipend: 22000, deadline: '2026-05-20' },
  { title: 'Climate Modelling', professor: 'Dr. Priya Das', iit: 'IIT Delhi', domain: 'Environmental Science', mode: 'Online', stipend: 15000, deadline: '2026-07-01' },
];

const Card = ({ internship, isWishlisted, onWishlistToggle, onClick }) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const daysLeft = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (wishlisted) {
        await API.delete('/wishlist/' + internship._id);
        toast.success('Removed from wishlist');
      } else {
        await API.post('/wishlist/' + internship._id);
        toast.success('Added to wishlist');
      }
      setWishlisted(!wishlisted);
      if (onWishlistToggle) onWishlistToggle(internship._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white', border: '1px solid #e8e4d9',
        borderRadius: '12px', padding: '20px', cursor: 'pointer',
        transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#c9a84c';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e8e4d9';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#c9a84c', opacity: 0.6 }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a2744', marginBottom: '4px', fontFamily: 'Playfair Display, serif' }}>
            {internship.title}
          </h3>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            {internship.professorId?.name || internship.professor} · {internship.iitName || internship.iit}
          </p>
        </div>
        {internship._id && (
          <button onClick={handleWishlist} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: wishlisted ? '#ef4444' : '#d1d5db', marginLeft: '8px', transition: 'color 0.2s' }}>♥</button>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', backgroundColor: '#f0ebe0', color: '#8a6c2a', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{internship.domain}</span>
        <span style={{ fontSize: '11px', backgroundColor: internship.mode === 'Online' ? '#e8f5ee' : '#fff3e0', color: internship.mode === 'Online' ? '#2d7a4f' : '#e65100', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{internship.mode}</span>
        {internship.duration && <span style={{ fontSize: '11px', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: '20px' }}>{internship.duration}</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a2744' }}>
          {(internship.stipend || 0) > 0 ? '₹' + (internship.stipend).toLocaleString() + '/mo' : 'Unpaid'}
        </span>
        <span style={{ fontSize: '11px', fontWeight: '600', color: daysLeft <= 3 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#9ca3af' }}>
          {daysLeft <= 0 ? 'Expired' : daysLeft + 'd left'}
        </span>
      </div>
    </div>
  );
};

const FeaturedCard = ({ item }) => (
  <div style={{ backgroundColor: '#1a2744', borderRadius: '12px', padding: '20px', border: '1px solid rgba(201,168,76,0.2)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#c9a84c' }}></div>
    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px', fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>{item.professor} · {item.iit}</p>
    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '11px', backgroundColor: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{item.domain}</span>
      <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '3px 10px', borderRadius: '20px' }}>{item.mode}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a84c' }}>₹{item.stipend.toLocaleString()}/mo</span>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{Math.ceil((new Date(item.deadline) - new Date()) / (1000 * 60 * 60 * 24))}d left</span>
    </div>
  </div>
);

const inputStyle = {
  width: '100%', border: '1px solid #e8e4d9', borderRadius: '8px',
  padding: '9px 12px', fontSize: '13px', color: '#1a2744',
  outline: 'none', backgroundColor: 'white'
};

const labelStyle = {
  display: 'block', fontSize: '10px', fontWeight: '700',
  letterSpacing: '1.5px', textTransform: 'uppercase',
  color: '#9ca3af', marginBottom: '6px'
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [closingSoon, setClosingSoon] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ iitName: '', domain: '', mode: '', minStipend: '', skills: '' });
  const [stats, setStats] = useState({ applied: 0, inReview: 0, accepted: 0 });
  const tagline = taglines[new Date().getDay() % taglines.length];

  const fetchData = useCallback(async (searchVal, filterVals) => {
    try {
      setLoading(true);
      const params = {};
      if (searchVal) params.search = searchVal;
      if (filterVals?.iitName) params.iitName = filterVals.iitName;
      if (filterVals?.domain) params.domain = filterVals.domain;
      if (filterVals?.mode) params.mode = filterVals.mode;
      if (filterVals?.minStipend) params.minStipend = filterVals.minStipend;
      if (filterVals?.skills) params.skills = filterVals.skills;

      const [internRes, wishRes, appRes] = await Promise.all([
        API.get('/internships', { params }),
        API.get('/wishlist'),
        API.get('/applications/my')
      ]);

      setInternships(internRes.data);
      setWishlistIds(wishRes.data.map(w => w.internshipId?._id));

      // Closing soon — from real data, within 3 days
      const urgent = internRes.data.filter(i => {
        const days = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 3 && days > 0;
      });
      setClosingSoon(urgent);

      const apps = appRes.data;
      setStats({
        applied: apps.length,
        inReview: apps.filter(a => a.status === 'In Review').length,
        accepted: apps.filter(a => a.status === 'Accepted').length,
      });
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData('', {}); }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchData(search, filters); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => fetchData(search, filters);

  const clearFilters = () => {
    setSearch('');
    setFilters({ iitName: '', domain: '', mode: '', minStipend: '', skills: '' });
    fetchData('', {});
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Personalisation banner */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '24px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              Hello, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>{tagline}</p>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { label: 'Applied', value: stats.applied, color: '#c9a84c' },
              { label: 'In Review', value: stats.inReview, color: '#60a5fa' },
              { label: 'Accepted', value: stats.accepted, color: '#34d399' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }}>

        {/* Search + Filter Box */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 16px rgba(26,39,68,0.06)' }}>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f5f3ee', border: '1px solid #e8e4d9', borderRadius: '10px', padding: '0 16px', marginBottom: '20px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') fetchData(search, filters); }}
              placeholder="Search by title, domain, skill, professor, IIT..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1a2744', padding: '14px 0', backgroundColor: 'transparent' }}
            />
            {search && (
              <button onClick={() => { setSearch(''); fetchData('', filters); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '20px' }}>×</button>
            )}
            <button onClick={() => fetchData(search, filters)}
              style={{ backgroundColor: '#1a2744', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', cursor: 'pointer' }}>
              Search
            </button>
          </div>

          {/* Filter grid */}
          <div style={{ borderTop: '1px solid #f0ede6', paddingTop: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px' }}>
              Advanced Filters
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>IIT Name</label>
                <input type="text" name="iitName" value={filters.iitName} onChange={handleFilterChange}
                  placeholder="e.g. IIT Bombay" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Domain</label>
                <input type="text" name="domain" value={filters.domain} onChange={handleFilterChange}
                  placeholder="e.g. Machine Learning" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mode</label>
                <select name="mode" value={filters.mode} onChange={handleFilterChange} style={inputStyle}>
                  <option value="">All modes</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Min Stipend (₹)</label>
                <input type="number" name="minStipend" value={filters.minStipend} onChange={handleFilterChange}
                  placeholder="e.g. 10000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Skills</label>
                <input type="text" name="skills" value={filters.skills} onChange={handleFilterChange}
                  placeholder="e.g. Python, ML" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={applyFilters}
                style={{ backgroundColor: '#1a2744', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer' }}>
                Apply Filters
              </button>
              <button onClick={clearFilters}
                style={{ backgroundColor: 'white', color: '#9ca3af', border: '1px solid #e8e4d9', borderRadius: '8px', padding: '10px 20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div style={{ marginBottom: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', color: '#1a2744' }}>
              {loading ? 'Searching...' : internships.length + ' Internships Found'}
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e8e4d9' }}>
                  <div style={{ backgroundColor: '#f3f4f6', height: '16px', borderRadius: '4px', marginBottom: '8px', width: '75%' }}></div>
                  <div style={{ backgroundColor: '#f3f4f6', height: '12px', borderRadius: '4px', width: '50%' }}></div>
                </div>
              ))}
            </div>
          ) : internships.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e8e4d9' }}>
              <p style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a2744', marginBottom: '8px' }}>No internships found</p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Try different keywords or clear your filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {internships.map(i => (
                <Card key={i._id} internship={i}
                  isWishlisted={wishlistIds.includes(i._id)}
                  onWishlistToggle={id => setWishlistIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])}
                  onClick={() => navigate('/student/internship/' + i._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Featured Internships */}
        <div style={{ marginBottom: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#c9a84c', borderRadius: '2px' }}></div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', color: '#1a2744' }}>Featured Internships</h2>
            <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '4px' }}>Handpicked for you</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {FEATURED.map((item, i) => <FeaturedCard key={i} item={item} />)}
          </div>
        </div>

        {/* Closing Soon - LIVE from backend */}
        {closingSoon.length > 0 && (
          <div style={{ marginBottom: '52px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#dc2626', borderRadius: '2px' }}></div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', color: '#1a2744' }}>Closing Soon</h2>
              
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {closingSoon.map(i => (
                <Card key={i._id} internship={i}
                  isWishlisted={wishlistIds.includes(i._id)}
                  onWishlistToggle={id => setWishlistIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])}
                  onClick={() => navigate('/student/internship/' + i._id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #e8e4d9', marginTop: '24px' }}>
          <div style={{ backgroundColor: '#1a2744', borderRadius: '16px', padding: '48px', marginTop: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>

              {/* Brand */}
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Interna</h3>
                <p style={{ fontSize: '11px', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Research Internship Portal</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', maxWidth: '260px' }}>
                  Connecting students with IIT professors for transformative research experiences across India's premier institutions.
                </p>
              </div>

              {/* Students */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>Students</p>
                {['Browse Internships', 'My Applications', 'Wishlist', 'Profile'].map(l => (
                  <p key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#c9a84c'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >{l}</p>
                ))}
              </div>

              {/* Professors */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>Professors</p>
                {['Post Internship', 'View Applicants', 'Manage Listings', 'Dashboard'].map(l => (
                  <p key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#c9a84c'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >{l}</p>
                ))}
              </div>

              {/* IITs */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>IIT Network</p>
                {['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur', '+ 18 more'].map(l => (
                  <p key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>{l}</p>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>© 2026 Interna. All rights reserved.</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Indian Institutes of Technology · Research Portal</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default StudentDashboard;