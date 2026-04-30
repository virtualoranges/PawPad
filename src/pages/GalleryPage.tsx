import { useEffect, useState, useRef } from 'react'
import { Upload, X, Camera } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface Photo {
  id: string
  photo_url: string
  caption?: string
  pet_id?: string
  created_at: string
  pets?: { name: string }
}

export default function GalleryPage() {
  const { user, pets } = useAuthStore()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [caption, setCaption] = useState('')
  const [petId, setPetId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('photos')
      .select('*, pets(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPhotos((data as unknown as Photo[]) ?? [])
        setLoading(false)
      })
  }, [user])

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(fileName)
      const photoUrl = urlData.publicUrl

      const { data, error } = await supabase.from('photos').insert({
        user_id: user.id,
        photo_url: photoUrl,
        caption: caption || null,
        pet_id: petId || null,
      }).select('*, pets(name)').single()

      if (error) throw error
      setPhotos([data as unknown as Photo, ...photos])
      setCaption('')
      setPetId('')
      toast.success('Photo uploaded! 📸')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const deletePhoto = async (photo: Photo) => {
    if (!confirm('Delete this photo?')) return
    const fileName = photo.photo_url.split('pet-photos/')[1]
    if (fileName) await supabase.storage.from('pet-photos').remove([fileName])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(photos.filter(p => p.id !== photo.id))
    if (selectedPhoto?.id === photo.id) setSelectedPhoto(null)
    toast.success('Photo deleted')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">My Pics 📸</h1>
        <p className="text-stone-500 mt-1">Your precious pet memories</p>
      </div>

      {/* Upload area */}
      <div className="clay-card p-6 mb-6">
        <h2 className="text-lg font-heading font-semibold text-stone-800 mb-4">Upload a Photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="A cute moment..." className="clay-input" />
          </div>
          {pets.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Tag a Pet</label>
              <select value={petId} onChange={e => setPetId(e.target.value)} className="clay-input">
                <option value="">No pet tagged</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadPhoto} className="hidden" id="photo-upload" />
            <label htmlFor="photo-upload">
              <div className={`clay-btn flex items-center justify-center gap-2 py-3 px-6 text-white text-sm cursor-pointer ${uploading ? 'bg-stone-400' : 'bg-brand-500 hover:bg-brand-600'}`}>
                {uploading ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Uploading...</>
                ) : (
                  <><Upload size={18} /> Upload Photo</>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading photos...</div>
      ) : photos.length === 0 ? (
        <div className="clay-card p-16 text-center">
          <Camera className="mx-auto text-stone-300 mb-4" size={48} />
          <h2 className="text-xl font-heading text-stone-600 mb-2">No photos yet</h2>
          <p className="text-stone-400 font-body">Upload your first pet photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} onClick={() => setSelectedPhoto(photo)}
              className="clay-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="aspect-square overflow-hidden bg-orange-50">
                <img src={photo.photo_url} alt={photo.caption || 'Pet photo'} loading="lazy"
                  className="w-full h-full object-cover" />
              </div>
              {(photo.caption || photo.pets?.name) && (
                <div className="p-2">
                  {photo.pets?.name && (
                    <span className="text-xs bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full font-semibold">
                      {photo.pets.name}
                    </span>
                  )}
                  {photo.caption && <p className="text-xs text-stone-600 mt-1 truncate">{photo.caption}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedPhoto(null)} className="absolute -top-12 right-0 text-white hover:text-stone-300">
              <X size={28} />
            </button>
            <div className="clay-card overflow-hidden">
              <img src={selectedPhoto.photo_url} alt={selectedPhoto.caption || ''} className="w-full max-h-[70vh] object-contain" />
              <div className="p-4 flex items-center justify-between">
                <div>
                  {selectedPhoto.pets?.name && (
                    <span className="text-sm bg-brand-100 text-brand-600 px-3 py-1 rounded-full font-semibold mr-2">
                      🐾 {selectedPhoto.pets.name}
                    </span>
                  )}
                  {selectedPhoto.caption && <p className="text-stone-700 mt-2 font-body">{selectedPhoto.caption}</p>}
                  <p className="text-xs text-stone-400 mt-1">{format(new Date(selectedPhoto.created_at), 'MMMM d, yyyy')}</p>
                </div>
                <button onClick={() => deletePhoto(selectedPhoto)} className="text-red-400 hover:text-red-600 p-2">
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
