export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-8 bg-amber-100 rounded-xl animate-pulse" />
        <div className="w-28 h-6 bg-amber-100 rounded-xl animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="w-16 h-5 bg-amber-100 rounded-lg animate-pulse" />
            <div className="w-28 h-4 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-12 bg-amber-50 rounded-xl animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          <div className="h-16 bg-gray-50 rounded-xl animate-pulse" />
        </div>
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-3" />
        <div className="h-10 bg-amber-100 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}
