import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, Code, Video, BarChart2, User } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { to: '/dashboard/practice', label: 'Practice', icon: <Code size={18} /> },
  { to: '/dashboard/assessments', label: 'Assessments', icon: <Video size={18} /> },
  { to: '/dashboard/resources', label: 'Resources', icon: <BarChart2 size={18} /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <User size={18} /> }
]

export default function AppShell() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <div className="px-6 py-5 font-serif text-lg">Placement Prep</div>
        <nav className="px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <span className="opacity-90">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="text-lg font-semibold">Placement Prep</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Signed in</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

