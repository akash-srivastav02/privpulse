import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0f',
          color: '#f0f0f8',
          padding: 72,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: '#4ecca3', boxShadow: '0 0 24px #4ecca3' }} />
          <div style={{ fontSize: 34, fontWeight: 800 }}>Priv<span style={{ color: '#4ecca3' }}>Pulse</span></div>
        </div>
        <div>
          <div style={{ display: 'inline-flex', color: '#6c63ff', background: 'rgba(108,99,255,.14)', border: '1px solid rgba(108,99,255,.28)', borderRadius: 999, padding: '10px 20px', fontSize: 22, marginBottom: 28 }}>
            No cookies. No banners. DPDP ready.
          </div>
          <div style={{ fontSize: 74, lineHeight: 1.02, fontWeight: 900, letterSpacing: -3, maxWidth: 860 }}>
            Privacy-first analytics for India
          </div>
          <div style={{ fontSize: 28, color: '#8888aa', marginTop: 24 }}>
            One script tag. Clean dashboard. From ₹0/month.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, color: '#8888aa', fontSize: 22 }}>
          <span>1.8KB script</span>
          <span>·</span>
          <span>0 cookies</span>
          <span>·</span>
          <span>₹199 indie plan</span>
        </div>
      </div>
    ),
    size
  )
}
