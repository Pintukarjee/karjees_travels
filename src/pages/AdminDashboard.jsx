import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const INIT_BOOKINGS = [
  { id: 1, customer: 'Rahul Mehta',  phone: '+91 98765 43210', car: 'Ertiga',      pickup: 'Koramangala, Bangalore', drop: 'Mysore Bus Stand', start: '2026-03-25', end: '2026-03-27', status: 'CONFIRMED',  driver: 'Vikram Das',  notes: 'Early morning pickup' },
  { id: 2, customer: 'Priya Sharma', phone: '+91 91234 56789', car: 'Swift Dzire', pickup: 'Indiranagar, Bangalore',  drop: 'Coorg',            start: '2026-03-28', end: '2026-03-30', status: 'PENDING',    driver: null,          notes: '' },
  { id: 3, customer: 'Arun Nair',    phone: '+91 99887 65432', car: 'Ertiga',      pickup: 'Whitefield',             drop: 'Hampi',            start: '2026-04-01', end: '2026-04-03', status: 'PENDING',    driver: null,          notes: 'Needs child seat' },
  { id: 4, customer: 'Sneha Rao',    phone: '+91 98001 11222', car: 'Swift Dzire', pickup: 'HSR Layout',             drop: 'Ooty',             start: '2026-04-05', end: '2026-04-07', status: 'CANCELLED',  driver: null,          notes: '' },
]

const INIT_CARS = [
  { id: 1, name: 'Ertiga',      category: 'Comfort', price: 1799, seats: 7, available: true  },
  { id: 2, name: 'Swift Dzire', category: 'Economy', price: 999,  seats: 5, available: true  },
]

