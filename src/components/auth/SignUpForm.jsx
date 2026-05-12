import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import logoUrl from '../../assets/Logo.svg'

export default function SignUpForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateAccount = () => {
    if (loading) return
    if (validate()) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
      }, 1500)
    }
  }

  useEffect(() => {
    if (!submitted) return
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
    return () => clearTimeout(redirectTimer)
  }, [submitted, navigate])

  const inputBaseClass =
    'w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-300'

  const inputClass = (field) =>
    `${inputBaseClass} ${
      errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
        : 'border-gray-200 focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10'
    }`

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center">
          <CheckCircle size={52} className="text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-[#0F172A]">Account Created! 🎉</h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome to Budg8it. Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-md max-w-sm">
      <div className="mb-8 flex items-center">
        <img
          src={logoUrl}
          alt="Budg8it"
          width={108}
          height={36}
          decoding="async"
          className="h-8 w-auto object-contain"
        />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">Create account</h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
        Join a network of businesses and individuals making secure deposits and savings.
      </p>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Name*</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange('name')}
          className={inputClass('name')}
        />
        {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Email*</label>
        <input
          type="email"
          placeholder="Enter your mail"
          value={formData.email}
          onChange={handleChange('email')}
          className={inputClass('email')}
        />
        {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Password*</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange('password')}
            className={`${inputClass('password')} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">Must be at least 8 characters.</p>
        {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password}</p> : null}
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Confirm Password*</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            className={`${inputClass('confirmPassword')} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleCreateAccount}
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          'Create account'
        )}
      </button>

      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <span
          className="cursor-pointer font-medium text-blue-500 hover:underline"
          onClick={() => navigate('/login')}
        >
          Log in
        </span>
      </p>
    </div>
  )
}
