import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronLeft, SendHorizontal } from 'lucide-react'
import logoUrl from '../../assets/Logo.svg'

export default function ForgotPasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resendTick, setResendTick] = useState(0)
  const inputRefs = useRef([])

  const [progress, setProgress] = useState(0)
  const [successReveal, setSuccessReveal] = useState(false)

  const handleSendCode = () => {
    if (!email.trim()) {
      setEmailError('Email address is required')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address')
      return
    }
    setEmailError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setTimer(60)
      setCanResend(false)
      setStep(2)
    }, 1500)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (otpError) setOtpError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char
    })
    setOtp(newOtp)
    if (otpError) setOtpError('')
    const lastIndex = Math.min(Math.max(pasted.length - 1, 0), 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length < 6) {
      setOtpError('Please enter the complete 6-digit code')
      return
    }
    setOtpError('')
    setOtpLoading(true)
    setTimeout(() => {
      setOtpLoading(false)
      setStep(3)
    }, 1500)
  }

  useEffect(() => {
    if (step !== 2) return
    let intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalId)
  }, [step, resendTick])

  useEffect(() => {
    if (step === 3) {
      const id = requestAnimationFrame(() => setSuccessReveal(true))
      return () => cancelAnimationFrame(id)
    }
    const tid = setTimeout(() => {
      setSuccessReveal(false)
      setProgress(0)
    }, 0)
    return () => clearTimeout(tid)
  }, [step])

  useEffect(() => {
    if (step !== 3) return
    const t1 = setTimeout(() => setProgress(100), 100)
    const t2 = setTimeout(() => navigate('/reset-password'), 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [step, navigate])

  const emailInputClass =
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 ${emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : 'border-gray-200'}`

  const otpBoxClass =
    'h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-[#0F172A] outline-none transition-all duration-200 focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10'

  const primaryBtnClass =
    'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-3.5 text-sm font-semibold text-white transition hover:opacity-90'

  const stepWrap = (children) => (
    <div
      key={step}
      className="transition-all duration-300 ease-in-out"
      style={{
        opacity: 1,
        transform: 'translateX(0)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {children}
    </div>
  )

  if (step === 3) {
    return (
      <div className="mx-auto w-full max-w-sm">
        {stepWrap(
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full bg-green-50 transition-all duration-500 ease-out ${successReveal ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">Code Verified! 🎉</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-400">
              Your identity has been confirmed. Redirecting you to reset your password...
            </p>

            <div className="mt-4 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#0F172A]"
                style={{
                  width: `${progress}%`,
                  transition: 'width 2s linear',
                }}
              />
            </div>

            <button
              type="button"
              className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline"
              onClick={() => navigate('/reset-password')}
            >
              Click here if not redirected
            </button>
          </div>
        )}
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="mx-auto w-full max-w-sm">
        {stepWrap(
          <>
            <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">Check your inbox</h1>
            <p className="text-sm text-gray-400">We sent a 6-digit recovery code to:</p>
            <p className="mb-8 text-sm font-semibold text-[#0F172A]">{email}</p>

            <div className="mb-2 flex items-center justify-start gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  className={otpBoxClass}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            {otpError ? <p className="mb-4 mt-1 text-xs text-red-500">{otpError}</p> : null}

            <p className="mt-3 text-sm text-gray-400">
              {!canResend ? (
                <>
                  Resend code in 0:{timer < 10 ? `0${timer}` : timer}
                </>
              ) : (
                <>
                  Didn&apos;t receive it?{' '}
                  <span
                    className="cursor-pointer font-medium text-blue-500 hover:underline"
                    onClick={() => {
                      setTimer(60)
                      setCanResend(false)
                      setOtp(['', '', '', '', '', ''])
                      setResendTick((t) => t + 1)
                    }}
                  >
                    Resend Code
                  </span>
                </>
              )}
            </p>

            <button type="button" onClick={handleVerify} className={`${primaryBtnClass} mt-6`}>
              {otpLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Verify Code'
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-4 flex w-fit cursor-pointer items-center gap-1 text-sm text-gray-400 transition hover:text-[#0F172A]"
            >
              <ChevronLeft size={16} className="text-gray-400" />
              Back to Login
            </button>
          </>,
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

          <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">Forget Password</h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-500">
            Enter your email address to receive a 6-digit recovery code.
          </p>

          <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Email*</label>
          <input
            type="email"
            placeholder="Enter your mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError('')
            }}
            className={emailInputClass}
          />
          {emailError ? <p className="mt-1 text-xs text-red-500">{emailError}</p> : null}

          <button type="button" onClick={handleSendCode} className={`${primaryBtnClass} mt-6`}>
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Send Code
                <SendHorizontal size={16} aria-hidden />
              </>
            )}
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <span
              className="cursor-pointer font-medium text-blue-500 transition hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </p>
        </>,
      )}
    </div>
  )
}
