import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function WaitlistModal({ open, onClose }) {
  const emailId = useId()
  const initialFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    initialFocusRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close waitlist modal"
        className="absolute inset-0 bg-[#050816]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="budg8it-waitlist-title"
        className="relative w-full max-w-md rounded-[28px] bg-white px-8 py-8 shadow-[0px_50px_120px_-65px_rgba(15,23,42,0.75)] ring-1 ring-black/5"
      >
        <button
          type="button"
          ref={initialFocusRef}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 focus-visible:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">
          WAITLIST ACCESS
        </p>
        <h2 id="budg8it-waitlist-title" className="mt-4 text-2xl font-bold text-[#0F172A]">
          You are minutes away from calmer payouts
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Share where we should reach you. We onboard design partners deliberately—spots are capped for
          now.
        </p>
        <div className="mt-8 space-y-3">
          <label htmlFor={emailId} className="text-xs font-semibold text-gray-500">
            WORK EMAIL
          </label>
          <input
            id={emailId}
            type="email"
            name="budg8it-waitlist-email"
            placeholder="alex@startup.com"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#0F172A] shadow-inner transition focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#0F172A]"
          />
          <textarea
            name="budg8it-waitlist-context"
            rows={3}
            placeholder="Anything we should know about your payout volume?"
            className="mt-4 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#0F172A] shadow-inner transition focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#0F172A]"
          />
          <button
            type="button"
            className="mt-2 w-full rounded-full bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Reserve my onboarding window
          </button>
          <button
            type="button"
            className="w-full rounded-full px-6 py-2 text-sm font-medium text-gray-500 transition hover:text-[#0F172A]"
            onClick={onClose}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
