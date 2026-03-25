import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/wishlist');
        setWishlist(data);
      } catch (err) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const removeFromWishlist = async (internshipId) => {
    try {
      await API.delete('/wishlist/' + internshipId);
      setWishlist(wishlist.filter(w => w.internshipId?._id !== internshipId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f3ee' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e8e4d9', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3ee' }}>

      {/* Header banner */}
      <div style={{ backgroundColor: '#1a2744', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '28px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            My Wishlist
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {wishlist.length} saved internship{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4d9' }}>
            <p style={{ fontSize: '48px', marginBottom: '20px' }}>♡</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
              Your wishlist is empty
            </p>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
              Browse internships and click the heart to save them here
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
            {wishlist.map(item => {
              const i = item.internshipId;
              if (!i) return null;
              const daysLeft = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e8e4d9',
                    borderRadius: '14px',
                    padding: '28px 32px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#c9a84c';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e8e4d9';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Gold left accent */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#c9a84c', borderRadius: '14px 0 0 14px' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                    {/* Left content */}
                    <div style={{ flex: 1 }} onClick={() => navigate('/student/internship/' + i._id)}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '700', color: '#1a2744', marginBottom: '6px' }}>
                        {i.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
                        {i.professorId?.name} · {i.iitName}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#f0ebe0', color: '#8a6c2a', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                          {i.domain}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          backgroundColor: i.mode === 'Online' ? '#e8f5ee' : '#fff3e0',
                          color: i.mode === 'Online' ? '#2d7a4f' : '#e65100',
                          padding: '4px 12px', borderRadius: '20px', fontWeight: '600'
                        }}>
                          {i.mode}
                        </span>
                        {i.duration && (
                          <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '4px 12px', borderRadius: '20px' }}>
                            {i.duration}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a2744' }}>
                          {i.stipend > 0 ? '₹' + i.stipend.toLocaleString() + '/mo' : 'Unpaid'}
                        </span>
                        <span style={{
                          fontSize: '12px', fontWeight: '600',
                          color: daysLeft <= 3 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#9ca3af'
                        }}>
                          {daysLeft <= 0 ? 'Deadline passed' : daysLeft + ' days left'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#d1d5db' }}>
                          Deadline: {new Date(i.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '24px', alignItems: 'flex-end' }}>
                      <button
                        onClick={() => removeFromWishlist(i._id)}
                        style={{
                          background: 'none', border: '1px solid #fecaca',
                          borderRadius: '8px', padding: '8px 14px',
                          fontSize: '12px', fontWeight: '600',
                          color: '#ef4444', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        ♥ Remove
                      </button>
                      <button
                        onClick={() => navigate('/student/internship/' + i._id)}
                        style={{
                          backgroundColor: '#1a2744', border: 'none',
                          borderRadius: '8px', padding: '8px 14px',
                          fontSize: '12px', fontWeight: '600',
                          color: 'white', cursor: 'pointer'
                        }}
                      >
                        View & Apply →
                      </button>
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

export default Wishlist;