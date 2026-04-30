import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  Home, PawPrint, Heart, Calendar, Image,
  MessageCircle, BookOpen, User, LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/pets', icon: PawPrint, label: 'My Pets' },
  { to: '/health', icon: Heart, label: 'Health' },
  { to: '/activities', icon: Calendar, label: 'Activities' },
  { to: '/gallery', icon: Image, label: 'Gallery' },
  { to: '/community', icon: MessageCircle, label: 'Community' },
  { to: '/breeds', icon: BookOpen, label: 'Breeds' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  const { profile, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-orange-200 shadow-clay-sm flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b-2 border-orange-100">
          <h1 className="text-3xl font-heading font-bold text-brand-500 flex items-center gap-2">
            🐾 PAWPAD
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-body">Smart Pet ID Tags</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-body font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-clay'
                    : 'text-stone-600 hover:bg-orange-50 hover:text-brand-500'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t-2 border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-brand-300 flex items-center justify-center text-brand-600 font-heading font-bold text-lg overflow-hidden flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name?.charAt(0) || '?').toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="font-body font-semibold text-stone-800 text-sm truncate">
                {profile?.full_name || 'Pet Parent'}
              </p>
              <p className="text-xs text-stone-400 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="clay-btn w-full flex items-center gap-2 justify-center px-4 py-2 bg-stone-100 text-stone-600 text-sm hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Bottom tab bar - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-200 flex z-50">
        {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-body font-semibold transition-colors ${
                isActive ? 'text-brand-500' : 'text-stone-400'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
