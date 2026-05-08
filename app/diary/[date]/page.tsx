import { createClient } from '@/lib/supabase-server'
import DiaryForm from '@/components/DiaryForm'
import WalkTimer from '@/components/WalkTimer'
import SpecialEvents from '@/components/SpecialEvents'
import BackButton from '@/components/BackButton'

type Props = {
  params: Promise<{ date: string }>
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${month}월 ${day}일 (${days[date.getDay()]})`
}

export default async function DiaryPage({ params }: Props) {
  const { date } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user!.id)
    .single()

  const coupleId = profile!.couple_id

  const { data } = await supabase
    .from('diary')
    .select('*')
    .eq('date', date)
    .eq('couple_id', coupleId)
    .single()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton />
        <h2 className="text-lg font-bold text-amber-800">{formatDate(date)}</h2>
      </div>
      <WalkTimer date={date} coupleId={coupleId} />
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <DiaryForm date={date} coupleId={coupleId} initial={data} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <SpecialEvents date={date} coupleId={coupleId} />
      </div>
    </div>
  )
}
