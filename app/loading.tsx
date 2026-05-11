export default function Loading() {
  return (
    <div className="fixed inset-0 bg-amber-50 flex flex-col items-center justify-center gap-5">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg">
        <img src="/pong.jpeg" alt="퐁이" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold text-amber-800">퐁이 일지</p>
        <p className="text-sm text-amber-400">잠깐만 기다려줘요 🐾</p>
      </div>
      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
