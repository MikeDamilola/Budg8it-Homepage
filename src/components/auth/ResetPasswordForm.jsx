import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Circle,
  Eye,
  EyeOff,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import logoUrl from '../../assets/Logo.svg'

const passwordRules = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    test: (p) => /\d/.test(p),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%)',
    test: (p) => /[!@#$%^&*(),.?\-_:{}|[\]<>]/.test(p),
  },
]

export default function ResetPasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  })

  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const passedRules = passwordRules.filter((rule) => rule.test(formData.password)).length

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword

  const canSubmit = passedRules === 5 && passwordsMatch

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    setTouched({ ...touched, [field]: true })
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  const validate = () => {
    const newErrors = {}
    const allRulesPassed = passwordRules.every((rule) => rule.test(formData.password))

    if (!formData.password) newErrors.password = 'Password is required'
    else if (!allRulesPassed)
      newErrors.password = 'Password must meet all requirements above'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSetPassword = () => {
    if (loading) return
    if (!canSubmit) return
    if (validate()) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setStep(2)
      }, 1500)
    }
  }

  useEffect(() => {
    if (step !== 2) {
      const tid = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 0)
      return () => clearTimeout(tid)
    }

    const tVisible = setTimeout(() => setVisible(true), 50)
    const tProgress = setTimeout(() => setProgress(100), 100)
    const tNav = setTimeout(() => navigate('/login'), 3500)

    return () => {
      clearTimeout(tVisible)
      clearTimeout(tProgress)
      clearTimeout(tNav)
    }
  }, [step, navigate])

  const passwordInputClass = () => {
    if (errors.password) {
      return 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
    }
    if (passedRules === 5) {
      return 'border-green-400 focus:border-green-400 focus:ring-green-400/10'
    }
    return 'border-gray-200 focus:border-[#0F172A] focus:ring-[#0F172A]/10'
  }

  const confirmInputClass = () => {
    if (errors.confirmPassword) {
      return 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
    }
    if (passwordsMatch && formData.confirmPassword.length > 0) {
      return 'border-green-400 focus:border-green-400 focus:ring-green-400/10'
    }
    return 'border-gray-200 focus:border-[#0F172A] focus:ring-[#0F172A]/10'
  }

  const strengthLabel = () => {
    if (passedRules <= 1)
      return (
        <span className="text-xs font-medium text-red-500">Weak</span>
      )
    if (passedRules <= 3)
      return (
        <span className="text-xs font-medium text-orange-400">Fair</span>
      )
    if (passedRules === 4)
      return (
        <span className="text-xs font-medium text-blue-500">Good</span>
      )
    return (
      <span className="text-xs font-medium text-green-500">Strong</span>
    )
  }

  const segmentClass = (segment) => {
    if (segment > passedRules) return 'bg-gray-200'
    if (passedRules <= 1) return 'bg-red-400'
    if (passedRules <= 3) return 'bg-orange-400'
    if (passedRules === 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const showRulesChecklist =
    formData.password.length > 0 || touched.password

  const stepWrap = (children) => (
    <div key={step} style={{ animation: 'slideIn 0.35s ease-out' }}>
      {children}
    </div>
  )

  if (step === 2) {
    return (
      <div className="mx-auto w-full max-w-sm">
        {stepWrap(
          <div
            className={`flex flex-col items-center gap-5 text-center transition-all duration-500 ease-out ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                  <ShieldCheck size={26} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">Password Reset Successful!</h2>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-400">
              Your password has been updated successfully. You can now log in with your new password.
            </p>

            <div className="w-full max-w-xs">
              <p className="mb-2 text-center text-xs text-gray-400">Redirecting to login...</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#0F172A]"
                  style={{
                    width: `${progress}%`,
                    transition: 'width 3s linear',
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mx-auto mt-4 flex cursor-pointer items-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Go to Login
              <ArrowRight size={16} aria-hidden />
            </button>

            <div className="mt-3 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-gray-400" />
              <span className="text-xs text-gray-400">
                Your account is now secured with your new password
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {stepWrap(
        <>
          <div className="mb-10 flex items-center">
            <img
              src={logoUrl}
              alt="Budg8it"
              width={108}
              height={36}
              decoding="async"
              className="h-8 w-auto object-contain"
            />
          </div>

          <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">Set New Password</h1>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
            Create a strong password to secure your account. Your password must meet all requirements below.
          </p>

          <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">New Password*</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a new password"
              value={formData.password}
              onChange={handleChange('password')}
              className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-300 ${passwordInputClass()}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          ) : null}

          <div className="mb-2 mt-3">
            <div className="mb-1.5 flex justify-between">
              <span className="text-xs text-gray-400">Password strength</span>
              {strengthLabel()}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((segment) => (
                <div
                  key={segment}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${segmentClass(segment)}`}
                />
              ))}
            </div>
          </div>

          {showRulesChecklist ? (
            <div className="mt-3 space-y-2">
              {passwordRules.map((rule) => {
                const ok = rule.test(formData.password)
                return (
                  <div
                    key={rule.id}
                    className="flex items-center gap-2 transition-all duration-200"
                  >
                    {ok ? (
                      <>
                        <CheckCircle size={14} className="flex-shrink-0 text-green-500" />
                        <span className="text-xs text-green-600">{rule.label}</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} className="flex-shrink-0 text-gray-300" />
                        <span className="text-xs text-gray-400">{rule.label}</span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ) : null}

          <label className="mb-1.5 mt-5 block text-sm font-semibold text-[#0F172A]">
            Confirm New Password*
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-300 ${confirmInputClass()}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-gray-600"
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {formData.confirmPassword.length > 0 ? (
            passwordsMatch ? (
              <div className="mt-1.5 flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-500" />
                <span className="text-xs text-green-600">Passwords match</span>
              </div>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5">
                <XCircle size={13} className="text-red-400" />
                <span className="text-xs text-red-500">Passwords do not match</span>
              </div>
            )
          ) : null}

          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          ) : null}

          <button
            type="button"
            onClick={handleSetPassword}
            disabled={!canSubmit}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition ${
              canSubmit
                ? 'cursor-pointer bg-[#0F172A] hover:opacity-90'
                : 'cursor-not-allowed bg-[#0F172A] opacity-50'
            }`}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Set New Password
                <ShieldCheck size={16} aria-hidden />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mx-auto mt-5 flex w-fit cursor-pointer items-center justify-center gap-1 text-sm text-gray-400 transition hover:text-[#0F172A]"
          >
            <ChevronLeft size={16} className="text-gray-400" />
            Back to Login
          </button>
        </>,
      )}
    </div>
  )
}
