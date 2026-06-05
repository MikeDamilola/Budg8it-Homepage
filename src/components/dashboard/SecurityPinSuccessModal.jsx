import { useEffect, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, ShieldCheck } from 'lucide-react'

const VARIANT_COPY = {
  created: {
    title: 'Security PIN Set',
    description:
      'Your 4-digit security PIN has been successfully created. You can now use it to authorize all your withdrawals and sensitive actions.',
  },
  reset: {
    title: 'Security PIN Reset',
    description:
      'Your new 4-digit security PIN has been saved. You can now use it to authorize your withdrawal and sensitive actions.',
  },
  authorize: {
    title: 'PIN Verified',
    description:
      'Your identity has been confirmed. You can now complete your withdrawal securely.',
  },
}

export default function SecurityPinSuccessModal({
  open = false,
  variant = 'created',
  onVerifyWithdraw,
  onBackToDashboard,
}) {
  const titleId = useId()
  const copy = VARIANT_COPY[variant] ?? VARIANT_COPY.created

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70" aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[420px] overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 pb-8 pt-10 text-center sm:px-8 sm:pb-10 sm:pt-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4F5E9]">
                <Lock size={22} className="text-[#0F172A]" strokeWidth={2} aria-hidden />
              </div>

              <h2
                id={titleId}
                className="mt-5 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
              >
                {copy.title}
              </h2>

              <p className="mx-auto mt-3 max-w-[320px] text-sm leading-relaxed text-gray-500">
                {copy.description}
              </p>

              <div className="mx-auto mt-6 flex max-w-[320px] items-start gap-3 rounded-xl bg-[#EEF0F8] px-4 py-3.5 text-left">
                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-[#1A1F4E]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-bold text-[#1A1F4E]">Identity Secured</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Multi-factor authentication is active
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onVerifyWithdraw}
                className="mt-8 w-full rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
              >
                Verify & Withdraw
              </button>

              <button
                type="button"
                onClick={onBackToDashboard}
                className="mt-3 w-full rounded-xl border border-[#1A1F4E] bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1F4E] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/30"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
