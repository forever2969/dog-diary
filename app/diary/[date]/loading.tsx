export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-8 bg-amber-100 rounded-xl animate-pulse" />
        <div className="w-32 h-6 bg-amber-100 rounded-xl animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5 h-32 animate-pulse" />
      <div className="bg-white rounded-2xl shadow-sm p-5 h-64 animate-pulse" />
    </div>
  )
}
