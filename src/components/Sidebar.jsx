export default function Sidebar({ logo, menu, active, onSelect, onLogout, roleColor, roleLabel }) {
  return (
    <div style={{
      width: 220, background: 'var(--bg)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', flexShrink: 0, transition: 'background 0.3s'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
          Karjee's <span style={{ color: 'var(--accent)' }}>Travels</span>
        </div>
        <div style={{ marginTop: 6, display: 'inline-block', background: roleColor + '22', color: roleColor, padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
          {roleLabel}
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, paddingTop: 12 }}>
        {menu.map(item => (
          <div key={item.key} onClick={() => onSelect(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px', cursor: 'pointer',
            color: active === item.key ? 'var(--text)' : 'var(--muted)',
            background: active === item.key ? 'var(--bg2)' : 'transparent',
            borderLeft: active === item.key ? `3px solid ${roleColor}` : '3px solid transparent',
            fontSize: '0.9rem', fontWeight: active === item.key ? 600 : 400,
            transition: 'all 0.18s'
          }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div onClick={onLogout} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 20px', cursor: 'pointer',
        color: 'var(--muted)', borderTop: '1px solid var(--border)',
        fontSize: '0.9rem', transition: 'color 0.18s'
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >
        <span>🚪</span> Logout
      </div>
    </div>
  )
}