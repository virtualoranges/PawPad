import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { QRCodeSVG } from 'qrcode.react'
import { Camera, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Profile } from '@/store/authStore'

const schema = z.object({
  full_name: z.string().min(1, 'Name required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  telegram_id: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const { user, profile, setProfile, pets } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [qrTags, setQrTags] = useState<{ id: string; tag_code: string; pet_id?: string }[]>([])
  const [tagsLoaded, setTagsLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      zip: profile?.zip || '',
      telegram_id: profile?.telegram_id || '',
    },
  })

  const loadQrTags = async () => {
    if (!user || tagsLoaded) return
    const { data } = await supabase.from('qr_tags').select('id, tag_code, pet_id').eq('user_id', user.id)
    setQrTags(data ?? [])
    setTagsLoaded(true)
  }

  const saveProfile = async (data: FormData) => {
    if (!user) return
    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, email: user.email, ...data })
        .select()
        .single()
      if (error) throw error
      setProfile(updated as Profile)
      toast.success('Profile saved!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `avatars/${user.id}.${ext}`
      const { error } = await supabase.storage.from('pet-photos').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(fileName)
      const avatarUrl = urlData.publicUrl
      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id)
      setProfile({ ...profile!, avatar_url: avatarUrl })
      toast.success('Avatar updated!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
    setUploading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">My Profile</h1>
        <p className="text-stone-500 mt-1">Manage your account details</p>
      </div>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="clay-card p-6">
          <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-brand-100 border-2 border-brand-200 overflow-hidden flex items-center justify-center text-4xl font-heading font-bold text-brand-600">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  (profile?.full_name?.charAt(0) || '?').toUpperCase()
                )}
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-500 rounded-full text-white flex items-center justify-center shadow-clay-sm">
                <Camera size={14} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </div>
            <div>
              <p className="font-semibold text-stone-800">{profile?.full_name || 'Pet Parent'}</p>
              <p className="text-sm text-stone-400">{user?.email}</p>
              {uploading && <p className="text-xs text-brand-500 mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        {/* Info form */}
        <div className="clay-card p-6">
          <h2 className="text-xl font-heading font-semibold text-stone-800 mb-4">Personal Information</h2>
          <form onSubmit={handleSubmit(saveProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name *</label>
              <input {...register('full_name')} className="clay-input" placeholder="Jane Smith" />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Phone</label>
              <input {...register('phone')} type="tel" className="clay-input" placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Telegram ID
                <span className="text-xs text-stone-400 font-normal ml-2">For pet tag alerts</span>
              </label>
              <input {...register('telegram_id')} className="clay-input" placeholder="@username" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Address</label>
              <input {...register('address')} className="clay-input" placeholder="123 Main St" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">City</label>
              <input {...register('city')} className="clay-input" placeholder="New York" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">State</label>
                <input {...register('state')} className="clay-input" placeholder="NY" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">ZIP</label>
                <input {...register('zip')} className="clay-input" placeholder="10001" />
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={isSubmitting}
                className="clay-btn px-6 py-3 bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* QR Tags */}
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-stone-800">My QR Tags</h2>
            <button onClick={loadQrTags} className="clay-btn flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm hover:bg-blue-600">
              <Tag size={16} /> View Tags
            </button>
          </div>
          {!tagsLoaded ? (
            <p className="text-stone-400 text-sm">Click "View Tags" to see your claimed QR tags</p>
          ) : qrTags.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🏷️</div>
              <p className="text-stone-400 font-body text-sm">No QR tags claimed yet.</p>
              <p className="text-stone-400 text-xs mt-1">Scan a PAWPAD tag and claim it to link to your pet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {qrTags.map(tag => {
                const pet = pets.find(p => p.id === tag.pet_id)
                return (
                  <div key={tag.id} className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 text-center">
                    <QRCodeSVG value={`https://pawpad.vercel.app/qr/${tag.tag_code}`} size={100} className="mx-auto" />
                    <p className="font-heading font-semibold text-stone-800 mt-2 text-sm">{tag.tag_code}</p>
                    {pet && (
                      <p className="text-xs text-brand-500 font-semibold">{pet.species === 'dog' ? '🐕' : '🐈'} {pet.name}</p>
                    )}
                    {!pet && <p className="text-xs text-stone-400">Unassigned</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
