import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Landing() {
  const navigate = useNavigate()

  // ── Dark mode ──
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => { if (!localStorage.getItem('theme')) setDark(e.matches) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resetToSystem = () => {
    localStorage.removeItem('theme')
    setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  // ── Active nav section on scroll ──
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sections = ['features', 'pricing', 'contact']
    const observers = sections.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  // ── Scroll to top ──
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="page-wrap">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-logo">Karjee's <span>Travels</span></div>
        <div className="nav-links">
          {[
            { id: 'features', label: 'Services'  },
            { id: 'pricing',  label: 'Pricing'   },
            { id: 'contact',  label: 'Contact'   },
          ].map(({ id, label }) => (
            <a key={id} onClick={() => scrollTo(id)} style={{
              cursor: 'pointer',
              color: activeSection === id ? 'var(--accent)' : 'var(--muted)',
              fontWeight: activeSection === id ? 700 : 400,
              borderBottom: activeSection === id ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: 2,
              transition: 'all 0.2s'
            }}>{label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn btn-outline theme-btn"
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to light' : 'Switch to dark'}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-outline theme-btn"
            onClick={resetToSystem}
            title="Use system default">Auto</button>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-dark"    onClick={() => navigate('/login')}>Book Now</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-text">
          <div className="hero-badge">🚗 Premium Car Rentals · Bangalore</div>
          <h1>Drive Your <span>Journey</span>,<br />Your Way.</h1>
          <p>Karjee's Travels offers comfortable, reliable car rentals for city
            commutes and long road trips. Transparent pricing, no hidden fees.</p>
          <div className="hero-btns">
            <button className="btn btn-dark" onClick={() => navigate('/login')}>Book a Ride</button>
            <button className="btn btn-outline" onClick={() => scrollTo('features')}>Learn More</button>
          </div>
          <div className="hero-stats">
            {[['500+', 'Happy Customers'], ['2', 'Premium Cars'], ['24/7', 'Support']].map(([v, l]) => (
              <div key={l} className="stat-item">
                <div className="stat-val">{v}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="car-grid">
          {[
            { emoji: '🚐', name: 'Ertiga',        desc: '7-seater · AC · Family',  price: '₹1,799/day', active: true  },
            { emoji: '🚗', name: 'Swift Dzire',   desc: '5-seater · AC · City',    price: '₹999/day',   active: true  },
            { emoji: '➕', name: 'More Coming',   desc: 'New cars added by admin', price: 'Stay tuned', active: false },
            { emoji: '🌟', name: 'Premium Fleet', desc: 'Luxury options soon',     price: 'Coming soon',active: false },
          ].map(car => (
            <div key={car.name}
              className={`car-card${car.active ? '' : ' car-inactive'}`}
              onClick={() => { if (car.active) navigate('/login') }}>
              <div className="car-emoji">{car.emoji}</div>
              <div className="car-name">{car.name}</div>
              <div className="car-desc">{car.desc}</div>
              <div className="car-price">{car.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="features-section">
        <div className="sec-label">Why Karjee's</div>
        <h2 className="sec-title">Everything for the Road</h2>
        <p className="sec-sub">Reliable, affordable, and always on time.</p>
        <div className="feat-grid">
          {[
            { icon: '📱', title: 'Easy Booking',      desc: 'Book in minutes with OTP login — no paperwork needed.' },
            { icon: '🛡️', title: 'Fully Insured',     desc: 'All vehicles are insured and regularly serviced.' },
            { icon: '🚗', title: 'Pro Drivers',        desc: 'Verified, experienced drivers on every booking.' },
            { icon: '📍', title: 'Doorstep Delivery', desc: 'Car delivered to your home, office, or airport.' },
            { icon: '💳', title: 'Flexible Payments', desc: 'UPI, cards, or cash. Zero hidden charges.' },
            { icon: '🕐', title: '24/7 Support',       desc: 'Our team is available round the clock for you.' },
          ].map(f => (
            <div key={f.title} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="pricing-section">
        <div className="sec-label">Pricing</div>
        <h2 className="sec-title">Simple, Transparent Pricing</h2>
        <p className="sec-sub">No surprises, no hidden fees.</p>
        <div className="pricing-grid">
          {[
            { name: 'Economy',    car: 'Swift Dzire', price: '₹999',   popular: false,
              features: ['5-seater sedan', '200 km included', 'Basic insurance', 'Email support'] },
            { name: 'Comfort',    car: 'Ertiga',      price: '₹1,799', popular: true,
              features: ['7-seater SUV', '400 km included', 'Full insurance', '24/7 phone support', 'Doorstep delivery'] },
            { name: 'Outstation', car: 'Any car',     price: '₹2,499', popular: false,
              features: ['Choice of car', 'Unlimited km', 'Full insurance', 'Dedicated driver', 'Airport pickup'] },
          ].map(p => (
            <div key={p.name} className={`price-card${p.popular ? ' price-popular' : ''}`}>
              {p.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{p.name}</h3>
              <p className="price-car">{p.car}</p>
              <div className="price-amount">{p.price}<span>/day</span></div>
              <ul className="price-features">
                {p.features.map(f => <li key={f}><span>✓</span>{f}</li>)}
              </ul>
              <button
                className={`btn w-full${p.popular ? ' btn-accent' : ' btn-dark'}`}
                style={{ justifyContent: 'center', padding: 12 }}
                onClick={() => navigate('/login')}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testi-section">
        <div className="sec-label" style={{ color: 'var(--accent)' }}>Testimonials</div>
        <h2 className="sec-title">What Our Customers Say</h2>
        <div className="testi-grid">
          {[
            { name: 'Rahul Mehta',  city: 'Bangalore', text: 'Booked an SUV for a weekend trip to Coorg. Smooth process, clean car, super responsive team!' },
            { name: 'Priya Sharma', city: 'Mysore',    text: 'Made our family vacation so easy. Car delivered to our doorstep and picked up after. Hassle-free!' },
            { name: 'Arun Nair',    city: 'Chennai',   text: 'Best car rental in Bangalore. Transparent pricing and 24/7 support that actually picks up!' },
          ].map(t => (
            <div key={t.name} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p>"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.name[0]}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-city">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section">
        <div className="contact-grid">
          <div>
            <div className="sec-label">Get In Touch</div>
            <h2 className="sec-title">Ready to Hit the Road?</h2>
            <p className="sec-sub">Fill in the form and our team will get back to you within 2 hours.</p>
            {[['📞', '+91 98765 43210'], ['📧', 'hello@karjeestravel.in'], ['📍', 'Bangalore, Karnataka']].map(([icon, val]) => (
              <div key={val} className="contact-detail"><span>{icon}</span><span>{val}</span></div>
            ))}
          </div>
          <div className="contact-form">
            <div className="form-group"><input type="text"  placeholder="Your Name" /></div>
            <div className="form-group"><input type="email" placeholder="Email Address" /></div>
            <div className="form-group"><input type="tel"   placeholder="Phone Number" /></div>
            <div className="form-group">
              <textarea rows={4} placeholder="Tell us about your trip..." />
            </div>
            <button className="btn btn-dark w-full"
              style={{ justifyContent: 'center', padding: 13 }}
              onClick={() => navigate('/login')}>
              Send Booking Request 🚗
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        © {new Date().getFullYear()} <span>Karjee's Travels</span>. All rights reserved. Made with ❤️ in Bangalore.
      </footer>

      {/* ── SCROLL TO TOP ── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Scroll to top"
          style={{
            position: 'fixed', bottom: 32, right: 32, zIndex: 999,
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--accent)', color: '#fff', border: 'none',
            fontSize: '1.2rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            cursor: 'pointer', transition: 'opacity 0.2s'
          }}>↑</button>
      )}

    </div>
  )
}