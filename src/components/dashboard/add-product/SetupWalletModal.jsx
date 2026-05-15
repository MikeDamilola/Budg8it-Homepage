import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import ProductFlowStepper from './ProductFlowStepper'

export default function SetupWalletModal({ open, onClose, productName }) {
  const titleId = useId()
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close wallet setup modal"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[500px] overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30"
            >
              <X size={20} />
            </button>

            <div className="px-5 pb-7 pt-5 sm:px-7 sm:pt-6">
              <ProductFlowStepper currentStep={2} />

              <h2 id={titleId} className="mt-6 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]">
                Set Up Wallet
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {productName
                  ? `Connect a wallet for "${productName}" so payments land in the right place.`
                  : 'Connect a wallet so payments from this product land in the right place.'}
              </p>

              <div className="mt-8 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-10 text-center">
                <p className="text-sm font-medium text-gray-500">Wallet setup flow coming next.</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
