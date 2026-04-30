import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Phone, MapPin, AlertTriangle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface PetData {
  id: string
  name: string
  species: 'dog' | 'cat'
  breed?: string
  color?: string
  microchip_id?: string
  photo_url?: string
  profiles?: {
    full_name?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    telegram_id?: string
  }
  vet_info?: { clinic_name?: string; phone?: string; vet_name?: string }[] | null
  emergency_contacts?: { name: string; phone: string; relationship?: string }[] | null
}

export default function QRLandingPage() {
  const { tagCode } = useParams<{ tagCode: string }>()
  const [loading, setLoading] = useState(true)
  const [petData, setPetData] = useState<PetData | null>(null)
  const [claimed, setClaimed] = useState(false)
  const [notifying, setNotifying] = useState(false)
  const [notified, setNotified] = useState(false)

  useEffect(() => {
    async function load() {
      if (!tagCode) return
      const { data: tag, error } = await supabase
        .from('qr_tags')
        .select('*, pets(*, profiles(*), vet_info(*), emergency_contacts(*))')
        .eq('tag_code', tagCode.toUpperCase())
        .single()

      if (error || !tag) {
        setLoading(false)
        return
      }

      if (!tag.pet_id || !tag.user_id) {
        setClaimed(false)
        setLoading(false)
        return
      }

      setClaimed(true)
      setPetData(tag.pets as unknown as PetData)
      setLoading(false)
    }
    load()
  }, [tagCode])

  const notifyOwner = async () => {
    if (!petData?.profiles?.telegram_id || notified) return
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    if (!botToken) {
      toast.error('Notifications not configured')
      return
    }
    setNotifying(true)
    try {
      const telegramId = petData.profiles.telegram_id.replace('@', '')
      const message = `🐾 PET FOUND!\n\nTag ID: ${tagCode}\nPet: ${petData.name}\n\nSomeone scanned your pet's QR tag!\nPlease CONTACT THEM immediately.`
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramId, text: message }),
      })
      if (res.ok) {
        setNotified(true)
        toast.success('Owner has been notified via Telegram!')
      } else {
        toast.error('Could not send notification')
      }
    } catch {
      toast.error('Notification failed')
    }
    setNotifying(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐾</div>
          <p className="text-stone-500">Looking up pet info...</p>
        </div>
      </div>
    )
  }

  if (!claimed || !petData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="clay-card p-8">
            <div className="text-6xl mb-4">🏷️</div>
            <h1 className="text-2xl font-heading font-bold text-stone-700 mb-2">Tag Not Yet Claimed</h1>
            <p className="text-stone-500 font-body mb-4">
              This PAWPAD tag ({tagCode}) hasn't been linked to a pet yet.
            </p>
            <p className="text-stone-400 text-sm">
              If you found this tag, please contact PAWPAD support or check if it was recently purchased.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const profile = petData.profiles
  const vetInfo = (petData.vet_info as { clinic_name?: string; phone?: string; vet_name?: string }[] | null)?.[0]
  const emergencyContacts = petData.emergency_contacts as { name: string; phone: string; relationship?: string }[] | null

  const ownerAddress = [profile?.address, profile?.city, profile?.state].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-md mx-auto py-6 space-y-4">
        {/* FOUND banner */}
        <div className="bg-red-500 text-white rounded-[20px] p-5 text-center shadow-clay">
          <div className="flex items-center justify-center gap-2 text-2xl font-heading font-bold mb-1">
            <AlertTriangle size={28} />
            PET FOUND
          </div>
          <p className="text-red-100 text-sm">Please help reunite this pet with their owner</p>
        </div>

        {/* Pet info card */}
        <div className="clay-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-orange-100 border-2 border-orange-200 overflow-hidden flex items-center justify-center text-5xl flex-shrink-0">
              {petData.photo_url ? (
                <img src={petData.photo_url} alt={petData.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                petData.species === 'dog' ? '🐕' : '🐈'
              )}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-stone-800">{petData.name}</h1>
              <p className="text-stone-500 capitalize">{petData.species}{petData.breed ? ` · ${petData.breed}` : ''}</p>
              {petData.color && <p className="text-stone-400 text-sm">{petData.color}</p>}
            </div>
          </div>
          {petData.microchip_id && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Microchipped</p>
              <p className="text-blue-800 font-mono font-bold">{petData.microchip_id}</p>
            </div>
          )}
        </div>

        {/* Contact Owner */}
        {profile && (
          <div className="clay-card p-6 border-orange-300">
            <h2 className="text-xl font-heading font-bold text-stone-800 mb-4">
              📞 Contact Owner
            </h2>
            <p className="font-semibold text-stone-700 mb-3">{profile.full_name || 'Pet Owner'}</p>
            {profile.phone && (
              <a href={`tel:${profile.phone}`}
                className="clay-btn block w-full py-4 bg-green-500 text-white text-center text-xl font-heading font-bold hover:bg-green-600 mb-3">
                📞 {profile.phone}
              </a>
            )}
            {ownerAddress && (
              <div className="flex items-start gap-2 text-stone-600">
                <MapPin size={18} className="text-stone-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{ownerAddress}</p>
              </div>
            )}
          </div>
        )}

        {/* Notify via Telegram */}
        {profile?.telegram_id && (
          <div className="clay-card p-4">
            <button
              onClick={notifyOwner}
              disabled={notifying || notified}
              className="clay-btn w-full py-3 flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
            >
              <Send size={18} />
              {notified ? '✅ Owner Notified!' : notifying ? 'Sending notification...' : 'Notify Owner via Telegram'}
            </button>
          </div>
        )}

        {/* Emergency contacts */}
        {emergencyContacts && emergencyContacts.length > 0 && (
          <div className="clay-card p-6">
            <h2 className="text-xl font-heading font-bold text-stone-800 mb-4">Emergency Contacts</h2>
            <div className="space-y-3">
              {emergencyContacts.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center text-red-600 font-bold font-heading">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{c.name}</p>
                    {c.relationship && <p className="text-xs text-stone-400">{c.relationship}</p>}
                    <a href={`tel:${c.phone}`} className="text-blue-600 text-sm font-semibold hover:underline">
                      {c.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vet info */}
        {vetInfo && (vetInfo.clinic_name || vetInfo.phone) && (
          <div className="clay-card p-6">
            <h2 className="text-xl font-heading font-bold text-stone-800 mb-3">🏥 Vet Information</h2>
            {vetInfo.clinic_name && <p className="font-semibold text-stone-700">{vetInfo.clinic_name}</p>}
            {vetInfo.vet_name && <p className="text-stone-500 text-sm">Dr. {vetInfo.vet_name}</p>}
            {vetInfo.phone && (
              <a href={`tel:${vetInfo.phone}`} className="text-blue-600 font-semibold mt-2 block hover:underline">
                📞 {vetInfo.phone}
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-stone-400 text-xs pb-4">
          <div className="text-2xl mb-2">🐾</div>
          <p>Powered by PAWPAD · Smart Pet ID Tags</p>
        </div>
      </div>
    </div>
  )
}