const INIT_DRIVERS = [
  { id: 1, name: 'Vikram Das',  phone: '+91 99001 12233', trips: 24, status: 'Active' },
  { id: 2, name: 'Ravi Kumar',  phone: '+91 99001 44455', trips: 18, status: 'Active' },
]

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [page, setPage]         = useState('overview')
  const [bookings, setBookings] = useState(INIT_BOOKINGS)
  const [cars, setCars]         = useState(INIT_CARS)
  const [drivers, setDrivers]   = useState(INIT_DRIVERS)
  const [filter, setFilter]     = useState('ALL')
  const [toast, setToast]       = useState('')

  // New car form
  const [newCar, setNewCar] = useState({ name: '', category: 'Economy', price: '', seats: '', color: '', fuel: 'Petrol', ac: true, regNo: '', photo: null })
  const [carEditId, setCarEditId] = useState(null)

  const handleCarPhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setNewCar(p => ({ ...p, photo: reader.result }))
    reader.readAsDataURL(file)
  }
  // New driver form
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', photo: null, dlNumber: '', dlExpiry: '', dlPhoto: null })

  const handleDriverPhoto = (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setNewDriver(p => ({ ...p, [field]: reader.result }))
    reader.readAsDataURL(file)
  }

  const logout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('phone')
    localStorage.removeItem('token')
    navigate('/')
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    showToast(`Booking #${id} marked as ${status}`)
  }

  const assignDriver = (id, driver) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, driver: driver || null } : b))
    showToast(driver ? `Driver "${driver}" assigned` : 'Driver unassigned')
  }

  const addCar = () => {
    if (!newCar.name || !newCar.price || !newCar.seats) { showToast('⚠️ Fill all required car fields'); return }
    setCars(prev => [...prev, {
      id: prev.length + 1,
      name: newCar.name, category: newCar.category,
      price: +newCar.price, seats: +newCar.seats,
      color: newCar.color, fuel: newCar.fuel,
      ac: newCar.ac, regNo: newCar.regNo,
      photo: newCar.photo, available: true
    }])
    setNewCar({ name: '', category: 'Economy', price: '', seats: '', color: '', fuel: 'Petrol', ac: true, regNo: '', photo: null })
    showToast(`✅ ${newCar.name} added to fleet`)
  }

  const toggleCar = (id) => {
    setCars(prev => prev.map(c => c.id === id ? { ...c, available: !c.available } : c))
  }

  const addDriver = () => {
    if (!newDriver.name || !newDriver.phone) { showToast('⚠️ Fill all driver fields'); return }
    if (!newDriver.dlNumber) { showToast('⚠️ DL number is required'); return }
    setDrivers(prev => [...prev, {
      id: prev.length + 1,
      name: newDriver.name, phone: newDriver.phone,
      photo: newDriver.photo, dlNumber: newDriver.dlNumber,
      dlExpiry: newDriver.dlExpiry, dlPhoto: newDriver.dlPhoto,
      trips: 0, status: 'Active'
    }])
    setNewDriver({ name: '', phone: '', photo: null, dlNumber: '', dlExpiry: '', dlPhoto: null })
    showToast(`✅ ${newDriver.name} added as driver`)
  }

  const removeDriver = (id, name) => {
    if (!window.confirm(`Remove ${name} from drivers?`)) return
    setDrivers(prev => prev.filter(d => d.id !== id))
    // unassign from any bookings
    setBookings(prev => prev.map(b => b.driver === name ? { ...b, driver: null } : b))
    showToast(`🗑️ ${name} removed`)
  }

  // Stats
  const total     = bookings.length
  const pending   = bookings.filter(b => b.status === 'PENDING').length
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length
  const revenue   = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => {
      const car  = cars.find(c => c.name === b.car)
      const days = Math.max(1, Math.ceil((new Date(b.end) - new Date(b.start)) / (1000 * 60 * 60 * 24)))
      return sum + (car ? car.price * days : 0)
    }, 0)

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const menuItems = [
    { key: 'overview', icon: '📊', label: 'Overview'      },
    { key: 'bookings', icon: '📋', label: 'All Bookings'  },
    { key: 'cars',     icon: '🚗', label: 'Manage Cars'   },
    { key: 'drivers',  icon: '👨‍✈️', label: 'Drivers'       },
  ]

  const StatusBtn = ({ id, current }) => (
    <div style={{ display: 'flex', gap: 6 }}>
      {current === 'PENDING' && (
        <button className="btn btn-success btn-sm" onClick={() => updateStatus(id, 'CONFIRMED')}>Confirm</button>
      )}
      {current !== 'CANCELLED' && current !== 'COMPLETED' && (
        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(id, 'CANCELLED')}>Cancel</button>
      )}
    </div>
  )

  const BookingTable = ({ list }) => (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>#</th><th>Customer</th><th>Car</th><th>Route</th>
            <th>Dates</th><th>Driver</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map(b => (
            <tr key={b.id}>
              <td style={{ color: 'var(--muted)', fontWeight: 600 }}>#{b.id}</td>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{b.customer}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{b.phone}</div>
              </td>
              <td style={{ color: 'var(--text)' }}>{b.car}</td>
              <td style={{ fontSize: '0.82rem' }}>
                <div style={{ color: 'var(--text)' }}>{b.pickup}</div>
                <div style={{ color: 'var(--accent)', fontWeight: 600 }}>→ {b.drop}</div>
              </td>
              <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{b.start}<br />{b.end}</td>
              <td>
                <select
                  value={b.driver || ''}
                  onChange={e => assignDriver(b.id, e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}>
                  <option value="">Unassigned</option>
                  {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </td>
              <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
              <td><StatusBtn id={b.id} current={b.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="dash-layout">
      <Sidebar
        menu={menuItems}
        active={page}
        onSelect={setPage}
        onLogout={logout}
        roleColor="#e53935"
        roleLabel="Admin"
      />

      <div className="dash-main">
        <div className="dash-header">
          <h2>{{ overview: 'Overview', bookings: 'All Bookings', cars: 'Manage Cars', drivers: 'Drivers' }[page]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: '#FFEBEE', color: '#c62828', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Admin</span>
            <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="dash-content">

          {/* ── OVERVIEW ── */}
          {page === 'overview' && (
            <div>
              <div className="stat-grid">
                <div className="stat-card"><div className="icon">📋</div><div className="val">{total}</div><div className="lbl">Total Bookings</div></div>
                <div className="stat-card"><div className="icon">⏳</div><div className="val">{pending}</div><div className="lbl">Pending</div></div>
                <div className="stat-card"><div className="icon">✅</div><div className="val">{confirmed}</div><div className="lbl">Confirmed</div></div>
                <div className="stat-card"><div className="icon">💰</div><div className="val">₹{revenue.toLocaleString('en-IN')}</div><div className="lbl">Est. Revenue</div></div>
              </div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>Recent Bookings</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setPage('bookings')}>View All →</button>
                </div>
                <BookingTable list={bookings.slice(0, 3)} />
              </div>
            </div>
          )}

          {/* ── ALL BOOKINGS ── */}
          {page === 'bookings' && (
            <div>
              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'var(--surface)', padding: 6, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: 'fit-content' }}>
                {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none',
                    background: filter === f ? 'var(--text)' : 'transparent',
                    color: filter === f ? 'var(--bg)' : 'var(--muted)',
                    fontWeight: filter === f ? 700 : 400, fontSize: '0.85rem', cursor: 'pointer',
                    transition: 'all 0.18s'
                  }}>{f} {filter === f && `(${filtered.length})`}</button>
                ))}
              </div>
              <div className="card">
                <BookingTable list={filtered} />
              </div>
            </div>
          )}

          {/* ── MANAGE CARS ── */}
          {page === 'cars' && (
            <div>
              {/* Add car form */}
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Add New Car</h3>

                {/* Photo upload */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                  <div style={{
                    width: 120, height: 90, borderRadius: 'var(--radius-md)',
                    border: '2px dashed var(--border)', background: 'var(--bg2)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', overflow: 'hidden', flexShrink: 0, cursor: 'pointer'
                  }}>
                    {newCar.photo
                      ? <img src={newCar.photo} alt="car" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.6rem' }}>🚗</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>Car Photo</div>
                        </div>
                    }
                  </div>
                  <div>
                    <label htmlFor="car-photo" className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                      📷 {newCar.photo ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <input id="car-photo" type="file" accept="image/*"
                      style={{ display: 'none' }} onChange={handleCarPhoto} />
                    {newCar.photo && (
                      <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }}
                        onClick={() => setNewCar(p => ({ ...p, photo: null }))}>🗑️ Remove</button>
                    )}
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 8 }}>
                      Upload a clear photo of the car (JPG/PNG)
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Car Name *</label>
                    <input type="text" placeholder="e.g. Toyota Fortuner"
                      value={newCar.name} onChange={e => setNewCar(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Category *</label>
                    <select value={newCar.category} onChange={e => setNewCar(p => ({ ...p, category: e.target.value }))}>
                      <option>Economy</option><option>Comfort</option><option>Luxury</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Price / day (₹) *</label>
                    <input type="number" placeholder="1500"
                      value={newCar.price} onChange={e => setNewCar(p => ({ ...p, price: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Seats *</label>
                    <input type="number" placeholder="5"
                      value={newCar.seats} onChange={e => setNewCar(p => ({ ...p, seats: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Color</label>
                    <input type="text" placeholder="e.g. White"
                      value={newCar.color} onChange={e => setNewCar(p => ({ ...p, color: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Fuel Type</label>
                    <select value={newCar.fuel} onChange={e => setNewCar(p => ({ ...p, fuel: e.target.value }))}>
                      <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Registration No.</label>
                    <input type="text" placeholder="KA-01-AB-1234"
                      value={newCar.regNo} onChange={e => setNewCar(p => ({ ...p, regNo: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>AC</label>
                    <select value={newCar.ac ? 'yes' : 'no'} onChange={e => setNewCar(p => ({ ...p, ac: e.target.value === 'yes' }))}>
                      <option value="yes">AC</option><option value="no">Non-AC</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-accent" onClick={addCar}>+ Add Car</button>
              </div>

              {/* Car list */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Fleet ({cars.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {cars.map(c => (
                    <div key={c.id} style={{
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden', background: 'var(--surface)'
                    }}>
                      {/* Car photo */}
                      <div style={{
                        height: 140, background: 'var(--bg2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', position: 'relative'
                      }}>
                        {c.photo
                          ? <img src={c.photo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '3rem' }}>🚗</span>
                        }
                        <span style={{
                          position: 'absolute', top: 10, right: 10,
                          background: c.available ? '#E8F5E9' : '#FFEBEE',
                          color: c.available ? '#2e7d32' : '#c62828',
                          padding: '3px 10px', borderRadius: 20,
                          fontSize: '0.72rem', fontWeight: 700
                        }}>{c.available ? 'Available' : 'Unavailable'}</span>
                      </div>

                      {/* Car info */}
                      <div style={{ padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{c.category}</div>
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--accent)' }}>₹{c.price.toLocaleString('en-IN')}/day</div>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {[
                            `${c.seats} seats`,
                            c.fuel || 'Petrol',
                            c.ac !== false ? 'AC' : 'Non-AC',
                            c.color || null,
                          ].filter(Boolean).map(tag => (
                            <span key={tag} style={{
                              background: 'var(--bg2)', color: 'var(--muted)',
                              padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem',
                              border: '1px solid var(--border)'
                            }}>{tag}</span>
                          ))}
                        </div>

                        {c.regNo && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 12 }}>
                            🔢 {c.regNo}
                          </div>
                        )}

                        <button className="btn btn-outline btn-sm w-full"
                          style={{ justifyContent: 'center' }}
                          onClick={() => toggleCar(c.id)}>
                          {c.available ? '🔴 Mark Unavailable' : '🟢 Mark Available'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DRIVERS ── */}
          {page === 'drivers' && (
            <div>
              {/* Add driver form */}
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Add New Driver</h3>

                {/* Photos row */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                  {/* Profile photo */}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Profile Photo</div>
                    <div style={{
                      width: 90, height: 90, borderRadius: '50%',
                      border: '2px dashed var(--border)', background: 'var(--bg2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', cursor: 'pointer', marginBottom: 8
                    }}>
                      {newDriver.photo
                        ? <img src={newDriver.photo} alt="driver" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.8rem' }}>👤</span>
                      }
                    </div>
                    <label htmlFor="driver-photo" className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                      📷 Upload
                    </label>
                    <input id="driver-photo" type="file" accept="image/*"
                      style={{ display: 'none' }} onChange={e => handleDriverPhoto(e, 'photo')} />
                  </div>

                  {/* DL photo */}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Driving License Photo</div>
                    <div style={{
                      width: 160, height: 90, borderRadius: 'var(--radius-md)',
                      border: '2px dashed var(--border)', background: 'var(--bg2)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', marginBottom: 8
                    }}>
                      {newDriver.dlPhoto
                        ? <img src={newDriver.dlPhoto} alt="dl" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <>
                            <span style={{ fontSize: '1.6rem' }}>🪪</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>DL Photo</span>
                          </>
                      }
                    </div>
                    <label htmlFor="driver-dl-photo" className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                      📷 Upload DL
                    </label>
                    <input id="driver-dl-photo" type="file" accept="image/*"
                      style={{ display: 'none' }} onChange={e => handleDriverPhoto(e, 'dlPhoto')} />
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Full Name *</label>
                    <input type="text" placeholder="e.g. Vikram Das"
                      value={newDriver.name} onChange={e => setNewDriver(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Phone Number *</label>
                    <input type="tel" placeholder="+91 99000 00000"
                      value={newDriver.phone} onChange={e => setNewDriver(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>DL Number *</label>
                    <input type="text" placeholder="KA-01-20XX-XXXXXX"
                      value={newDriver.dlNumber} onChange={e => setNewDriver(p => ({ ...p, dlNumber: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>DL Expiry Date</label>
                    <input type="date"
                      value={newDriver.dlExpiry} onChange={e => setNewDriver(p => ({ ...p, dlExpiry: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-accent" style={{ marginTop: 16 }} onClick={addDriver}>+ Add Driver</button>
              </div>

              {/* Driver cards */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Drivers ({drivers.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {drivers.map(d => (
                    <div key={d.id} style={{
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                      padding: 20, background: 'var(--surface)'
                    }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                        <div style={{
                          width: 54, height: 54, borderRadius: '50%',
                          background: d.photo ? 'transparent' : '#1976d2',
                          border: '2px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden', flexShrink: 0,
                          fontWeight: 800, fontSize: '1.2rem', color: '#fff'
                        }}>
                          {d.photo
                            ? <img src={d.photo} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : d.name[0]
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{d.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{d.phone}</div>
                        </div>
                        <span className="badge badge-confirmed">{d.status}</span>
                      </div>

                      {/* Details */}
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                          <span>🪪 DL Number</span>
                          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{d.dlNumber || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                          <span>📅 DL Expiry</span>
                          <span style={{ color: d.dlExpiry && new Date(d.dlExpiry) < new Date() ? 'var(--danger)' : 'var(--text)', fontWeight: 600 }}>
                            {d.dlExpiry || '—'}
                            {d.dlExpiry && new Date(d.dlExpiry) < new Date() ? ' ⚠️ Expired' : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                          <span>🗺️ Total Trips</span>
                          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{d.trips}</span>
                        </div>
                      </div>

                      {/* DL photo preview */}
                      {d.dlPhoto && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>DL Preview</div>
                          <img src={d.dlPhoto} alt="dl"
                            style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                        </div>
                      )}

                      {/* Action */}
                      <button className="btn btn-danger btn-sm w-full"
                        style={{ justifyContent: 'center' }}
                        onClick={() => removeDriver(d.id, d.name)}>
                        🗑️ Remove Driver
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          background: 'var(--text)', color: 'var(--bg)',
          padding: '12px 20px', borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.3s ease'
        }}>{toast}</div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}