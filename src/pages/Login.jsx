import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  { key: 'USER',   label: '👤 User',   desc: 'Book a ride'        },
  { key: 'DRIVER', label: '🚗 Driver', desc: 'View your trips'    },
  { key: 'ADMIN',  label: '🔧 Admin',  desc: 'Manage everything'  },
]

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole]       = useState('USER')
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSendOtp = () => {
    setError('')
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }
    setLoading(true)
    // Simulated OTP send — replace with real API later
    setTimeout(() => {
      setLoading(false)
      setOtpSent(true)
    }, 1000)
  }

  const handleVerify = () => {
    setError('')
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP.')
      return
    }
    // Demo: accept any OTP for now — replace with real API later
    if (otp !== '123456') {
      setError('Invalid OTP. Use 123456 for demo.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('role', role)
      localStorage.setItem('phone', phone)
      setLoading(false)
      if (role === 'USER')   navigate('/user')
      if (role === 'DRIVER') navigate('/driver')
      if (role === 'ADMIN')  navigate('/admin')
    }, 800)
  }

  const handleResend = () => {
    setOtp('')
    setOtpSent(false)
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg2)', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span onClick={() => navigate('/')} style={{
            cursor: 'pointer', fontSize: '0.88rem',
            color: 'var(--muted)', display: 'inline-flex',
            alignItems: 'center', gap: 6
          }}>← Back to home</span>
        </div>

        <div className="card" style={{ padding: 36 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>
              Karjee's <span style={{ color: 'var(--accent)' }}>Travels</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: 6 }}>
              Sign in to continue
            </p>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
              I am a...
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {ROLES.map(r => (
                <button key={r.key} onClick={() => { setRole(r.key); setOtpSent(false); setOtp(''); setError('') }}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-md)',
                    border: role === r.key ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                    background: role === r.key ? 'var(--bg2)' : 'var(--surface)',
                    cursor: 'pointer', transition: 'all 0.18s', textAlign: 'center'
                  }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: role === r.key ? 'var(--accent)' : 'var(--text)' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone input */}
          <div className="form-group">
            <label>Phone Number</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                padding: '11px 12px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)', background: 'var(--bg2)',
                color: 'var(--text)', fontSize: '0.95rem', whiteSpace: 'nowrap'
              }}>🇮🇳 +91</div>
              <input
                type="tel" maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                disabled={otpSent}
                style={{ opacity: otpSent ? 0.6 : 1 }}
              />
            </div>
          </div>

          {/* OTP input (shown after send) */}
          {otpSent && (
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Enter OTP</span>
                <span onClick={handleResend} style={{
                  fontSize: '0.78rem', color: 'var(--accent)',
                  cursor: 'pointer', fontWeight: 600
                }}>Change number?</span>
              </label>
              <input
                type="text" maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ letterSpacing: 6, fontSize: '1.1rem', textAlign: 'center' }}
                autoFocus
              />
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>
                OTP sent to +91 {phone} · <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={handleResend}>Resend</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                Demo: use <strong style={{ color: 'var(--text)' }}>123456</strong>
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#FFEBEE', color: '#c62828',
              borderRadius: 'var(--radius-md)', padding: '10px 14px',
              fontSize: '0.85rem', marginBottom: 16, border: '1px solid #ffcdd2'
            }}>{error}</div>
          )}

          {/* Action button */}
          {!otpSent ? (
            <button className="btn btn-dark w-full"
              style={{ justifyContent: 'center', padding: 13, marginTop: 4 }}
              onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP →'}
            </button>
          ) : (
            <button className="btn btn-accent w-full"
              style={{ justifyContent: 'center', padding: 13, marginTop: 4 }}
              onClick={handleVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login →'}
            </button>
          )}

        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)', marginTop: 20 }}>
          By continuing you agree to our Terms & Privacy Policy.
        </p>

      </div>
    </div>
  )
}