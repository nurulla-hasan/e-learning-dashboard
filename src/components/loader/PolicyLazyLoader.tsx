export default function PolicyLazyLoader () {
  return (
    <>
        {/* Description Label */}
        <div className="w-20 h-4 bg-gray-300 rounded animate-pulse mb-4"></div>

        {/* Toolbar */}
        <div className="border border-gray-200 rounded-t-md p-3 bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            {/* First row of toolbar buttons */}
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <div className="w-12 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Text Editor Area */}
        <div className="border border-gray-200 border-t-0 rounded-b-md min-h-96 bg-white p-4">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between py-2 px-4 bg-gray-50 border border-gray-200 border-t-0 text-xs">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-3 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <div className="w-full h-12 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </>
  )
}
