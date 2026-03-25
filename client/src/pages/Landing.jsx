import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const serif = { fontFamily: 'Playfair Display, serif' };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1b2a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Texture overlay - dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.08) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }}></div>

      {/* Large decorative circles */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.06)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.08)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.06)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.08)',
        pointerEvents: 'none'
      }}></div>

      {/* Glow effect behind title */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(26,39,68,0.8) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>

        {/* Eyebrow text */}
        <p style={{
          color: '#c9a84c',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '24px',
          opacity: 0.9
        }}>
          IIT Research Internship Portal
        </p>

        {/* Main title */}
        <h1 style={{
          ...serif,
          fontSize: 'clamp(72px, 12vw, 140px)',
          fontWeight: '700',
          color: '#ffffff',
          lineHeight: '1',
          marginBottom: '8px',
          letterSpacing: '-2px',
          textShadow: '0 0 80px rgba(201,168,76,0.15)'
        }}>
          Interna
        </h1>

        {/* Gold underline */}
        <div style={{
          width: '80px', height: '3px',
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          margin: '0 auto 32px'
        }}></div>

        {/* Tagline */}
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '16px',
          letterSpacing: '1px',
          marginBottom: '56px',
          maxWidth: '400px',
          lineHeight: '1.8'
        }}>
          Where research meets opportunity.<br />
          Connecting students with IIT professors.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #c9a84c',
            color: '#c9a84c',
            padding: '16px 48px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = '#c9a84c';
            e.target.style.color = '#0d1b2a';
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#c9a84c';
          }}
        >
          Get Started →
        </button>

        {/* Bottom links */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '1px' }}
          >
            Sign In
          </button>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
          <button
            onClick={() => navigate('/signup')}
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '1px' }}
          >
            Create Account
          </button>
        </div>

      </div>

      {/* Bottom text */}
      <div style={{
        position: 'absolute', bottom: '32px',
        color: 'rgba(255,255,255,0.15)',
        fontSize: '11px', letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        Indian Institutes of Technology
      </div>

    </div>
  );
};

export default Landing;