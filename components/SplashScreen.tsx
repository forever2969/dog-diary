'use client'

import { useState, useLayoutEffect } from 'react'

export default function SplashScreen() {
  const [show, setShow] = useState(true)
  const [fading, setFading] = useState(false)

  useLayoutEffect(() => {
    if (sessionStorage.getItem('app_launched')) {
      setShow(false)
    } else {
      sessionStorage.setItem('app_launched', '1')
      const fade = setTimeout(() => setFading(true), 600)
      const hide = setTimeout(() => setShow(false), 1100)
      return () => { clearTimeout(fade); clearTimeout(hide) }
    }
  }, [])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#fffbeb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.5s' : 'none',
        pointerEvents: 'none',
      }}
    >
      <div style={{ width: 112, height: 112, borderRadius: 56, overflow: 'hidden', border: '4px solid #fde68a', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <img src="/pong.jpeg" alt="퐁이" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: 24, fontWeight: 700, color: '#92400e', margin: 0 }}>퐁이 일지</p>
        <p style={{ fontSize: 14, color: '#fbbf24', margin: '4px 0 0' }}>잠깐만 기다려줘요 🐾</p>
      </div>
    </div>
  )
}
