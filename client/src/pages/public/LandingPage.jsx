import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Send,
  Activity,
  CheckCircle2,
  Lock,
  MessageSquare,
  BarChart2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Building,
  Home,
  Wifi,
  FlaskConical,
  Utensils,
  Bus,
  Zap,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'staff') return '/staff/dashboard';
    return '/student/dashboard';
  };

  const categories = [
    { name: 'Academic & Curriculum', icon: <BookOpen size={22} color="#818cf8" />, desc: 'Lectures, schedules, grading' },
    { name: 'Hostel Facilities', icon: <Home size={22} color="#34d399" />, desc: 'Rooms, wardens, amenities' },
    { name: 'Campus Wi-Fi & Internet', icon: <Wifi size={22} color="#38bdf8" />, desc: 'Hotspots, login portals, bandwidth' },
    { name: 'Infrastructure & Power', icon: <Building size={22} color="#fb923c" />, desc: 'Classrooms, ACs, power backup' },
    { name: 'Laboratories & Systems', icon: <FlaskConical size={22} color="#f472b6" />, desc: 'Workstations, software, equipment' },
    { name: 'Canteen & Dining', icon: <Utensils size={22} color="#facc15" />, desc: 'Food hygiene, pricing, services' },
    { name: 'Transportation & Transit', icon: <Bus size={22} color="#c084fc" />, desc: 'College buses, routes, timings' },
    { name: 'Electrical & Water Supply', icon: <Zap size={22} color="#2dd4bf" />, desc: 'Water coolers, lighting, repairs' },
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 4rem 0',
          background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.18) 0%, rgba(10, 14, 26, 0) 70%)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--primary-400)',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={15} />
            <span>Digital Grievance Redressal Portal</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              color: '#ffffff',
            }}
          >
            College Complaint <br />
            <span
              style={{
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Management System
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              marginBottom: '2.5rem',
              lineHeight: '1.6',
            }}
          >
            "Your voice matters. Report, track and resolve college issues efficiently."
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn btn-primary btn-lg">
                <span>Go to My Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  <span>Sign In to Portal</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  <span>Register as Student</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Highlights / Metric Stats Banner */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-400)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transparent Tracking</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#34d399' }}>
                &lt; 48 Hrs
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Resolution Time</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fb923c' }}>
                15+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Campus Issue Categories</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#38bdf8' }}>
                4.8 / 5
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Student Satisfaction Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Simple 3-step transparent redressal workflow for students and campus authorities
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="glass-card glass-card-hover" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(79, 70, 229, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Send size={24} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>1. Submit Grievance</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Register your complaint with title, department category, location, priority, and optional photos or PDF evidence.
              </p>
            </div>

            <div className="glass-card glass-card-hover" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Activity size={24} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>2. Live Assignment & Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Administrators assign tickets to specialized faculty or maintenance staff. Follow stage-by-stage live updates on an interactive visual timeline.
              </p>
            </div>

            <div className="glass-card glass-card-hover" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <CheckCircle2 size={24} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>3. Resolution & Rating</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Staff verify and fix the issue. Students receive instant notification and can provide a 1–5 star rating and feedback on the resolution quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint Categories Grid */}
      <section style={{ padding: '3rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Campus Complaint Categories</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Comprehensive coverage of all academic and campus infrastructure divisions
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="glass-card glass-card-hover"
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
              >
                <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {cat.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key System Features */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Why Use This System?</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Built specifically for modern educational institutions and university standards
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Lock size={20} color="var(--primary-400)" />
                <h4 style={{ fontSize: '1.1rem' }}>Anonymous Reporting</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.885rem', lineHeight: '1.5' }}>
                Students can report sensitive issues anonymously while preserving tracking capability without identity disclosure.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <BarChart2 size={20} color="#34d399" />
                <h4 style={{ fontSize: '1.1rem' }}>Real-time Analytics</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.885rem', lineHeight: '1.5' }}>
                Interactive Recharts visualizations enable college administrators to identify recurring bottlenecks and measure staff SLA.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <MessageSquare size={20} color="#fb923c" />
                <h4 style={{ fontSize: '1.1rem' }}>Live Response Thread</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.885rem', lineHeight: '1.5' }}>
                Official two-way communication channel between student and assigned faculty in-charge on every ticket.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
