import { createClient } from '@/lib/supabase-server'
import CoupleSetup from '@/components/CoupleSetup'
import { redirect } from 'next/navigation'

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="text-6xl mb-4">💑</p>
        <h2 className="text-xl font-bold text-amber-800">커플 연결</h2>
        <p className="text-sm text-gray-400 mt-1">함께 사용할 공간을 만들어요</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
        <CoupleSetup userId={user.id} />
      </div>
    </div>
  )
}
