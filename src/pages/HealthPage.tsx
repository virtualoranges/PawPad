import { useEffect, useState } from 'react'
import { Plus, Trash2, Phone, MapPin } from 'lucide-react'
import { format, addDays, isAfter, isBefore } from 'date-fns'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface Vaccination { id: string; vaccine_name: string; next_due_date?: string; pet_id: string; pets?: { name: string } }
interface Medication { id: string; name: string; dosage?: string; frequency?: string; is_active: boolean; pets?: { name: string }; pet_id: string }
interface EmergencyContact { id: string; name: string; relationship?: string; phone: string; email?: string }

export default function HealthPage() {
  const { user, pets } = useAuthStore()
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddContact, setShowAddContact] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', relationship: '', phone: '', email: '' })

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('vaccinations').select('*, pets(name)').order('next_due_date'),
      supabase.from('medications').select('*, pets(name)').eq('is_active', true),
      supabase.from('emergency_contacts').select('*').eq('user_id', user.id).order('created_at'),
    ]).then(([vacs, meds, contacts]) => {
      setVaccinations((vacs.data as unknown as Vaccination[]) ?? [])
      setMedications((meds.data as unknown as Medication[]) ?? [])
      setEmergencyContacts(contacts.data ?? [])
      setLoading(false)
    })
  }, [user])

  const addContact = async () => {
    if (!user || !contactForm.name || !contactForm.phone) return
    try {
      const { data, error } = await supabase.from('emergency_contacts').insert({
        user_id: user.id,
        ...contactForm,
      }).select().single()
      if (error) throw error
      setEmergencyContacts([...emergencyContacts, data])
      setContactForm({ name: '', relationship: '', phone: '', email: '' })
      setShowAddContact(false)
      toast.success('Contact added!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add contact')
    }
  }

  const deleteContact = async (id: string) => {
    await supabase.from('emergency_contacts').delete().eq('id', id)
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id))
    toast.success('Contact removed')
  }

  const today = new Date()
  const in30Days = addDays(today, 30)

  const upcomingVacs = vaccinations.filter(v => {
    if (!v.next_due_date) return false
    const d = new Date(v.next_due_date)
    return isAfter(d, today) && isBefore(d, in30Days)
  })
  const overdueVacs = vaccinations.filter(v => {
    if (!v.next_due_date) return false
    return isBefore(new Date(v.next_due_date), today)
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">Health Tracker</h1>
        <p className="text-stone-500 mt-1">Keep your pets healthy and up to date</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading health data...</div>
      ) : (
        <div className="space-y-6">
          {/* Overdue vaccinations */}
          {overdueVacs.length > 0 && (
            <div className="clay-card p-6 border-red-200 bg-red-50">
              <h2 className="text-xl font-heading font-semibold text-red-700 mb-4">⚠️ Overdue Vaccinations</h2>
              <div className="space-y-3">
                {overdueVacs.map(vac => (
                  <div key={vac.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-200">
                    <span className="text-xl">💉</span>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{vac.vaccine_name}</p>
                      <p className="text-sm text-stone-500">{vac.pets?.name} · Was due {format(new Date(vac.next_due_date!), 'MMM d, yyyy')}</p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg font-semibold">OVERDUE</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming vaccinations */}
          <div className="clay-card p-6">
            <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">
              Upcoming Vaccinations
              <span className="ml-2 text-sm text-stone-400 font-body font-normal">next 30 days</span>
            </h2>
            {upcomingVacs.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">No upcoming vaccinations in the next 30 days</p>
            ) : (
              <div className="space-y-3">
                {upcomingVacs.map(vac => {
                  const daysUntil = Math.ceil((new Date(vac.next_due_date!).getTime() - Date.now()) / 86400000)
                  const isUrgent = daysUntil <= 7
                  return (
                    <div key={vac.id} className={`flex items-center gap-3 p-3 rounded-xl border ${isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-100'}`}>
                      <span className="text-xl">💉</span>
                      <div className="flex-1">
                        <p className="font-semibold text-stone-800">{vac.vaccine_name}</p>
                        <p className="text-sm text-stone-500">{vac.pets?.name} · {format(new Date(vac.next_due_date!), 'MMM d, yyyy')}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${isUrgent ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {daysUntil} days
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Medications */}
          <div className="clay-card p-6">
            <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Active Medications</h2>
            {medications.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">No active medications</p>
            ) : (
              <div className="space-y-3">
                {medications.map(med => (
                  <div key={med.id} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-xl">💊</span>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{med.name}</p>
                      <p className="text-sm text-stone-500">
                        {med.pets?.name}
                        {med.dosage && ` · ${med.dosage}`}
                        {med.frequency && ` · ${med.frequency}`}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold">ACTIVE</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-stone-800">Emergency Contacts</h2>
              <button onClick={() => setShowAddContact(!showAddContact)} className="clay-btn flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm hover:bg-red-600">
                <Plus size={16} /> Add
              </button>
            </div>

            {showAddContact && (
              <div className="mb-4 p-4 bg-red-50 rounded-xl border-2 border-red-100">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    placeholder="Contact name *" className="clay-input" />
                  <input value={contactForm.relationship} onChange={e => setContactForm({...contactForm, relationship: e.target.value})}
                    placeholder="Relationship" className="clay-input" />
                  <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                    placeholder="Phone *" className="clay-input" />
                  <input value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="Email" type="email" className="clay-input" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddContact(false)} className="clay-btn px-4 py-2 bg-stone-100 text-stone-600 text-sm">Cancel</button>
                  <button onClick={addContact} className="clay-btn px-4 py-2 bg-red-500 text-white text-sm hover:bg-red-600">Save Contact</button>
                </div>
              </div>
            )}

            {emergencyContacts.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">No emergency contacts added</p>
            ) : (
              <div className="space-y-3">
                {emergencyContacts.map(c => (
                  <div key={c.id} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                    <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center text-lg font-heading font-bold text-red-600">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{c.name}</p>
                      {c.relationship && <p className="text-xs text-stone-400 mb-1">{c.relationship}</p>}
                      <a href={`tel:${c.phone}`} className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                        <Phone size={14} />{c.phone}
                      </a>
                    </div>
                    <button onClick={() => deleteContact(c.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
