'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('[KakaoMap] useEffect 실행, key:', process.env.NEXT_PUBLIC_KAKAO_MAP_KEY, 'ref:', !!mapRef.current)
    if (!mapRef.current) return

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`

    script.onerror = (e) => console.error('[KakaoMap] 스크립트 로드 실패', e)
    script.onload = () => {
      console.log('[KakaoMap] 스크립트 로드 성공')
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords
            const center = new window.kakao.maps.LatLng(latitude, longitude)

            const map = new window.kakao.maps.Map(mapRef.current, {
              center,
              level: 5,
            })

            new window.kakao.maps.Marker({ position: center, map })

            const places = new window.kakao.maps.services.Places()
            places.keywordSearch(
              '공원',
              (result: any[], status: string) => {
                if (status !== window.kakao.maps.services.Status.OK) return
                result.slice(0, 5).forEach(place => {
                  const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(place.y, place.x),
                    map,
                  })
                  const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:4px 8px;font-size:12px;white-space:nowrap">${place.place_name}</div>`,
                  })
                  window.kakao.maps.event.addListener(marker, 'click', () => {
                    infowindow.open(map, marker)
                  })
                })
              },
              { location: center, radius: 2000 }
            )
          },
          () => {
            new window.kakao.maps.Map(mapRef.current, {
              center: new window.kakao.maps.LatLng(37.5665, 126.9780),
              level: 5,
            })
          }
        )
      })
    }

    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-medium text-gray-600">주변 산책 경로</p>
      </div>
      <div ref={mapRef} className="w-full h-64" />
    </div>
  )
}
