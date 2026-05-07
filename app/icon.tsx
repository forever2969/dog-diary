import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:5500'

  const res = await fetch(`${baseUrl}/pong.jpeg`)
  const buffer = await res.arrayBuffer()
  const base64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <img src={base64} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-90deg)' }} />
      </div>
    ),
    { ...size }
  )
}
