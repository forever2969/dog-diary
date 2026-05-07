import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '퐁이 일지',
    short_name: '퐁이',
    description: '우리 강아지 케어 기록',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffbeb',
    theme_color: '#fbbf24',
    orientation: 'portrait',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
