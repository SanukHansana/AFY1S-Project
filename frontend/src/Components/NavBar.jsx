// frontend/src/Components/NavBar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Find Talent', to: '/skills' },
    { label: 'Find Work', to: '/jobs' },
    { label: 'Courses', to: '/courses' },
    { label: 'About', to: '/about' },
  ]

  const isActive = (to) => location.pathname === to

  const [isLoggedIn, setIsLoggedIn] = useState(false);

      useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsLoggedIn(false);

  navigate("/");
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.35s ease;
          padding: 0;
        }
        .sc-nav.transparent { background: transparent; border-bottom: none; box-shadow: none; }
        .sc-nav.scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(180,100,220,0.12);
          box-shadow: 0 4px 24px rgba(120,40,160,0.08);
        }
        .sc-nav-inner {
          max-width: 1240px; margin: 0 auto;
          padding: 0 28px;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* Logo */
        .sc-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .sc-logo-img { height: 48px; width: auto; object-fit: contain; }
        .sc-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .sc-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          background: linear-gradient(135deg, #6b21a8, #c026d3, #f43f5e);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          letter-spacing: 0.04em;
        }
        .sc-logo-tagline { font-size: 10px; font-weight: 500; color: #9d74c4; letter-spacing: 0.08em; text-transform: uppercase; }

        /* Nav links */
        .sc-links { display: flex; align-items: center; gap: 4px; }
        .sc-link {
          padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 500;
          color: #4b5563; text-decoration: none; transition: all 0.2s ease;
          position: relative;
        }
        .sc-link:hover { color: #7e22ce; background: rgba(124,58,237,0.07); }
        .sc-link.active {
          color: #7e22ce; font-weight: 600;
          background: rgba(124,58,237,0.08);
        }
        .sc-link.active::after {
          content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 20px; height: 2px; border-radius: 99px;
          background: linear-gradient(90deg, #7c3aed, #ec4899);
        }

        /* Buttons */
        .sc-nav-actions { display: flex; align-items: center; gap: 10px; }
        .sc-btn-ghost {
          padding: 9px 20px; border-radius: 12px; font-size: 14px; font-weight: 600;
          color: #6b21a8; background: transparent;
          border: 1.5px solid rgba(107,33,168,0.25);
          cursor: pointer; font-family: inherit; text-decoration: none;
          transition: all 0.2s ease; display: inline-flex; align-items: center;
        }
        .sc-btn-ghost:hover { background: rgba(107,33,168,0.06); border-color: #7e22ce; }
        .sc-btn-primary {
          padding: 9px 22px; border-radius: 12px; font-size: 14px; font-weight: 700;
          color: white; border: none; cursor: pointer; font-family: inherit;
          background: linear-gradient(135deg, #7c3aed, #c026d3, #f43f5e);
          background-size: 200% 200%;
          transition: all 0.3s ease; display: inline-flex; align-items: center;
          box-shadow: 0 4px 15px rgba(124,58,237,0.3);
        }
        .sc-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124,58,237,0.45);
        }

        /* Mobile */
        .sc-hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; padding: 6px; background: none; border: none;
        }
        .sc-hamburger span {
          display: block; width: 22px; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          transition: all 0.3s ease;
        }
        .sc-mobile-menu {
          position: fixed; top: 72px; left: 0; right: 0;
          background: white;
          border-bottom: 1px solid rgba(124,58,237,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          padding: 16px 28px 20px;
          display: flex; flex-direction: column; gap: 4px;
          animation: slideDown 0.25s ease;
          z-index: 999;
        }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        .sc-mobile-link {
          padding: 12px 16px; border-radius: 12px; font-size: 15px; font-weight: 500;
          color: #4b5563; text-decoration: none; transition: all 0.2s;
        }
        .sc-mobile-link:hover { color: #7e22ce; background: rgba(124,58,237,0.06); }
        .sc-mobile-divider { height: 1px; background: #f3f4f6; margin: 8px 0; }
        .sc-mobile-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }

        @media (max-width: 768px) {
          .sc-links, .sc-nav-actions { display: none; }
          .sc-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`sc-nav ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="sc-nav-inner">

          {/* Logo */}
          <Link to="/" className="sc-logo">
            <img src="/navBarBigLogo.png" alt="Skill Connect" className="sc-logo-img" />
            <div className="sc-logo-text">
              {/* <span className="sc-logo-name">SKILL CONNECT</span>
              <span className="sc-logo-tagline">Where Skills Meet Opportunity</span> */}
            </div>
          </Link>

          {/* Desktop links */}
          <div className="sc-links">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`sc-link ${isActive(link.to) ? 'active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="sc-nav-actions">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="sc-btn-ghost">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="sc-btn-ghost">Log In</Link>
                <Link to="/register" className="sc-btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="sc-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span style={mobileOpen ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
            <span style={mobileOpen ? { opacity: 0 } : {}} />
            <span style={mobileOpen ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sc-mobile-menu">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="sc-mobile-link" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="sc-mobile-divider" />
          <div className="sc-mobile-actions">
           {isLoggedIn ? (
  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded-lg"
  >
    Logout
  </button>
) : (
  <Link
    to="/login"
    className="bg-green-500 text-white px-4 py-2 rounded-lg"
  >
    Login
  </Link>
)}
            <Link to="/register" className="sc-btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}

      {/* Spacer so content starts below fixed nav */}
      <div style={{ height: 72 }} />
    </>
  )
}

export default NavBar