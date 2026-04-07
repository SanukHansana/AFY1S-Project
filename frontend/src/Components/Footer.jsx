// frontend/src/Components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'Find Talent', to: '/skills' },
        { label: 'Post a Job', to: '/post-job' },
        { label: 'Browse Courses', to: '/courses' },
        { label: 'Create a Course', to: '/courses/new' },
      ],
    },
    {
      title: 'Freelancers',
      links: [
        { label: 'Find Work', to: '/jobs' },
        { label: 'Build Profile', to: '/profile' },
        { label: 'Learn & Grow', to: '/courses' },
        { label: 'Success Stories', to: '/stories' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Blog', to: '/blog' },
        { label: 'Careers', to: '/careers' },
        { label: 'Contact', to: '/contact' },
      ],
    },
  ]

  const socials = [
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sc-footer {
          font-family: 'DM Sans', sans-serif;
          background: #0f0a1a;
          color: #e9d5ff;
          padding: 72px 28px 0;
        }
        .sc-footer-inner { max-width: 1240px; margin: 0 auto; }

        /* Top band */
        .sc-footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(167,139,250,0.12);
        }

        /* Brand col */
        .sc-footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; text-decoration: none; }
        .sc-footer-logo-img { height: 44px; width: auto; object-fit: contain; }
        .sc-footer-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px;
          background: linear-gradient(135deg, #c084fc, #f43f5e);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          letter-spacing: 0.04em;
        }
        .sc-footer-logo-tag { font-size: 10px; color: #9d74c4; letter-spacing: 0.07em; text-transform: uppercase; font-weight: 500; }
        .sc-footer-desc { color: #9d74c4; font-size: 13.5px; line-height: 1.75; max-width: 280px; margin-bottom: 24px; }

        /* Social icons */
        .sc-socials { display: flex; gap: 10px; }
        .sc-social-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(167,139,250,0.1);
          border: 1px solid rgba(167,139,250,0.15);
          color: #c084fc;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all 0.25s ease;
          cursor: pointer;
        }
        .sc-social-btn:hover {
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          border-color: transparent; color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(124,58,237,0.35);
        }

        /* Link columns */
        .sc-footer-col-title {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
          color: white; letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 18px;
        }
        .sc-footer-link {
          display: block; color: #9d74c4; font-size: 13.5px;
          text-decoration: none; margin-bottom: 11px;
          transition: all 0.2s ease;
        }
        .sc-footer-link:hover { color: #e879f9; transform: translateX(3px); }

        /* Newsletter */
        .sc-newsletter { margin-top: 40px; padding-top: 40px; border-top: 1px solid rgba(167,139,250,0.12); }
        .sc-newsletter-inner { max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
        .sc-newsletter-text h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: white; margin-bottom: 4px; }
        .sc-newsletter-text p { color: #9d74c4; font-size: 13.5px; }
        .sc-newsletter-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .sc-newsletter-input {
          background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2);
          border-radius: 12px; padding: 12px 18px; font-size: 14px;
          color: white; font-family: inherit; width: 260px;
          transition: border-color 0.2s;
          outline: none;
        }
        .sc-newsletter-input::placeholder { color: #6b4f8a; }
        .sc-newsletter-input:focus { border-color: #a855f7; box-shadow: 0 0 0 3px rgba(168,85,247,0.15); }
        .sc-newsletter-btn {
          background: linear-gradient(135deg, #7c3aed, #c026d3, #f43f5e);
          color: white; border: none; border-radius: 12px;
          padding: 12px 24px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit; white-space: nowrap;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(124,58,237,0.3);
        }
        .sc-newsletter-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.45); }

        /* Bottom bar */
        .sc-footer-bottom {
          margin-top: 40px; padding: 20px 0;
          border-top: 1px solid rgba(167,139,250,0.1);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px;
        }
        .sc-footer-copy { color: #6b4f8a; font-size: 13px; }
        .sc-footer-legal { display: flex; gap: 24px; }
        .sc-footer-legal a { color: #6b4f8a; font-size: 13px; text-decoration: none; transition: color 0.2s; }
        .sc-footer-legal a:hover { color: #c084fc; }

        /* Gradient top edge */
        .sc-footer-glow {
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #c026d3, #f43f5e, #c026d3, #7c3aed);
          background-size: 200% 100%;
          animation: shiftGlow 4s linear infinite;
        }
        @keyframes shiftGlow { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }

        @media (max-width: 900px) {
          .sc-footer-top { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 560px) {
          .sc-footer-top { grid-template-columns: 1fr; }
          .sc-newsletter-inner { flex-direction: column; align-items: flex-start; }
          .sc-newsletter-input { width: 100%; }
          .sc-footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      <footer className="sc-footer">
        {/* animated gradient top line */}
        <div className="sc-footer-glow" />

        <div className="sc-footer-inner" style={{ paddingTop: 56 }}>
          <div className="sc-footer-top">
            {/* Brand */}
            <div>
              <Link to="/" className="sc-footer-logo">
                <img src="/tabLogo.png" alt="Skill Connect" className="sc-footer-logo-img" />
                <div>
                  <div className="sc-footer-logo-name">SKILL CONNECT</div>
                  <div className="sc-footer-logo-tag">Where Skills Meet Opportunity</div>
                </div>
              </Link>
              <p className="sc-footer-desc">
                The all-in-one platform where clients post jobs, freelancers grow careers, and everyone learns through world-class courses.
              </p>
              <div className="sc-socials">
                {socials.map(s => (
                  <a key={s.label} href={s.href} className="sc-social-btn" aria-label={s.label}>{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {cols.map(col => (
              <div key={col.title}>
                <div className="sc-footer-col-title">{col.title}</div>
                {col.links.map(link => (
                  <Link key={link.to} to={link.to} className="sc-footer-link">{link.label}</Link>
                ))}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="sc-newsletter">
            <div className="sc-newsletter-inner">
              <div className="sc-newsletter-text">
                <h4>Stay in the loop 📬</h4>
                <p>Get the latest jobs, courses & platform updates delivered to your inbox.</p>
              </div>
              <div className="sc-newsletter-form">
                <input className="sc-newsletter-input" type="email" placeholder="Enter your email" />
                <button className="sc-newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="sc-footer-bottom">
            <span className="sc-footer-copy">© {year} Skill Connect. All rights reserved.</span>
            <div className="sc-footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}