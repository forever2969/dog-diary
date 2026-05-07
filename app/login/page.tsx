import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-amber-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pong.jpeg" alt="퐁이" className="w-full h-full object-cover -rotate-90" />
        </div>
        <h1 className="text-2xl font-bold text-amber-800">퐁이 일지</h1>
        <p className="text-sm text-gray-400 mt-1">우리 강아지 케어 기록</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
        <AuthForm />
      </div>
    </div>
  )
}
