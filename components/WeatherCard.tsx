type Recommendation = {
  emoji: string
  text: string
}

function getRecommendation(conditionId: number): Recommendation {
  if (conditionId >= 200 && conditionId < 300) return { emoji: '⛈️', text: '천둥번개가 쳐요. 오늘은 실내에서 쉬어요' }
  if (conditionId >= 300 && conditionId < 400) return { emoji: '🌦️', text: '이슬비가 내려요. 짧게 산책해도 좋아요' }
  if (conditionId >= 500 && conditionId < 600) return { emoji: '🌧️', text: '비가 오고 있어요. 실내에서 쉬어요' }
  if (conditionId >= 600 && conditionId < 700) return { emoji: '❄️', text: '눈이 와요! 조심해서 짧게 산책해요' }
  if (conditionId >= 700 && conditionId < 800) return { emoji: '🌫️', text: '날씨가 흐려요. 짧게 산책해요' }
  if (conditionId === 800) return { emoji: '🌞', text: '산책하기 완벽한 날씨예요!' }
  return { emoji: '⛅', text: '구름이 있지만 산책하기 좋아요' }
}

export default async function WeatherCard() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY
  const lat = process.env.WEATHER_LAT ?? '37.5665'
  const lon = process.env.WEATHER_LON ?? '126.9780'

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`,
    { next: { revalidate: 1800 } }
  )
  const data = await res.json()

  if (!data.main) return null

  const temp = Math.round(data.main.temp)
  const description = data.weather[0].description
  const { emoji, text } = getRecommendation(data.weather[0].id)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{description} · {temp}°C</p>
        <p className="text-base font-medium text-gray-700 mt-0.5">{text}</p>
      </div>
      <span className="text-4xl">{emoji}</span>
    </div>
  )
}
