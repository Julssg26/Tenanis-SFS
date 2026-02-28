'use client'

import { Bell, Search, PanelLeftClose } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#1a237e] flex items-center px-4 gap-4 z-40">
      {/* Logo area */}
      <div className="flex items-center gap-2.5 w-[152px] shrink-0">
        <img
          src="/logo.png"
          alt="Tenaris SFS Logo"
          width={36}
          height={36}
          className="shrink-0"
        />
        <div>
          <div className="text-white font-bold text-[13px] leading-tight">Tenaris Smart</div>
          <div className="text-white/80 text-[11px] leading-tight">Fleet System</div>
        </div>
      </div>

      {/* Sidebar toggle */}
      <button className="text-white/60 hover:text-white transition-colors">
        <PanelLeftClose size={18} />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tractors, trailers, operators..."
            className="w-full bg-white rounded-full pl-9 pr-4 py-1.5 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative text-white/80 hover:text-white transition-colors">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
          3
        </span>
      </button>

      {/* User */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#e91e8c] flex items-center justify-center text-white font-bold text-[13px]">
          JP
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-white text-[12px] font-semibold leading-tight">JUAN_PEREZ@mail.com</div>
          <div className="text-white/60 text-[10px] leading-tight">User Admin</div>
        </div>
      </div>
    </header>
  )
}
