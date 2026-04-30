import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import Layout from '@/components/Layout'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ProfilePage from '@/pages/ProfilePage'
import PetsPage from '@/pages/PetsPage'
import PetDetailPage from '@/pages/PetDetailPage'
import HealthPage from '@/pages/HealthPage'
import ActivitiesPage from '@/pages/ActivitiesPage'
import GalleryPage from '@/pages/GalleryPage'
import CommunityPage from '@/pages/CommunityPage'
import BreedsPage from '@/pages/BreedsPage'
import QRLandingPage from '@/pages/QRLandingPage'
import ClaimTagPage from '@/pages/ClaimTagPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-stone-500 font-body">Loading PAWPAD...</p>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  const { setUser, setProfile, setPets, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(profile)

          const { data: pets } = await supabase
            .from('pets')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: true })
          setPets(pets ?? [])
        } catch (_) {}
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(profile)

          const { data: pets } = await supabase
            .from('pets')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: true })
          setPets(pets ?? [])
        } catch (_) {}
      } else {
        setProfile(null)
        setPets([])
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setPets, setLoading])

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#fff',
          border: '2px solid #fed7aa',
          borderRadius: '16px',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 600,
        }
      }} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/qr/:tagCode" element={<QRLandingPage />} />

        {/* Protected routes with layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="pets" element={<PetsPage />} />
          <Route path="pets/:petId" element={<PetDetailPage />} />
          <Route path="health" element={<HealthPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="breeds" element={<BreedsPage />} />
          <Route path="claim/:tagCode" element={<ClaimTagPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
