import { createClient } from '@/lib/supabase-server'
import DiaryCalendar from '@/components/DiaryCalendar'
import WeatherCard from '@/components/WeatherCard'
import KakaoMap from '@/components/KakaoMap'
import InviteCode from '@/components/InviteCode'
import WeightChart from '@/components/WeightChart'
import PushSubscribe from '@/components/PushSubscribe'
import TodayCard from '@/components/TodayCard'
import UpcomingEvents from '@/components/UpcomingEvents'
import DogProfile from '@/components/DogProfile'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user!.id)
    .single()

  const { data: couple } = await supabase
    .from('couples')
    .select('invite_code')
    .eq('id', profile!.couple_id)
    .single()

  const [{ data }, { data: eventData }, { data: dogProfileData }, { data: latestWeightData }, { count: diaryCount }] = await Promise.all([
    supabase.from('diary').select('date').eq('couple_id', profile!.couple_id),
    supabase.from('special_events').select('date, type').eq('couple_id', profile!.couple_id),
    supabase.from('dog_profiles').select('breed, neutered').eq('couple_id', profile!.couple_id).single(),
    supabase.from('diary').select('weight, date').eq('couple_id', profile!.couple_id).not('weight', 'is', null).order('date', { ascending: false }).limit(1).single(),
    supabase.from('diary').select('*', { count: 'exact', head: true }).eq('couple_id', profile!.couple_id),
  ])

  const markedDates = (data ?? []).map(row => row.date)

  const specialEvents = (eventData ?? []).reduce<Record<string, string[]>>((acc, row) => {
    acc[row.date] = [...(acc[row.date] ?? []), row.type]
    return acc
  }, {})


  return (
    <div className="flex flex-col gap-4">
      <TodayCard coupleId={profile!.couple_id} />
      <WeatherCard />
      <DiaryCalendar markedDates={markedDates} specialEvents={specialEvents} coupleId={profile!.couple_id} />
      <KakaoMap />
      <UpcomingEvents coupleId={profile!.couple_id} />
      <WeightChart coupleId={profile!.couple_id} />
      <DogProfile
        coupleId={profile!.couple_id}
        initialBreed={dogProfileData?.breed ?? null}
        initialNeutered={dogProfileData?.neutered ?? false}
        currentWeight={latestWeightData?.weight ?? null}
        diaryCount={diaryCount ?? 0}
      />
      <PushSubscribe coupleId={profile!.couple_id} />
      {couple?.invite_code && <InviteCode code={couple.invite_code} />}
    </div>
  )
}
