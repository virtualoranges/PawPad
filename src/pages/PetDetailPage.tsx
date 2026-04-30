import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInYears, differenceInMonths, format } from 'date-fns'
import { Trash2, Plus, Edit3, ArrowLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface Medication { id: string; name: string; dosage?: string; frequency?: string; is_active: boolean; notes?: string }
interface Vaccination { id: string; vaccine_name: string; date_given?: string; next_due_date?: string; vet_name?: string; notes?: string }
interface WeightEntry { id: string; weight_kg: number; recorded_at: string; notes?: string }
interface VetInfo { id: string; vet_name?: string; clinic_name?: string; phone?: string; address?: string; email?: string; notes?: string }
interface QRTag { id: string; tag_code: string }

const petSchema = z.object({
  name: z.string().min(1),
  species: z.enum(['dog', 'cat']),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', '']).optional(),
  color: z.string().optional(),
  microchip_id: z.string().optional(),
  weight_kg: z.string().optional(),
  notes: z.string().optional(),
})
type PetForm = z.infer<typeof petSchema>

function calcAge(birthDate?: string) {
  if (!birthDate) return null
  const bd = new Date(birthDate)
  const years = differenceInYears(new Date(), bd)
  if (years > 0) return `${years} year${years > 1 ? 's' : ''}`
  const months = differenceInMonths(new Date(), bd)
  return `${months} months`
}

export default function PetDetailPage() {
  const { petId } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const { pets, setPets, user } = useAuthStore()
  const pet = pets.find(p => p.id === petId)

  const [tab, setTab] = useState<'overview' | 'health' | 'weight' | 'notes'>('overview')
  const [medications, setMedications] = useState<Medication[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([])
  const [vetInfo, setVetInfo] = useState<VetInfo | null>(null)
  const [qrTag, setQrTag] = useState<QRTag | null>(null)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<PetForm>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: pet?.name || '',
      species: pet?.species || 'dog',
      breed: pet?.breed || '',
      birth_date: pet?.birth_date || '',
      gender: (pet?.gender as 'male' | 'female' | '' | undefined) || '',
      color: pet?.color || '',
      microchip_id: pet?.microchip_id || '',
      weight_kg: pet?.weight_kg?.toString() || '',
      notes: pet?.notes || '',
    }
  })

  useEffect(() => {
    if (!petId) return
    Promise.all([
      supabase.from('medications').select('*').eq('pet_id', petId).order('created_at', { ascending: false }),
      supabase.from('vaccinations').select('*').eq('pet_id', petId).order('next_due_date'),
      supabase.from('weight_history').select('*').eq('pet_id', petId).order('recorded_at', { ascending: false }),
      supabase.from('vet_info').select('*').eq('pet_id', petId).single(),
      supabase.from('qr_tags').select('id, tag_code').eq('pet_id', petId).maybeSingle(),
    ]).then(([meds, vacs, weights, vet, qr]) => {
      setMedications(meds.data ?? [])
      setVaccinations(vacs.data ?? [])
      setWeightHistory(weights.data ?? [])
      setVetInfo(vet.data ?? null)
      setQrTag(qr.data ?? null)
      setLoading(false)
    })
  }, [petId])

  const savePet = async (data: PetForm) => {
    if (!petId) return
    try {
      const { data: updated, error } = await supabase
        .from('pets')
        .update({
          name: data.name,
          species: data.species,
          breed: data.breed || null,
          birth_date: data.birth_date || null,
          gender: data.gender || null,
          color: data.color || null,
          microchip_id: data.microchip_id || null,
          weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
          notes: data.notes || null,
        })
        .eq('id', petId)
        .select()
        .single()
      if (error) throw error
      setPets(pets.map(p => p.id === petId ? updated : p))
      toast.success('Pet profile saved!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const addWeight = async () => {
    const kg = prompt('Enter weight in kg:')
    if (!kg || isNaN(parseFloat(kg))) return
    const { data, error } = await supabase.from('weight_history').insert({
      pet_id: petId,
      weight_kg: parseFloat(kg),
      recorded_at: format(new Date(), 'yyyy-MM-dd'),
    }).select().single()
    if (!error && data) {
      setWeightHistory([data, ...weightHistory])
      toast.success('Weight logged!')
    }
  }

  const addVaccination = async () => {
    const name = prompt('Vaccine name:')
    if (!name) return
    const dueDate = prompt('Next due date (YYYY-MM-DD):')
    const { data, error } = await supabase.from('vaccinations').insert({
      pet_id: petId,
      vaccine_name: name,
      next_due_date: dueDate || null,
      date_given: format(new Date(), 'yyyy-MM-dd'),
    }).select().single()
    if (!error && data) {
      setVaccinations([...vaccinations, data])
      toast.success('Vaccination added!')
    }
  }

  const addMedication = async () => {
    const name = prompt('Medication name:')
    if (!name) return
    const dosage = prompt('Dosage (e.g. 10mg):')
    const frequency = prompt('Frequency (e.g. twice daily):')
    const { data, error } = await supabase.from('medications').insert({
      pet_id: petId,
      name,
      dosage: dosage || null,
      frequency: frequency || null,
      is_active: true,
    }).select().single()
    if (!error && data) {
      setMedications([data, ...medications])
      toast.success('Medication added!')
    }
  }

  const deleteMed = async (id: string) => {
    await supabase.from('medications').delete().eq('id', id)
    setMedications(medications.filter(m => m.id !== id))
    toast.success('Medication removed')
  }

  const saveVetInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      pet_id: petId,
      vet_name: fd.get('vet_name') as string,
      clinic_name: fd.get('clinic_name') as string,
      phone: fd.get('phone') as string,
      address: fd.get('address') as string,
      email: fd.get('email') as string,
    }
    if (vetInfo?.id) {
      await supabase.from('vet_info').update(payload).eq('id', vetInfo.id)
    } else {
      const { data } = await supabase.from('vet_info').insert(payload).select().single()
      setVetInfo(data)
    }
    toast.success('Vet info saved!')
  }

  if (!pet) {
    return <div className="p-6 text-center text-stone-500">Pet not found</div>
  }

  const maxWeight = Math.max(...weightHistory.map(w => w.weight_kg), 0)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <button onClick={() => navigate('/pets')} className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 font-body">
        <ArrowLeft size={18} /> Back to Pets
      </button>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-5xl overflow-hidden flex-shrink-0">
          {pet.photo_url ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" loading="lazy" /> : (pet.species === 'dog' ? '🐕' : '🐈')}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">{pet.name}</h1>
          <p className="text-stone-500">{pet.breed || pet.species} {pet.birth_date && `· ${calcAge(pet.birth_date)} old`}</p>
        </div>
        {qrTag && (
          <div className="ml-auto p-3 bg-white rounded-2xl border-2 border-orange-200">
            <QRCodeSVG value={`https://pawpad.vercel.app/qr/${qrTag.tag_code}`} size={80} />
            <p className="text-xs text-center text-stone-400 mt-1">{qrTag.tag_code}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'health', 'weight', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`clay-btn px-5 py-2 capitalize whitespace-nowrap ${tab === t ? 'bg-brand-500 text-white' : 'bg-white text-stone-600 hover:bg-orange-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="clay-card p-6">
          <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Pet Profile</h2>
          <form onSubmit={handleSubmit(savePet)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Name</label>
              <input {...register('name')} className="clay-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Species</label>
              <select {...register('species')} className="clay-input">
                <option value="dog">Dog 🐕</option>
                <option value="cat">Cat 🐈</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Breed</label>
              <input {...register('breed')} className="clay-input" placeholder="Golden Retriever" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Birth Date</label>
              <input {...register('birth_date')} type="date" className="clay-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Gender</label>
              <select {...register('gender')} className="clay-input">
                <option value="">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Color</label>
              <input {...register('color')} className="clay-input" placeholder="Golden brown" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Weight (kg)</label>
              <input {...register('weight_kg')} type="number" step="0.1" className="clay-input" placeholder="5.2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Microchip ID</label>
              <input {...register('microchip_id')} className="clay-input" placeholder="985141001234567" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={isSubmitting} className="clay-btn px-6 py-3 bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Health Tab */}
      {tab === 'health' && (
        <div className="space-y-6">
          {/* Medications */}
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-stone-800">Medications</h2>
              <button onClick={addMedication} className="clay-btn flex items-center gap-1 px-4 py-2 bg-brand-500 text-white text-sm">
                <Plus size={16} /> Add
              </button>
            </div>
            {medications.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">No medications</p>
            ) : (
              <div className="space-y-3">
                {medications.map(med => (
                  <div key={med.id} className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{med.name}</p>
                      {med.dosage && <p className="text-sm text-stone-500">{med.dosage} · {med.frequency}</p>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${med.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                        {med.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button onClick={() => deleteMed(med.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vaccinations */}
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-stone-800">Vaccinations</h2>
              <button onClick={addVaccination} className="clay-btn flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm">
                <Plus size={16} /> Add
              </button>
            </div>
            {vaccinations.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">No vaccinations recorded</p>
            ) : (
              <div className="space-y-2">
                {vaccinations.map(vac => (
                  <div key={vac.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <span className="text-xl">💉</span>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{vac.vaccine_name}</p>
                      {vac.next_due_date && <p className="text-sm text-stone-500">Due: {format(new Date(vac.next_due_date), 'MMM d, yyyy')}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vet Info */}
          <div className="clay-card p-6">
            <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Vet Information</h2>
            <form onSubmit={saveVetInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'vet_name', label: 'Vet Name', placeholder: 'Dr. Smith', defaultVal: vetInfo?.vet_name },
                { name: 'clinic_name', label: 'Clinic', placeholder: 'Happy Paws Clinic', defaultVal: vetInfo?.clinic_name },
                { name: 'phone', label: 'Phone', placeholder: '+1 555 000 0000', defaultVal: vetInfo?.phone },
                { name: 'email', label: 'Email', placeholder: 'vet@clinic.com', defaultVal: vetInfo?.email },
                { name: 'address', label: 'Address', placeholder: '123 Vet St', defaultVal: vetInfo?.address },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">{f.label}</label>
                  <input name={f.name} defaultValue={f.defaultVal || ''} placeholder={f.placeholder} className="clay-input" />
                </div>
              ))}
              <div className="md:col-span-2">
                <button type="submit" className="clay-btn px-6 py-3 bg-blue-500 text-white hover:bg-blue-600">
                  Save Vet Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weight Tab */}
      {tab === 'weight' && (
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-stone-800">Weight History</h2>
            <button onClick={addWeight} className="clay-btn flex items-center gap-1 px-4 py-2 bg-brand-500 text-white text-sm">
              <Plus size={16} /> Log Weight
            </button>
          </div>

          {/* Simple bar chart */}
          {weightHistory.length > 0 && (
            <div className="mb-6">
              <div className="flex items-end gap-2 h-32 border-b-2 border-orange-200 pb-2">
                {weightHistory.slice(0, 10).reverse().map(entry => {
                  const pct = maxWeight > 0 ? (entry.weight_kg / maxWeight) * 100 : 50
                  return (
                    <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-stone-500">{entry.weight_kg}kg</span>
                      <div className="w-full bg-brand-400 rounded-t-lg" style={{ height: `${pct}%` }} />
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-2 mt-1">
                {weightHistory.slice(0, 10).reverse().map(entry => (
                  <div key={entry.id} className="flex-1 text-center">
                    <span className="text-[10px] text-stone-400">{format(new Date(entry.recorded_at), 'M/d')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          {weightHistory.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No weight records yet</p>
          ) : (
            <div className="space-y-2">
              {weightHistory.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="font-semibold text-stone-800">{entry.weight_kg} kg</span>
                  <span className="text-stone-500 text-sm">{format(new Date(entry.recorded_at), 'MMMM d, yyyy')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {tab === 'notes' && (
        <div className="clay-card p-6">
          <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Notes</h2>
          <form onSubmit={handleSubmit(savePet)}>
            <textarea
              {...register('notes')}
              rows={10}
              placeholder="Any special notes about your pet — dietary needs, behavioral quirks, special care instructions..."
              className="clay-input resize-none"
            />
            <button type="submit" className="clay-btn mt-4 px-6 py-3 bg-brand-500 text-white hover:bg-brand-600">
              Save Notes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
