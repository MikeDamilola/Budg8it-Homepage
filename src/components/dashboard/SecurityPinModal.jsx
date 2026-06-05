import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Delete, Lock, ShieldCheck } from 'lucide-react'
import {
  hasWalletPin,
  saveWalletPin,
  verifyRegisteredEmail,
  verifyWalletPin,
} from '../../utils/walletPinStorage'

const PIN_LENGTH = 4

const KEYPAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
]

const STEP_COPY = {
  create: {
    title: 'Security PIN Required',
    description: 'Create a 4-digit PIN to secure your withdrawal and sensitive actions',
    primaryButton: 'Continue',
    showKeypad: true,
    showForgotPin: false,
    showCancel: false,
  },
  enter: {
    title: 'Security PIN Required',
    description: 'Please enter your 4-digit transaction PIN to authorize this withdrawal',
    primaryButton: 'Confirm Withdrawal',
    showKeypad: true,
    showForgotPin: true,
    showCancel: true,
  },
  reset: {
    title: 'Reset Security PIN',
    description: 'Create a new 4-digit PIN to secure your withdrawal and sensitive actions',
    primaryButton: 'Save New PIN',
    showKeypad: true,
    showForgotPin: false,
    showCancel: false,
  },
}

function PinKeypad({ onKeyPress }) {
  return (
    <div className="mx-auto mt-6 max-w-[280px]">
      {KEYPAD_KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-y-4">
          {row.map((key) => {
            if (key === '') {
              return <div key={`empty-${rowIndex}`} aria-hidden />
            }

            if (key === 'backspace') {
              return (
                <button
                  key="backspace"
                  type="button"
                  onClick={() => onKeyPress('backspace')}
                  aria-label="Delete digit"
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] transition hover:bg-gray-100"
                >
                  <Delete size={20} strokeWidth={1.75} />
                </button>
              )
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKeyPress(key)}
                className="text-2xl font-medium text-[#0F172A] transition hover:text-[#1A1F4E]"
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function PinBoxes({ pin }) {
  return (
    <div className="mt-8 flex justify-center gap-3">
      {Array.from({ length: PIN_LENGTH }).map((_, index) => (
        <div
          key={index}
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EEF2F7]"
          aria-hidden
        >
          {pin[index] ? (
            <span className="h-2.5 w-2.5 rounded-full bg-[#94A3B8]" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#CBD5E1]/60" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function SecurityPinModal({ open = false, onClose, onContinue, onCancel }) {
  const titleId = useId()
  const emailId = useId()

  const [step, setStep] = useState('create')
  const [pin, setPin] = useState('')
  const [email, setEmail] = useState('')
  const [pinError, setPinError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    setStep(hasWalletPin() ? 'enter' : 'create')
    setPin('')
    setEmail('')
    setPinError('')
    setEmailError('')
    setIsSubmitting(false)
  }, [open])

  const resetPinInput = () => {
    setPin('')
    setPinError('')
  }

  const handleKeyPress = (key) => {
    setPinError('')
    if (key === 'backspace') {
      setPin((prev) => prev.slice(0, -1))
      return
    }
    if (!key || pin.length >= PIN_LENGTH) return
    setPin((prev) => prev + key)
  }

  const handlePinSubmit = async () => {
    if (pin.length !== PIN_LENGTH) return

    setIsSubmitting(true)
    setPinError('')

    try {
      await new Promise((res) => setTimeout(res, 300))

      if (step === 'enter') {
        if (!verifyWalletPin(pin)) {
          setPinError('Incorrect PIN. Please try again.')
          setPin('')
          return
        }
        onContinue?.({ action: 'verified' })
        return
      }

      saveWalletPin(pin)
      onContinue?.({ action: step === 'reset' ? 'reset' : 'created', pin })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailVerify = async (e) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 400))

      if (!verifyRegisteredEmail(email)) {
        setEmailError('Email not recognized. Please use your registered account email.')
        return
      }

      resetPinInput()
      setStep('reset')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copy = STEP_COPY[step] ?? STEP_COPY.create
  const isPinStep = step === 'create' || step === 'enter' || step === 'reset'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close security PIN"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[420px] overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pb-8 pt-10 text-center sm:px-8 sm:pb-10 sm:pt-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4F5E9]">
                <Lock size={22} className="text-[#0F172A]" strokeWidth={2} aria-hidden />
              </div>

              {step === 'forgot-email' ? (
                <>
                  <h2
                    id={titleId}
                    className="mt-5 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                  >
                    Forgot PIN?
                  </h2>
                  <p className="mx-auto mt-2 max-w-[300px] text-sm leading-relaxed text-gray-500">
                    Enter your registered email to verify your identity and reset your PIN
                  </p>

                  <form className="mt-8 text-left" onSubmit={handleEmailVerify} noValidate>
                    <label htmlFor={emailId} className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                      Email Address
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError('')
                      }}
                      placeholder="Enter your registered email"
                      className="box-border w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10"
                    />
                    {emailError && (
                      <p className="mt-1.5 text-xs text-red-500" role="alert">{emailError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-6 w-full rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Verifying…' : 'Verify Email'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmail('')
                        setEmailError('')
                        setStep('enter')
                      }}
                      className="mt-3 w-full text-sm font-medium text-[#1A1F4E] transition hover:opacity-70"
                    >
                      Back to PIN entry
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2
                    id={titleId}
                    className="mt-5 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                  >
                    {copy.title}
                  </h2>
                  <p className="mx-auto mt-2 max-w-[300px] text-sm leading-relaxed text-gray-500">
                    {copy.description}
                  </p>

                  <PinBoxes pin={pin} />
                  {pinError && (
                    <p className="mt-3 text-xs text-red-500" role="alert">{pinError}</p>
                  )}

                  {copy.showKeypad && (
                    <PinKeypad onKeyPress={handleKeyPress} />
                  )}

                  {copy.showForgotPin && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('')
                        setEmailError('')
                        setStep('forgot-email')
                      }}
                      className="mt-5 text-sm font-semibold text-[#0F172A] transition hover:opacity-70"
                    >
                      Forgot PIN?
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handlePinSubmit}
                    disabled={pin.length !== PIN_LENGTH || isSubmitting}
                    className={`w-full rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70 ${copy.showForgotPin ? 'mt-6' : 'mt-8'}`}
                  >
                    {isSubmitting ? 'Please wait…' : copy.primaryButton}
                  </button>

                  {copy.showCancel && (
                    <button
                      type="button"
                      onClick={() => {
                        onCancel?.()
                        onClose?.()
                      }}
                      className="mt-3 w-full rounded-xl border border-[#1A1F4E] bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1F4E] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/30"
                    >
                      Cancel Transaction
                    </button>
                  )}
                </>
              )}

              {isPinStep && step !== 'enter' && (
                <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                  <ShieldCheck size={14} className="shrink-0" aria-hidden />
                  <span>Secured by WalletPro Vault</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
