import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const w = parseInt(searchParams.get('w') || '1179')
  const h = parseInt(searchParams.get('h') || '2556')

  const imgData = readFileSync(path.join(process.cwd(), 'public', 'pong.jpeg'))
  const src = `data:image/jpeg;base64,${imgData.toString('base64')}`
  const size = Math.round(Math.min(w, h) * 0.32)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fffbeb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={src}
          width={size}
          height={size}
          style={{ borderRadius: size / 2, objectFit: 'cover', border: `${Math.round(size * 0.06)}px solid #fde68a` }}
        />
      </div>
    ),
    { width: w, height: h },
  )
}
