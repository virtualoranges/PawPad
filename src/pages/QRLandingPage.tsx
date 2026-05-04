import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
  notes?: string
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
      // Never request claim_code in this query
      const { data: tag, error } = await supabase
        .from('qr_tags')
        .select('id, tag_code, pet_id, user_id, claimed_at, pets(*, profiles(*), vet_info(*), emergency_contacts(*))')
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

    // Try to get GPS location
    let locationText = '\n📍 Location: finder did not share location'
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true })
      )
      const { latitude, longitude } = pos.coords
      const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`
      locationText = `\n📍 Finder's GPS location:\n${mapLink}`
    } catch {
      // location denied or unavailable — continue without it
    }

    try {
      const telegramId = petData.profiles.telegram_id.replace('@', '')
      const ownerAddress = [petData.profiles.address, petData.profiles.city, petData.profiles.state].filter(Boolean).join(', ')
      const message =
        `🚨 YOUR PET WAS FOUND!\n\n` +
        `🏷️ Tag: ${tagCode}\n` +
        `🐾 Pet: ${petData.name}${petData.species ? ` (${petData.species})` : ''}` +
        locationText +
        `\n\nSomeone scanned your pet's QR tag — contact them immediately!` +
        (ownerAddress ? `\n\n🏠 Your registered address: ${ownerAddress}` : '')

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramId, text: message }),
      })
      if (res.ok) {
        setNotified(true)
        toast.success('Owner notified via Telegram! 🐾')
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

  // ── UNCLAIMED TAG ─────────────────────────────────────────────────────────
  if (!claimed || !petData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #eff6ff 100%)' }}>
        <div className="max-w-sm w-full">

          {/* Brand header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🐾</div>
            <h1 className="text-3xl font-heading font-bold text-stone-800 leading-tight">
              Activate Your<br />PAWPAD Tag
            </h1>
          </div>

          {/* Tag badge */}
          <div className="clay-card p-6 mb-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5 text-center">
              <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-1">Tag ID</p>
              <p className="text-orange-800 font-mono font-bold text-xl">{tagCode?.toUpperCase()}</p>
            </div>

            <p className="text-stone-600 text-center text-sm leading-relaxed mb-5">
              You've purchased this PAWPAD smart pet tag. Activate it to protect your pet — if they ever get lost, anyone who scans this tag can reach you instantly.
            </p>

            <Link to={`/claim/${tagCode}`}>
              <button className="clay-btn w-full py-4 bg-brand-500 text-white text-lg font-heading font-bold hover:bg-brand-600">
                Activate My Tag →
              </button>
            </Link>

            <p className="text-center text-xs text-stone-400 mt-3">
              You'll need to sign in or create a free account
            </p>
          </div>

          {/* Benefits */}
          <div className="clay-card p-4 bg-blue-50 border-blue-100">
            <p className="font-heading font-semibold text-blue-800 text-sm mb-2">After activation:</p>
            <ul className="text-xs text-blue-700 space-y-1.5">
              <li>✓ Your pet's photo & info shown when tag is scanned</li>
              <li>✓ Finder sees your phone number to call you</li>
              <li>✓ You get an instant Telegram message when scanned</li>
              <li>✓ Message includes the finder's GPS location</li>
            </ul>
          </div>

          <p className="text-center text-xs text-stone-400 mt-5">
            Powered by PAWPAD · Smart Pet ID Tags
          </p>
        </div>
      </div>
    )
  }

  // ── CLAIMED TAG — FINDER VIEW ─────────────────────────────────────────────
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
          {petData.notes && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Owner's notes</p>
              <p className="text-sm text-stone-600">{petData.notes}</p>
            </div>
          )}
        </div>

        {/* BIG Telegram Button — most important action */}
        {profile?.telegram_id && (
          <div className="clay-card p-5">
            <button
              onClick={notifyOwner}
              disabled={notifying || notified}
              className={`clay-btn w-full py-5 flex items-center justify-center gap-3 text-white font-heading font-bold rounded-2xl transition-all disabled:opacity-60 ${notified ? 'bg-green-500 hover:bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              style={{ fontSize: '1.15rem' }}
            >
              <Send size={26} />
              {notified
                ? '✅ Owner Notified!'
                : notifying
                  ? 'Sending message...'
                  : 'SEND MESSAGE TO OWNER'}
            </button>
            {!notified && !notifying && (
              <p className="text-center text-stone-400 text-xs mt-2">
                Sends an instant Telegram DM with your GPS location
              </p>
            )}
            {notified && (
              <p className="text-center text-green-600 text-xs mt-2 font-semibold">
                The owner has been notified and is on their way!
              </p>
            )}
          </div>
        )}

        {/* Contact Owner */}
        {profile && (
          <div className="clay-card p-6">
            <h2 className="text-xl font-heading font-bold text-stone-800 mb-4">
              📞 Contact Owner
            </h2>
            <p className="font-semibold text-stone-700 mb-3">{profile.full_name || 'Pet Owner'}</p>
            {profile.phone && (
              <a href={`tel:${profile.phone}`}
                className="clay-btn block w-full py-4 bg-green-500 text-white text-center text-xl font-heading font-bold hover:bg-green-600 mb-3">
                📞 Call {profile.phone}
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
