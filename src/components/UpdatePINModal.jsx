import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const PIN_LENGTH = 6

function PinInputRow({ label, values, onChange, inputRefs, startIndex }) {
  return (
    <div>
      {label && (
        <p className="mb-3 text-center text-[13px] text-gray-400">{label}</p>
      )}
      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => {
          const globalIndex = startIndex + index
          return (
            <input
              key={globalIndex}
              ref={(el) => {
                inputRefs.current[globalIndex] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={values[index]}
              onChange={(e) => onChange(index, e.target.value, globalIndex)}
              onKeyDown={(e) => onChange(index, null, globalIndex, e)}
              className="h-[52px] w-[52px] rounded-lg border border-gray-200 text-center text-2xl font-medium text-[#1A1F4E] transition focus:border-[#1A1F4E] focus:outline-none focus:ring-2 focus:ring-[#1A1F4E]/10"
              aria-label={`PIN digit ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function UpdatePINModal({ open = false, onClose, onUpdatePIN }) {
  const titleId = useId()
  const closeButtonRef = useRef(null)
  const inputRefs = useRef([])

  const [pin, setPin] = useState(Array(PIN_LENGTH).fill(''))
  const [confirmPin, setConfirmPin] = useState(Array(PIN_LENGTH).fill(''))
  const [pinError, setPinError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setPin(Array(PIN_LENGTH).fill(''))
    setConfirmPin(Array(PIN_LENGTH).fill(''))
    setPinError('')
    setIsSubmitting(false)
  }, [open])

  const handlePinChange = (row, index, value, globalIndex, event, setter) => {
    if (event?.key === 'Backspace') {
      setter((prev) => {
        const next = [...prev]
        if (next[index]) {
          next[index] = ''
        } else if (index > 0) {
          next[index - 1] = ''
          inputRefs.current[globalIndex - 1]?.focus()
        }
        return next
      })
      setPinError('')
      return
    }

    if (value === null) return

    const digit = value.replace(/\D/g, '').slice(-1)
    setter((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    setPinError('')

    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[globalIndex + 1]?.focus()
    }
  }

  const handleSave = async () => {
    const pinValue = pin.join('')
    const confirmValue = confirmPin.join('')

    if (pinValue.length !== PIN_LENGTH || confirmValue.length !== PIN_LENGTH) {
      setPinError('Please enter a complete 6-digit PIN.')
      return
    }

    if (pinValue !== confirmValue) {
      setPinError('PINs do not match. Please try again.')
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 350))
      onUpdatePIN?.(pinValue)
      onClose?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close update PIN modal"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:p-8"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30"
            >
              <X size={18} />
            </button>

            <div className="pt-6 text-center">
              <h2 id={titleId} className="text-lg font-bold text-[#1A1F4E]">
                Update Security PIN
              </h2>
              <p className="mt-2 text-[13px] text-gray-400">
                Enter your new 6-digit PIN
              </p>
            </div>

            <div className="mt-8 space-y-8">
              <PinInputRow
                values={pin}
                inputRefs={inputRefs}
                startIndex={0}
                onChange={(index, value, globalIndex, event) =>
                  handlePinChange('pin', index, value, globalIndex, event, setPin)
                }
              />

              <PinInputRow
                label="Confirm New PIN"
                values={confirmPin}
                inputRefs={inputRefs}
                startIndex={PIN_LENGTH}
                onChange={(index, value, globalIndex, event) =>
                  handlePinChange('confirm', index, value, globalIndex, event, setConfirmPin)
                }
              />

              {pinError && (
                <p className="text-center text-xs text-red-500" role="alert">
                  {pinError}
                </p>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#1A1F4E] py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Saving…' : 'Save PIN'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
