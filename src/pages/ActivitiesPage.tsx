import { useEffect, useState } from 'react'
import { Plus, Check, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface Activity {
  id: string
  title: string
  activity_type: string
  duration_minutes?: number
  notes?: string
  completed: boolean
  scheduled_for?: string
  is_recurring: boolean
  recurrence_pattern?: string
  pet_id?: string
}

const ACTIVITY_TYPES = [
  { value: 'walk', label: 'Walk', emoji: '🚶', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'feeding', label: 'Feeding', emoji: '🍖', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'grooming', label: 'Grooming', emoji: '✂️', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'vet_visit', label: 'Vet Visit', emoji: '🏥', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'playtime', label: 'Playtime', emoji: '🎾', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'custom', label: 'Custom', emoji: '⭐', color: 'bg-stone-100 text-stone-700 border-stone-200' },
]

const typeStyle: Record<string, string> = {
  walk: 'bg-blue-100 text-blue-700 border-blue-200',
  feeding: 'bg-orange-100 text-orange-700 border-orange-200',
  grooming: 'bg-purple-100 text-purple-700 border-purple-200',
  vet_visit: 'bg-red-100 text-red-700 border-red-200',
  playtime: 'bg-green-100 text-green-700 border-green-200',
  custom: 'bg-stone-100 text-stone-700 border-stone-200',
}

const typeEmoji: Record<string, string> = {
  walk: '🚶', feeding: '🍖', grooming: '✂️', vet_visit: '🏥', playtime: '🎾', custom: '⭐'
}

export default function ActivitiesPage() {
  const { user, pets } = useAuthStore()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [form, setForm] = useState({
    title: '',
    activity_type: 'walk',
    duration_minutes: '',
    notes: '',
    scheduled_for: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    is_recurring: false,
    recurrence_pattern: 'daily',
    pet_id: '',
  })

  useEffect(() => {
    if (!user) return
    supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_for', { ascending: true })
      .then(({ data }) => {
        setActivities(data ?? [])
        setLoading(false)
      })
  }, [user])

  const addActivity = async () => {
    if (!user || !form.title) return
    try {
      const { data, error } = await supabase.from('activities').insert({
        user_id: user.id,
        title: form.title,
        activity_type: form.activity_type,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        notes: form.notes || null,
        scheduled_for: form.scheduled_for ? new Date(form.scheduled_for).toISOString() : null,
        is_recurring: form.is_recurring,
        recurrence_pattern: form.is_recurring ? form.recurrence_pattern : null,
        pet_id: form.pet_id || null,
        completed: false,
      }).select().single()
      if (error) throw error
      setActivities([...activities, data])
      setShowModal(false)
      setForm({ title: '', activity_type: 'walk', duration_minutes: '', notes: '', scheduled_for: format(new Date(), "yyyy-MM-dd'T'HH:mm"), is_recurring: false, recurrence_pattern: 'daily', pet_id: '' })
      toast.success('Activity added!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    }
  }

  const toggleComplete = async (act: Activity) => {
    const updated = { completed: !act.completed, completed_at: !act.completed ? new Date().toISOString() : null }
    await supabase.from('activities').update(updated).eq('id', act.id)
    setActivities(activities.map(a => a.id === act.id ? { ...a, ...updated } : a))
  }

  const deleteActivity = async (id: string) => {
    await supabase.from('activities').delete().eq('id', id)
    setActivities(activities.filter(a => a.id !== id))
    toast.success('Activity deleted')
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayActivities = activities.filter(a => a.scheduled_for?.startsWith(todayStr))
  const upcomingActivities = activities.filter(a => a.scheduled_for && !a.scheduled_for.startsWith(todayStr) && new Date(a.scheduled_for) > new Date())
  const filtered = filterType === 'all' ? activities : activities.filter(a => a.activity_type === filterType)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">Activities</h1>
          <p className="text-stone-500 mt-1">Track your pet's daily routine</p>
        </div>
        <button onClick={() => setShowModal(true)} className="clay-btn flex items-center gap-2 px-5 py-3 bg-brand-500 text-white hover:bg-brand-600">
          <Plus size={20} /> Add Activity
        </button>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilterType('all')} className={`clay-btn px-4 py-2 text-sm whitespace-nowrap ${filterType === 'all' ? 'bg-brand-500 text-white' : 'bg-white text-stone-600'}`}>
          All
        </button>
        {ACTIVITY_TYPES.map(t => (
          <button key={t.value} onClick={() => setFilterType(t.value)}
            className={`clay-btn px-4 py-2 text-sm whitespace-nowrap flex items-center gap-1 ${filterType === t.value ? `bg-brand-500 text-white` : 'bg-white text-stone-600'}`}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading activities...</div>
      ) : (
        <div className="space-y-6">
          {/* Today */}
          {filterType === 'all' && (
            <>
              <div className="clay-card p-6">
                <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">
                  Today · {format(new Date(), 'EEEE, MMMM d')}
                </h2>
                {todayActivities.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-4">No activities scheduled for today</p>
                ) : (
                  <div className="space-y-2">
                    {todayActivities.map(act => (
                      <ActivityRow key={act.id} act={act} onToggle={toggleComplete} onDelete={deleteActivity} />
                    ))}
                  </div>
                )}
              </div>

              {upcomingActivities.length > 0 && (
                <div className="clay-card p-6">
                  <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Upcoming</h2>
                  <div className="space-y-2">
                    {upcomingActivities.slice(0, 5).map(act => (
                      <ActivityRow key={act.id} act={act} onToggle={toggleComplete} onDelete={deleteActivity} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Filtered */}
          {filterType !== 'all' && (
            <div className="clay-card p-6">
              <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4 capitalize">
                {typeEmoji[filterType]} {filterType.replace('_', ' ')} activities
              </h2>
              {filtered.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-4">No {filterType} activities</p>
              ) : (
                <div className="space-y-2">
                  {filtered.map(act => (
                    <ActivityRow key={act.id} act={act} onToggle={toggleComplete} onDelete={deleteActivity} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="clay-card p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-heading font-bold text-stone-800 mb-6">Add Activity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Morning walk" className="clay-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITY_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setForm({...form, activity_type: t.value})}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${form.activity_type === t.value ? 'border-brand-500 bg-brand-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                      <div className="text-2xl">{t.emoji}</div>
                      <div className="text-xs font-semibold text-stone-700 mt-1">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              {pets.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Pet</label>
                  <select value={form.pet_id} onChange={e => setForm({...form, pet_id: e.target.value})} className="clay-input">
                    <option value="">All pets</option>
                    {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Scheduled Time</label>
                <input type="datetime-local" value={form.scheduled_for} onChange={e => setForm({...form, scheduled_for: e.target.value})} className="clay-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Duration (minutes)</label>
                <input type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} placeholder="30" className="clay-input" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="recurring" checked={form.is_recurring} onChange={e => setForm({...form, is_recurring: e.target.checked})}
                  className="w-5 h-5 rounded text-brand-500" />
                <label htmlFor="recurring" className="text-sm font-semibold text-stone-700">Recurring activity</label>
              </div>
              {form.is_recurring && (
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Repeat</label>
                  <select value={form.recurrence_pattern} onChange={e => setForm({...form, recurrence_pattern: e.target.value})} className="clay-input">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="clay-input resize-none" placeholder="Any notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="clay-btn flex-1 py-3 bg-stone-100 text-stone-600">Cancel</button>
                <button onClick={addActivity} className="clay-btn flex-1 py-3 bg-brand-500 text-white hover:bg-brand-600">Add Activity</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityRow({ act, onToggle, onDelete }: { act: Activity; onToggle: (a: Activity) => void; onDelete: (id: string) => void }) {
  const style = typeStyle[act.activity_type] || typeStyle.custom
  const emoji = typeEmoji[act.activity_type] || '⭐'
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${act.completed ? 'opacity-60 bg-stone-50 border-stone-100' : 'bg-white border-orange-100 hover:border-orange-200'}`}>
      <button onClick={() => onToggle(act)}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${act.completed ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-green-400'}`}>
        {act.completed && <Check size={16} />}
      </button>
      <span className="text-xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${act.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>{act.title}</p>
        <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
          {act.scheduled_for && <span>{format(new Date(act.scheduled_for), 'h:mm a')}</span>}
          {act.duration_minutes && <span>{act.duration_minutes}min</span>}
          {act.is_recurring && <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">↻ {act.recurrence_pattern}</span>}
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-lg border font-semibold ${style}`}>{act.activity_type.replace('_', ' ')}</span>
      <button onClick={() => onDelete(act.id)} className="text-stone-300 hover:text-red-500">
        <Trash2 size={16} />
      </button>
    </div>
  )
}
