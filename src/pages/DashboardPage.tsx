import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Activity, Heart, Camera, PawPrint, Calendar } from 'lucide-react'
import { format, getHours, isAfter, addDays } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface ActivityItem {
  id: string
  title: string
  activity_type: string
  scheduled_for: string | null
  completed: boolean
}

interface Vaccination {
  id: string
  vaccine_name: string
  next_due_date: string
  pets: { name: string } | null
}

function getGreeting() {
  const h = getHours(new Date())
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const typeColors: Record<string, string> = {
  walk: 'bg-blue-100 text-blue-700',
  feeding: 'bg-orange-100 text-orange-700',
  grooming: 'bg-purple-100 text-purple-700',
  vet_visit: 'bg-red-100 text-red-700',
  playtime: 'bg-green-100 text-green-700',
  custom: 'bg-stone-100 text-stone-700',
}

export default function DashboardPage() {
  const { profile, pets } = useAuthStore()
  const [todayActivities, setTodayActivities] = useState<ActivityItem[]>([])
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<Vaccination[]>([])
  const [stats, setStats] = useState({ activitiesThisWeek: 0, communityPosts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const today = new Date()
        const todayStart = format(today, 'yyyy-MM-dd')
        const todayEnd = format(addDays(today, 1), 'yyyy-MM-dd')

        const [activitiesRes, vacRes, weekActRes, postsRes] = await Promise.all([
          supabase
            .from('activities')
            .select('id, title, activity_type, scheduled_for, completed')
            .gte('scheduled_for', todayStart)
            .lt('scheduled_for', todayEnd)
            .order('scheduled_for'),
          supabase
            .from('vaccinations')
            .select('id, vaccine_name, next_due_date, pets(name)')
            .gte('next_due_date', todayStart)
            .lte('next_due_date', format(addDays(today, 30), 'yyyy-MM-dd'))
            .order('next_due_date'),
          supabase
            .from('activities')
            .select('id', { count: 'exact' })
            .gte('scheduled_for', format(addDays(today, -7), 'yyyy-MM-dd'))
            .eq('completed', true),
          supabase
            .from('community_posts')
            .select('id', { count: 'exact' }),
        ])

        setTodayActivities(activitiesRes.data ?? [])
        setUpcomingVaccinations((vacRes.data as unknown as Vaccination[]) ?? [])
        setStats({
          activitiesThisWeek: weekActRes.count ?? 0,
          communityPosts: postsRes.count ?? 0,
        })
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  const name = profile?.full_name?.split(' ')[0] || 'Pet Parent'

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">
          {getGreeting()}, {name}! 🌅
        </h1>
        <p className="text-stone-500 font-body mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'My Pets', value: pets.length, icon: '🐾', color: 'bg-orange-50 border-orange-200' },
          { label: 'Activities (week)', value: stats.activitiesThisWeek, icon: '✅', color: 'bg-green-50 border-green-200' },
          { label: 'Community Posts', value: stats.communityPosts, icon: '💬', color: 'bg-blue-50 border-blue-200' },
          { label: 'Today\'s Tasks', value: todayActivities.length, icon: '📋', color: 'bg-purple-50 border-purple-200' },
        ].map(s => (
          <div key={s.label} className={`clay-card p-4 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-heading font-bold text-stone-800">{loading ? '—' : s.value}</div>
            <div className="text-xs text-stone-500 font-body">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Pets */}
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-stone-800">My Pets</h2>
            <Link to="/pets" className="text-brand-500 text-sm font-semibold hover:underline">View all</Link>
          </div>
          {pets.length === 0 ? (
            <div className="text-center py-8">
              <PawPrint className="mx-auto text-stone-300 mb-2" size={40} />
              <p className="text-stone-400 font-body text-sm">No pets yet</p>
              <Link to="/pets">
                <button className="clay-btn mt-3 px-4 py-2 bg-brand-500 text-white text-sm">Add a Pet</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pets.slice(0, 3).map(pet => (
                <Link key={pet.id} to={`/pets/${pet.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border-2 border-orange-100 hover:border-orange-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center text-xl flex-shrink-0">
                      {pet.species === 'dog' ? '🐕' : '🐈'}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 font-body">{pet.name}</p>
                      <p className="text-xs text-stone-500">{pet.breed || pet.species}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Today's Activities */}
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-stone-800">Today's Activities</h2>
            <Link to="/activities" className="text-brand-500 text-sm font-semibold hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-stone-400 text-sm">Loading...</p>
          ) : todayActivities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-stone-300 mb-2" size={40} />
              <p className="text-stone-400 font-body text-sm">No activities today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayActivities.map(act => (
                <div key={act.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${act.completed ? 'opacity-60 bg-stone-50 border-stone-100' : 'bg-white border-orange-100'}`}>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${typeColors[act.activity_type] || typeColors.custom}`}>
                    {act.activity_type}
                  </span>
                  <span className={`font-body text-sm flex-1 ${act.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                    {act.title}
                  </span>
                  {act.completed && <span className="text-green-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Vaccinations */}
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-stone-800">Health Alerts</h2>
            <Link to="/health" className="text-brand-500 text-sm font-semibold hover:underline">View all</Link>
          </div>
          {upcomingVaccinations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto text-stone-300 mb-2" size={40} />
              <p className="text-stone-400 font-body text-sm">No upcoming vaccinations</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingVaccinations.slice(0, 4).map(vac => {
                const daysUntil = Math.ceil((new Date(vac.next_due_date).getTime() - Date.now()) / 86400000)
                const isUrgent = daysUntil <= 7
                return (
                  <div key={vac.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-100'}`}>
                    <span className="text-lg">{isUrgent ? '⚠️' : '💉'}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-stone-800">{vac.vaccine_name}</p>
                      <p className="text-xs text-stone-500">{vac.pets?.name} · Due {format(new Date(vac.next_due_date), 'MMM d')}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${isUrgent ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {daysUntil}d
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="clay-card p-6">
          <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/activities">
              <button className="clay-btn w-full py-4 bg-blue-500 text-white flex flex-col items-center gap-2 hover:bg-blue-600">
                <Activity size={22} />
                <span className="text-sm">Add Activity</span>
              </button>
            </Link>
            <Link to="/health">
              <button className="clay-btn w-full py-4 bg-green-500 text-white flex flex-col items-center gap-2 hover:bg-green-600">
                <Heart size={22} />
                <span className="text-sm">Update Health</span>
              </button>
            </Link>
            <Link to="/gallery">
              <button className="clay-btn w-full py-4 bg-purple-500 text-white flex flex-col items-center gap-2 hover:bg-purple-600">
                <Camera size={22} />
                <span className="text-sm">Add Photo</span>
              </button>
            </Link>
            <Link to="/community">
              <button className="clay-btn w-full py-4 bg-brand-500 text-white flex flex-col items-center gap-2 hover:bg-brand-600">
                <Plus size={22} />
                <span className="text-sm">New Post</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
