import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const CARS = [
  { id: 1, emoji: '🚐', name: 'Ertiga',      desc: '7-seater · AC · Family', price: 1799 },
  { id: 2, emoji: '🚗', name: 'Swift Dzire', desc: '5-seater · AC · City',   price: 999  },
]

const DUMMY_BOOKINGS = [
  { id: 1, car: 'Ertiga',      pickup: 'Koramangala, Bangalore', drop: 'Mysore Bus Stand', start: '2026-03-25', end: '2026-03-27', status: 'CONFIRMED', driver: 'Vikram Das' },
  { id: 2, car: 'Swift Dzire', pickup: 'Indiranagar, Bangalore', drop: 'Coorg',             start: '2026-03-28', end: '2026-03-30', status: 'PENDING',   driver: null },
]

export default function UserDashboard() {
  const navigate  = useNavigate()
  const phone     = localStorage.getItem('phone') || '98765 43210'
  const [page, setPage]         = useState('book')
  const [selectedCar, setSelectedCar] = useState(CARS[0])
  const [form, setForm]         = useState({ pickup: '', drop: '', start: '', end: '', notes: '' })
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]       = useState('')

  // Profile state
  const [profile, setProfile] = useState({
    name: '', email: '', emergencyName: '', emergencyPhone: '', photo: null
  })
  const [profileSaved, setProfileSaved] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editProfile, setEditProfile] = useState({ ...profile })

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfile(p => ({ ...p, photo: reader.result }))
      setEditProfile(p => ({ ...p, photo: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const startEdit = () => {
    setEditProfile({ ...profile })
    setEditMode(true)
  }

  const cancelEdit = () => {
    setEditProfile({ ...profile })
    setEditMode(false)
  }

  const saveProfile = () => {
    setProfile({ ...editProfile })
    setEditMode(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const logout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('phone')
    localStorage.removeItem('token')
    navigate('/')
  }

  const days = () => {
    if (!form.start || !form.end) return 0
    const d = (new Date(form.end) - new Date(form.start)) / (1000 * 60 * 60 * 24)
    return d > 0 ? d : 0
  }

  const handleBook = () => {
    setError('')
    if (!form.pickup || !form.drop || !form.start || !form.end) {
      setError('Please fill in all required fields.')
      return
    }
    if (days() === 0) {
      setError('End date must be after start date.')
      return
    }
    const newBooking = {
      id: bookings.length + 1,
      car: selectedCar.name,
      pickup: form.pickup, drop: form.drop,
      start: form.start,   end: form.end,
      status: 'PENDING', driver: null
    }
    setBookings(prev => [newBooking, ...prev])
    setForm({ pickup: '', drop: '', start: '', end: '', notes: '' })
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setPage('bookings') }, 1800)
  }

  const today = new Date().toISOString().split('T')[0]

  const menuItems = [
    { key: 'book',     icon: '🗓️', label: 'Book a Ride'  },
    { key: 'bookings', icon: '📋', label: 'My Bookings'  },
    { key: 'profile',  icon: '👤', label: 'Profile'      },
  ]

  return (
    <div className="dash-layout">
      <Sidebar
        logo="Karjee's Travels"
        menu={menuItems}
        active={page}
        onSelect={setPage}
        onLogout={logout}
        roleColor="#E8A020"
        roleLabel="User"
      />

      <div className="dash-main">
        <div className="dash-header">
          <h2>{{ book: 'Book a Ride', bookings: 'My Bookings', profile: 'Profile' }[page]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>+91 {phone}</span>
            <span style={{ background: '#FFF3D6', color: '#b57d10', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>User</span>
            <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="dash-content">

          {/* ── BOOK A RIDE ── */}
          {page === 'book' && (
            <div>
              {submitted && (
                <div style={{ background: '#E8F5E9', color: '#2e7d32', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 20, fontWeight: 600, border: '1px solid #c8e6c9' }}>
                  ✅ Booking submitted! Redirecting to your bookings...
                </div>
              )}

              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Select Your Car</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {CARS.map(car => (
                    <div key={car.id} onClick={() => setSelectedCar(car)} style={{
                      border: selectedCar.id === car.id ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                      background: selectedCar.id === car.id ? 'var(--bg2)' : 'var(--surface)',
                      borderRadius: 'var(--radius-lg)', padding: 20,
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.18s'
                    }}>
                      <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{car.emoji}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{car.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '4px 0 8px' }}>{car.desc}</div>
                      <div style={{ fontWeight: 800, color: 'var(--accent)' }}>₹{car.price.toLocaleString('en-IN')}/day</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Trip Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Pickup Location *</label>
                    <input type="text" placeholder="e.g. Koramangala, Bangalore"
                      value={form.pickup} onChange={e => setForm(p => ({ ...p, pickup: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Drop Location *</label>
                    <input type="text" placeholder="e.g. Mysore Bus Stand"
                      value={form.drop} onChange={e => setForm(p => ({ ...p, drop: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Start Date *</label>
                    <input type="date" min={today}
                      value={form.start} onChange={e => setForm(p => ({ ...p, start: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>End Date *</label>
                    <input type="date" min={form.start || today}
                      value={form.end} onChange={e => setForm(p => ({ ...p, end: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                    <label>Special Instructions (optional)</label>
                    <input type="text" placeholder="e.g. Early morning pickup, need child seat..."
                      value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                </div>

                {/* Price estimate */}
                {days() > 0 && (
                  <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                      {selectedCar.name} × {days()} day{days() > 1 ? 's' : ''}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' }}>
                      ₹{(selectedCar.price * days()).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {error && (
                  <div style={{ background: '#FFEBEE', color: '#c62828', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginTop: 16, fontSize: '0.85rem', border: '1px solid #ffcdd2' }}>
                    {error}
                  </div>
                )}

                <button className="btn btn-accent w-full"
                  style={{ justifyContent: 'center', padding: 13, marginTop: 20 }}
                  onClick={handleBook}>
                  Confirm Booking →
                </button>
              </div>
            </div>
          )}

          {/* ── MY BOOKINGS ── */}
          {page === 'bookings' && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>My Bookings ({bookings.length})</h3>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚗</div>
                  <p>No bookings yet.</p>
                  <button className="btn btn-dark" style={{ marginTop: 16 }} onClick={() => setPage('book')}>Book Your First Ride</button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Car</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Dates</th>
                        <th>Driver</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text)' }}>{b.car}</td>
                          <td style={{ color: 'var(--text)' }}>{b.pickup}</td>
                          <td style={{ color: 'var(--text)' }}>{b.drop}</td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{b.start} → {b.end}</td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{b.driver || <span style={{ color: 'var(--muted)' }}>Not assigned</span>}</td>
                          <td>
                            <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {page === 'profile' && (
            <div style={{ maxWidth: 520 }}>

              {profileSaved && (
                <div style={{ background: '#E8F5E9', color: '#2e7d32', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontWeight: 600, border: '1px solid #c8e6c9' }}>
                  ✅ Profile saved successfully!
                </div>
              )}

              {/* Photo + name card */}
              <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: '50%',
                    background: profile.photo ? 'transparent' : 'var(--accent)',
                    border: '3px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', fontSize: '2rem', color: '#fff', fontWeight: 800
                  }}>
                    {profile.photo
                      ? <img src={profile.photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (profile.name?.[0]?.toUpperCase() || '👤')
                    }
                  </div>
                  {editMode && (
                    <>
                      <label htmlFor="photo-upload" style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--accent)', border: '2px solid var(--bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '0.75rem'
                      }}>📷</label>
                      <input id="photo-upload" type="file" accept="image/*"
                        style={{ display: 'none' }} onChange={handlePhotoUpload} />
                    </>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                    {profile.name || 'No name set'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 10 }}>
                    +91 {phone} · Verified ✅
                  </div>
                  {!editMode && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-dark btn-sm" onClick={startEdit}>✏️ Edit Profile</button>
                      {profile.photo && (
                        <button className="btn btn-outline btn-sm" onClick={() => {
                          setProfile(p => ({ ...p, photo: null }))
                          setEditProfile(p => ({ ...p, photo: null }))
                        }}>🗑️ Remove Photo</button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* View mode */}
              {!editMode && (
                <div className="card" style={{ marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Profile Details</h3>
                  {[
                    ['👤 Full Name',         profile.name          || '—'],
                    ['📧 Email',              profile.email         || '—'],
                    ['📞 Phone',              `+91 ${phone}`              ],
                    ['🆘 Emergency Contact', profile.emergencyName  || '—'],
                    ['🆘 Emergency Phone',   profile.emergencyPhone || '—'],
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '10px 0', borderBottom: '1px solid var(--border)',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</span>
                    </div>
                  ))}
                  <button className="btn btn-dark btn-sm" style={{ marginTop: 16 }} onClick={startEdit}>
                    ✏️ Edit Profile
                  </button>
                </div>
              )}

              {/* Edit mode */}
              {editMode && (
                <>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Personal Info</h3>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="e.g. Rahul Mehta"
                        value={editProfile.name}
                        onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="you@email.com"
                        value={editProfile.email}
                        onChange={e => setEditProfile(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Phone (verified)</label>
                      <input type="tel" value={`+91 ${phone}`} disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                  </div>

                  <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>Emergency Contact</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16 }}>
                      We'll notify this person in case of an emergency during your trip.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>Contact Name</label>
                        <input type="text" placeholder="e.g. Priya Mehta"
                          value={editProfile.emergencyName}
                          onChange={e => setEditProfile(p => ({ ...p, emergencyName: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>Contact Phone</label>
                        <input type="tel" placeholder="+91 98765 00000"
                          value={editProfile.emergencyPhone}
                          onChange={e => setEditProfile(p => ({ ...p, emergencyPhone: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-accent w-full"
                      style={{ justifyContent: 'center', padding: 13 }}
                      onClick={saveProfile}>
                      Save Changes
                    </button>
                    <button className="btn btn-outline"
                      style={{ padding: '13px 24px', whiteSpace: 'nowrap' }}
                      onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  )
}