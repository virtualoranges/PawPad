import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { breeds, type Breed } from '@/lib/breeds'

function LevelDots({ level, max = 3 }: { level: 'low' | 'easy' | 'moderate' | 'high', max?: number }) {
  const val = (level === 'low' || level === 'easy') ? 1 : level === 'moderate' ? 2 : 3
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < val ? 'bg-brand-500' : 'bg-stone-200'}`} />
      ))}
    </div>
  )
}

function BreedCard({ breed, onClick }: { breed: Breed; onClick: () => void }) {
  const sizeColors: Record<string, string> = {
    small: 'bg-blue-100 text-blue-700',
    medium: 'bg-green-100 text-green-700',
    large: 'bg-purple-100 text-purple-700',
  }

  return (
    <div onClick={onClick} className="clay-card p-5 cursor-pointer hover:scale-[1.02] transition-transform">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-3xl flex-shrink-0">
          {breed.image_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-stone-800 leading-tight">{breed.name}</h3>
          <p className="text-xs text-stone-400 mt-0.5">{breed.origin}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${sizeColors[breed.size]}`}>
            {breed.size}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {breed.temperament.slice(0, 3).map(t => (
          <span key={t} className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
            {t}
          </span>
        ))}
      </div>
      <p className="text-xs text-stone-400 mt-2">Lifespan: {breed.lifespan}</p>
    </div>
  )
}

function BreedModal({ breed, onClose }: { breed: Breed; onClose: () => void }) {
  const sizeColors: Record<string, string> = {
    small: 'bg-blue-100 text-blue-700',
    medium: 'bg-green-100 text-green-700',
    large: 'bg-purple-100 text-purple-700',
  }
  const careLabelMap: Record<string, string> = { easy: 'Easy', moderate: 'Moderate', high: 'High' }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="clay-card w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-4xl">
              {breed.image_emoji}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-stone-800">{breed.name}</h2>
              <p className="text-stone-400">{breed.origin} · {breed.lifespan}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={24} /></button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <p className="text-stone-600 font-body leading-relaxed">{breed.description}</p>

          <div className="flex flex-wrap gap-2">
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${sizeColors[breed.size]}`}>{breed.size}</span>
            <span className="text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-semibold capitalize">
              {breed.species === 'dog' ? '🐕 Dog' : '🐈 Cat'}
            </span>
          </div>

          {/* Temperament */}
          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">Temperament</p>
            <div className="flex flex-wrap gap-2">
              {breed.temperament.map(t => (
                <span key={t} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
              <p className="text-xs text-stone-500 mb-1">Care Level</p>
              <div className="flex items-center gap-2">
                <LevelDots level={breed.care_level} />
                <span className="text-sm font-semibold text-stone-700">{careLabelMap[breed.care_level]}</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
              <p className="text-xs text-stone-500 mb-1">Exercise Needs</p>
              <div className="flex items-center gap-2">
                <LevelDots level={breed.exercise_needs} />
                <span className="text-sm font-semibold text-stone-700">{careLabelMap[breed.exercise_needs]}</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
              <p className="text-xs text-stone-500 mb-1">Shedding</p>
              <div className="flex items-center gap-2">
                <LevelDots level={breed.shedding} />
                <span className="text-sm font-semibold text-stone-700">{careLabelMap[breed.shedding]}</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
              <p className="text-xs text-stone-500 mb-2">Compatibility</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span>{breed.good_with_kids ? '✅' : '❌'}</span>
                  <span className="text-stone-600">Good with kids</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>{breed.good_with_pets ? '✅' : '❌'}</span>
                  <span className="text-stone-600">Good with pets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BreedsPage() {
  const [filter, setFilter] = useState<'all' | 'dog' | 'cat'>('all')
  const [search, setSearch] = useState('')
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null)

  const filtered = breeds.filter(b => {
    const matchSpecies = filter === 'all' || b.species === filter
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.origin.toLowerCase().includes(search.toLowerCase()) ||
      b.temperament.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchSpecies && matchSearch
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">Breed Explorer</h1>
        <p className="text-stone-500 mt-1">{breeds.length} breeds · dogs & cats</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'dog', 'cat'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`clay-btn px-5 py-2 capitalize text-sm ${filter === f ? 'bg-brand-500 text-white' : 'bg-white text-stone-600 hover:bg-orange-50'}`}>
              {f === 'all' ? 'All' : f === 'dog' ? '🐕 Dogs' : '🐈 Cats'}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search breeds, temperament..."
            className="clay-input pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(breed => (
          <BreedCard key={breed.id} breed={breed} onClick={() => setSelectedBreed(breed)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-stone-400 font-body">No breeds found matching "{search}"</p>
        </div>
      )}

      {selectedBreed && (
        <BreedModal breed={selectedBreed} onClose={() => setSelectedBreed(null)} />
      )}
    </div>
  )
}
