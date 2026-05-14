import { useState } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'

export default function TopBar() {
  const [search, setSearch] = useState('')

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex min-h-[64px] items-center justify-between border-b border-gray-100 bg-white px-4 py-3 md:left-[220px] md:px-6">
      <div className="flex max-w-full flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 md:w-[340px] md:max-w-[340px]">
        <Search size={16} className="flex-shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="ml-3 flex flex-shrink-0 items-center gap-3 md:gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
          <span className="text-lg" aria-hidden>
            🔥
          </span>
        </div>

        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            1
          </span>
        </div>

        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-purple-400 ring-2 ring-gray-200" aria-hidden title="Avatar" />

        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0F172A]">Moni Roy</span>
            <span className="text-xs text-gray-400">User</span>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  )
}
