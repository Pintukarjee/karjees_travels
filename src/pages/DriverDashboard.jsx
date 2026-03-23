import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const DUMMY_TRIPS = [
  {
    id: 1, car: 'Ertiga', status: 'CONFIRMED',
    pickup: 'Koramangala, Bangalore', drop: 'Mysore Bus Stand',
    start: '2026-03-25', end: '2026-03-27',
    customer: 'Rahul Mehta', phone: '+91 98765 43210',
    notes: 'Early morning pickup please'
  },
  {
    id: 2, car: 'Swift Dzire', status: 'CONFIRMED',
    pickup: 'Whitefield, Bangalore', drop: 'Hampi',
    start: '2026-04-01', end: '2026-04-03',
    customer: 'Arun Nair', phone: '+91 99887 65432',
    notes: ''
  },
]

const DUMMY_HISTORY = [
  {
    id: 3, car: 'Ertiga', status: 'COMPLETED',
    pickup: 'MG Road, Bangalore', drop: 'Coorg',
    start: '2026-03-10', end: '2026-03-12',
    customer: 'Priya Sharma', phone: '+91 91234 56789',
    notes: ''
  },
]

export default function DriverDashboard() {
  const navigate = useNavigate()
  const phone    = localStorage.getItem('phone') || '99001 12233'
  const [page, setPage]       = useState('trips')
  const [expanded, setExpanded] = useState(null)

  const logout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('phone')
    localStorage.removeItem('token')
    navigate('/')
  }

  const menuItems = [
    { key: 'trips',   icon: '🗺️', label: 'My Trips'     },
    { key: 'history', icon: '📋', label: 'Trip History'  },
    { key: 'profile', icon: '👤', label: 'Profile'       },
  ]

  const TripCard = ({ trip, showComplete }) => {
    const isOpen = expanded === trip.id
    const days   = Math.ceil((new Date(trip.end) - new Date(trip.start)) / (1000 * 60 * 60 * 24))

    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', marginBottom: 14,
        overflow: 'hidden', transition: 'all 0.2s'
      }}>
        {/* Card header */}
        <div style={{
          padding: '18px 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer'
        }} onClick={() => setExpanded(isOpen ? null : trip.id)}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                {trip.pickup}
              </span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>→</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                {trip.drop}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--muted)' }}>
              <span>🚗 {trip.car}</span>
              <span>📅 {trip.start} → {trip.end}</span>
              <span>⏱️ {days} day{days > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span>
            <span style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>{isOpen ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Expanded details */}
        {isOpen && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--bg2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Customer</div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{trip.customer}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Phone</div>
                <a href={`tel:${trip.phone}`} style={{ fontWeight: 600, color: 'var(--accent)' }}>{trip.phone}</a>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Pickup</div>
                <div style={{ color: 'var(--text)' }}>📍 {trip.pickup}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Drop</div>
                <div style={{ color: 'var(--text)' }}>🏁 {trip.drop}</div>
              </div>
            </div>
            {trip.notes ? (
              <div style={{ background: '#FFF3D6', border: '1px solid #ffe082', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.85rem', color: '#7c5a00' }}>
                📝 <strong>Note:</strong> {trip.notes}
              </div>
            ) : null}
            {showComplete && (
              <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(trip.pickup)}`}
                  target="_blank" rel="noreferrer"
                  className="btn btn-outline btn-sm">📍 Open Pickup in Maps</a>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(trip.drop)}`}
                  target="_blank" rel="noreferrer"
                  className="btn btn-outline btn-sm">🏁 Open Drop in Maps</a>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="dash-layout">
      <Sidebar
        menu={menuItems}
        active={page}
        onSelect={setPage}
        onLogout={logout}
        roleColor="#1976d2"
        roleLabel="Driver"
      />

      <div className="dash-main">
        <div className="dash-header">
          <h2>{{ trips: 'My Trips', history: 'Trip History', profile: 'Profile' }[page]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>+91 {phone}</span>
            <span style={{ background: '#E3F2FD', color: '#1565c0', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Driver</span>
            <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="dash-content">

          {/* ── MY TRIPS ── */}
          {page === 'trips' && (
            <div>
              {/* Stats */}
              <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
                <div className="stat-card">
                  <div className="icon">🗺️</div>
                  <div className="val">{DUMMY_TRIPS.length}</div>
                  <div className="lbl">Upcoming Trips</div>
                </div>
                <div className="stat-card">
                  <div className="icon">✅</div>
                  <div className="val">{DUMMY_HISTORY.length}</div>
                  <div className="lbl">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="icon">⭐</div>
                  <div className="val">4.9</div>
                  <div className="lbl">Rating</div>
                </div>
              </div>

              {DUMMY_TRIPS.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚗</div>
                  <p>No trips assigned yet. Check back soon!</p>
                </div>
              ) : (
                DUMMY_TRIPS.map(trip => <TripCard key={trip.id} trip={trip} showComplete={true} />)
              )}
            </div>
          )}

          {/* ── TRIP HISTORY ── */}
          {page === 'history' && (
            <div>
              {DUMMY_HISTORY.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
                  <p>No completed trips yet.</p>
                </div>
              ) : (
                DUMMY_HISTORY.map(trip => <TripCard key={trip.id} trip={trip} showComplete={false} />)
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {page === 'profile' && (
            <div className="card" style={{ maxWidth: 440 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Driver Profile</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'var(--bg2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: '#fff', flexShrink: 0 }}>
                  {phone[0] || 'D'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>+91 {phone}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Verified Driver · ⭐ 4.9</div>
                </div>
              </div>
              <div className="form-group"><label>Full Name</label><input type="text" placeholder="Your full name" /></div>
              <div className="form-group"><label>License Number</label><input type="text" placeholder="KA-01-20XX-XXXXXX" /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={`+91 ${phone}`} disabled style={{ opacity: 0.6 }} /></div>
              <button className="btn btn-dark" style={{ marginTop: 4 }}>Save Changes</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}