import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Tag, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface TagInfo {
  id: string
  tag_code: string
  pet_id?: string
  user_id?: string
  claimed_at?: string
}

export default function ClaimTagPage() {
  const { tagCode } = useParams<{ tagCode: string }>()
  const navigate = useNavigate()
  const { user, pets } = useAuthStore()
  const [tagInfo, setTagInfo] = useState<TagInfo | null>(null)
  const [selectedPetId, setSelectedPetId] = useState('')
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/claim/${tagCode}`)
      return
    }
    async function load() {
      const { data, error } = await supabase
        .from('qr_tags')
        .select('*')
        .eq('tag_code', tagCode?.toUpperCase() || '')
        .single()
      if (error || !data) {
        toast.error('Tag not found')
        navigate('/profile')
        return
      }
      setTagInfo(data)
      setLoading(false)
    }
    load()
  }, [user, tagCode])

  const claimTag = async () => {
    if (!user || !tagInfo || !selectedPetId) {
      toast.error('Please select a pet to link')
      return
    }

    setClaiming(true)
    try {
      const { error } = await supabase
        .from('qr_tags')
        .update({
          user_id: user.id,
          pet_id: selectedPetId,
          claimed_at: new Date().toISOString(),
          is_active: true,
        })
        .eq('id', tagInfo.id)

      if (error) throw error

      // Send Telegram notification if user has telegram_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', user.id)
        .single()

      if (profile?.telegram_id) {
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
        if (botToken) {
          const pet = pets.find(p => p.id === selectedPetId)
          const telegramId = profile.telegram_id.replace('@', '')
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramId,
              text: `✅ Tag Claimed!\n\nYou've successfully linked PAWPAD tag ${tagInfo.tag_code} to ${pet?.name || 'your pet'}.\n\nAnyone who scans this tag will see your contact info to reunite you with your pet! 🐾`,
            }),
          }).catch(() => {})
        }
      }

      setClaimed(true)
      toast.success(`Tag ${tagInfo.tag_code} claimed successfully! 🎉`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to claim tag')
    }
    setClaiming(false)
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🏷️</div>
          <p className="text-stone-500">Loading tag info...</p>
        </div>
      </div>
    )
  }

  if (claimed) {
    const pet = pets.find(p => p.id === selectedPetId)
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="clay-card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-stone-800 mb-2">Tag Claimed! 🎉</h1>
          <p className="text-stone-500 mb-2">
            Tag <span className="font-mono font-bold text-brand-500">{tagInfo?.tag_code}</span> is now linked to{' '}
            <span className="font-bold">{pet?.name}</span>
          </p>
          <p className="text-stone-400 text-sm mb-6">
            Anyone who scans this tag will see your contact info to help reunite you with your pet.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/profile">
              <button className="clay-btn px-5 py-2 bg-stone-100 text-stone-600 hover:bg-stone-200">View Tags</button>
            </Link>
            <Link to="/dashboard">
              <button className="clay-btn px-5 py-2 bg-brand-500 text-white hover:bg-brand-600">Dashboard</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const alreadyClaimed = tagInfo?.user_id && tagInfo.user_id !== user.id
  const ownedByMe = tagInfo?.user_id === user.id

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">Claim QR Tag</h1>
        <p className="text-stone-500 mt-1">Link this tag to your pet</p>
      </div>

      <div className="clay-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center">
            <Tag className="text-brand-500" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-stone-800 font-mono">{tagInfo?.tag_code}</h2>
            <p className="text-stone-400 text-sm">
              {ownedByMe ? 'Already owned by you' : alreadyClaimed ? 'Already claimed' : 'Available to claim'}
            </p>
          </div>
        </div>

        {alreadyClaimed && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 font-semibold text-sm">
              This tag has already been claimed by another user. If you believe this is an error, please contact support.
            </p>
          </div>
        )}

        {!alreadyClaimed && (
          <>
            {pets.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-stone-500 mb-4">You need to add a pet first before claiming a tag.</p>
                <Link to="/pets">
                  <button className="clay-btn px-5 py-2 bg-brand-500 text-white hover:bg-brand-600">Add a Pet</button>
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Select Pet to Link *</label>
                  <select value={selectedPetId} onChange={e => setSelectedPetId(e.target.value)} className="clay-input">
                    <option value="">Choose a pet...</option>
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.species === 'dog' ? '🐕' : '🐈'} {p.name} {p.breed ? `(${p.breed})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={claimTag}
                  disabled={claiming || !selectedPetId}
                  className="clay-btn w-full py-3 bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60"
                >
                  {claiming ? 'Claiming...' : `Claim Tag ${tagInfo?.tag_code} 🐾`}
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div className="clay-card p-4 bg-blue-50 border-blue-200">
        <h3 className="font-heading font-semibold text-blue-800 mb-2">How it works</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Link this tag to your pet</li>
          <li>• Attach the physical tag to your pet's collar</li>
          <li>• If your pet gets lost, anyone who scans the tag will see your contact info</li>
          <li>• You'll get a Telegram notification when the tag is scanned</li>
        </ul>
      </div>
    </div>
  )
}
