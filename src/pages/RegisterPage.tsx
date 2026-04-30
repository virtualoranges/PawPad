import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  telegram_id: z.string().optional(),
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      if (error) throw error

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone || null,
          address: data.address || null,
          telegram_id: data.telegram_id || null,
        })
        if (profileError) throw profileError
      }

      toast.success('Account created! Welcome to PAWPAD 🐾')
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="text-4xl font-heading font-bold text-brand-500">PAWPAD</h1>
          <p className="text-stone-500 font-body mt-1">Create your account</p>
        </div>

        <div className="clay-card p-8">
          <h2 className="text-2xl font-heading font-semibold text-stone-800 mb-6">
            Join PAWPAD
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name *</label>
                <input {...register('full_name')} placeholder="Jane Smith" className="clay-input" />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Email *</label>
                <input {...register('email')} type="email" placeholder="you@example.com" className="clay-input" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="clay-input pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Confirm Password *</label>
                <input {...register('confirm_password')} type="password" placeholder="••••••••" className="clay-input" />
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Phone</label>
                <input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" className="clay-input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Address</label>
                <input {...register('address')} placeholder="123 Main St, City, State" className="clay-input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Telegram ID
                  <span className="text-xs text-stone-400 font-normal ml-2">Get notified when your pet tag is scanned</span>
                </label>
                <input {...register('telegram_id')} placeholder="@yourusername" className="clay-input" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn w-full py-3 bg-brand-500 text-white text-lg hover:bg-brand-600 disabled:opacity-60 mt-2"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account 🐾'}
            </button>
          </form>

          <p className="text-center text-stone-500 mt-6 font-body text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
