import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInYears, differenceInMonths } from 'date-fns'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  species: z.enum(['dog', 'cat']),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', '']).optional(),
  color: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function calcAge(birthDate?: string) {
  if (!birthDate) return null
  const bd = new Date(birthDate)
  const years = differenceInYears(new Date(), bd)
  if (years > 0) return `${years} yr${years > 1 ? 's' : ''}`
  const months = differenceInMonths(new Date(), bd)
  return `${months} mo`
}

export default function PetsPage() {
  const { pets, setPets, user } = useAuthStore()
  const [showModal, setShowModal] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { species: 'dog' },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return
    setUploadingPhoto(true)
    try {
      let photoUrl: string | null = null

      if (photoFile) {
        const ext = photoFile.name.split('.').pop() || 'jpg'
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(path, photoFile, { upsert: true })
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('pet-photos')
            .getPublicUrl(path)
          photoUrl = publicUrl
        }
      }

      const { data: newPet, error } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name: data.name,
          species: data.species,
          breed: data.breed || null,
          birth_date: data.birth_date || null,
          gender: data.gender || null,
          color: data.color || null,
          photo_url: photoUrl,
        })
        .select()
        .single()
      if (error) throw error
      setPets([...pets, newPet])
      toast.success(`${data.name} added! 🐾`)
      reset()
      setShowModal(false)
      setPhotoFile(null)
      setPhotoPreview(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add pet')
    }
    setUploadingPhoto(false)
  }

  const closeModal = () => {
    setShowModal(false)
    reset()
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">My Pets</h1>
          <p className="text-stone-500 font-body mt-1">{pets.length} pet{pets.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="clay-btn flex items-center gap-2 px-5 py-3 bg-brand-500 text-white hover:bg-brand-600"
        >
          <Plus size={20} />
          Add Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="clay-card p-16 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-heading text-stone-700 mb-2">No pets yet</h2>
          <p className="text-stone-400 font-body mb-6">Add your first furry friend to get started!</p>
          <button onClick={() => setShowModal(true)} className="clay-btn px-6 py-3 bg-brand-500 text-white hover:bg-brand-600">
            Add My First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <Link key={pet.id} to={`/pets/${pet.id}`}>
              <div className="clay-card p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
                    {pet.photo_url ? (
                      <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      pet.species === 'dog' ? '🐕' : '🐈'
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-stone-800">{pet.name}</h3>
                    <p className="text-stone-500 text-sm font-body capitalize">{pet.species}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {pet.breed && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Breed</span>
                      <span className="font-semibold text-stone-700">{pet.breed}</span>
                    </div>
                  )}
                  {pet.birth_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Age</span>
                      <span className="font-semibold text-stone-700">{calcAge(pet.birth_date)}</span>
                    </div>
                  )}
                  {pet.gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Gender</span>
                      <span className="font-semibold text-stone-700 capitalize">{pet.gender}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-orange-100">
                  <span className="text-brand-500 text-sm font-semibold">View Profile →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="clay-card p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-heading font-bold text-stone-800 mb-6">Add New Pet</h2>

            {/* Photo Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div
                className="w-28 h-28 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-orange-400 transition-colors"
                onClick={() => photoInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <Camera size={28} className="text-orange-300 mx-auto mb-1" />
                    <span className="text-xs text-orange-400 font-medium">Add Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                  <Camera size={22} className="text-white" />
                </div>
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <p className="text-xs text-stone-400 mt-2">Click to add a pet photo (optional)</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Pet Name *</label>
                <input {...register('name')} placeholder="Buddy" className="clay-input" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Species *</label>
                <select {...register('species')} className="clay-input">
                  <option value="dog">Dog 🐕</option>
                  <option value="cat">Cat 🐈</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Breed</label>
                <input {...register('breed')} placeholder="Golden Retriever" className="clay-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Color</label>
                <input {...register('color')} placeholder="Golden, Brown, etc." className="clay-input" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="clay-btn flex-1 py-3 bg-stone-100 text-stone-600 hover:bg-stone-200">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || uploadingPhoto}
                  className="clay-btn flex-1 py-3 bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                  {isSubmitting || uploadingPhoto ? 'Adding...' : 'Add Pet 🐾'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
