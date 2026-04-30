import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  telegram_id?: string
  created_at?: string
}

export interface Pet {
  id: string
  user_id: string
  name: string
  species: 'dog' | 'cat'
  breed?: string
  birth_date?: string
  weight_kg?: number
  gender?: 'male' | 'female'
  color?: string
  microchip_id?: string
  photo_url?: string
  notes?: string
  is_primary?: boolean
  created_at?: string
}

interface AuthStore {
  user: User | null
  profile: Profile | null
  pets: Pet[]
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setPets: (pets: Pet[]) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  pets: [],
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setPets: (pets) => set({ pets }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, profile: null, pets: [] }),
}))
