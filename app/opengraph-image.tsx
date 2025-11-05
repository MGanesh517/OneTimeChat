import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#050d08',
          position: 'relative',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,136,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px, 24px 24px',
          }}
        />
        {/* Glow ring */}
        <div
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            left: 80,
            top: 125,
            borderRadius: 9999,
            boxShadow: '0 0 140px 30px rgba(0,255,136,0.35) inset, 0 0 120px rgba(0,255,136,0.22)',
            border: '10px solid rgba(0,255,136,0.6)',
          }}
        />
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginLeft: 520, marginTop: 160 }}>
          <div style={{
            color: '#00ff88',
            fontSize: 18,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            Anonymous Secure Chat
          </div>
          <div style={{
            color: '#eafff5',
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            textShadow: '0 0 12px rgba(0,255,136,0.4)',
          }}>
            OneTime Chat
          </div>
          <div style={{ color: '#9cf7d6', fontSize: 24, opacity: 0.8 }}>
            Unique Rooms • Real-time • Video Calls
          </div>
          <div style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 14px',
            borderRadius: 6,
            border: '2px solid #00ff88',
            color: '#00ff88',
            background: 'rgba(0,255,136,0.08)'
          }}>
            onetime.chat
          </div>
        </div>
        {/* Left glyph */}
        <div style={{ position: 'absolute', left: 138, top: 230, color: '#00ff88', fontSize: 120 }}>▮▮</div>
        <div style={{ position: 'absolute', left: 118, top: 210, color: '#00ff88', fontSize: 42, opacity: 0.9 }}>OTC</div>
      </div>
    ),
    {
      ...size,
    }
  )
}


