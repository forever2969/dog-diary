import { createClient } from '@/lib/supabase-server'
import DogProfile from '@/components/DogProfile'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user!.id)
    .single()

  const coupleId = profile!.couple_id

  const [{ data: dogProfile }, { data: latestWeight }, { count: diaryCount }] = await Promise.all([
    supabase.from('dog_profiles').select('breed, neutered').eq('couple_id', coupleId).single(),
    supabase.from('diary').select('weight, date').eq('couple_id', coupleId).not('weight', 'is', null).order('date', { ascending: false }).limit(1).single(),
    supabase.from('diary').select('*', { count: 'exact', head: true }).eq('couple_id', coupleId),
  ])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl">
          ← 뒤로
        </Link>
        <h2 className="text-lg font-bold text-amber-800">퐁이 프로필</h2>
      </div>
      <DogProfile
        coupleId={coupleId}
        initialBreed={dogProfile?.breed ?? null}
        initialNeutered={dogProfile?.neutered ?? false}
        currentWeight={latestWeight?.weight ?? null}
        diaryCount={diaryCount ?? 0}
      />
    </div>
  )
}
