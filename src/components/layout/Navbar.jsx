import React, { useEffect, useRef, useState } from 'react'
import { Search, Bell, ChevronDown, Menu, LogOut, Settings, UserCircle } from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, title: 'Vehicle VH-1048 service overdue', time: '12 min ago', unread: true },
    { id: 2, title: 'Trip TR-8843 running delayed', time: '38 min ago', unread: true },
    { id: 3, title: 'Expense EX-3303 awaiting approval', time: '2 hr ago', unread: false },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-border bg-surface-card/80 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-500 hover:bg-surface lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search vehicles, drivers, trips…"
          className="h-9 w-full rounded-lg border border-surface-border bg-surface pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-lg p-2 text-ink-500 hover:bg-surface"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-surface-card" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-surface-border bg-surface-card shadow-pop">
              <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
                <p className="text-sm font-semibold text-ink-900">Notifications</p>
                <span className="text-xs font-medium text-accent-600">2 new</span>
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 border-b border-surface-border px-4 py-3 last:border-0 hover:bg-surface"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        n.unread ? 'bg-accent-500' : 'bg-transparent'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-ink-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-b-xl px-4 py-2.5 text-center text-xs font-medium text-accent-600 hover:bg-surface">
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-surface"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
              SV
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-ink-900 leading-tight">Shwetha V</p>
              <p className="text-[11px] text-ink-400 leading-tight">Fleet Admin</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-surface-border bg-surface-card shadow-pop py-1.5">
              <div className="px-3.5 py-2 border-b border-surface-border mb-1">
                <p className="text-sm font-medium text-ink-900">Shwetha V</p>
                <p className="text-xs text-ink-400">shwetha.v@transitops.io</p>
              </div>
              <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-surface">
                <UserCircle className="h-4 w-4 text-ink-400" /> My Profile
              </button>
              <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-surface">
                <Settings className="h-4 w-4 text-ink-400" /> Settings
              </button>
              <div className="my-1 border-t border-surface-border" />
              <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-rose-600 hover:bg-rose-50">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
