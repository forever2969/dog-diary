import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const imgData = readFileSync(join(process.cwd(), 'public/pong.jpeg'))
  const base64 = `data:image/jpeg;base64,${imgData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '40px',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <img src={base64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    ),
    { ...size }
  )
}
