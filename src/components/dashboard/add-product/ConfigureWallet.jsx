import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import ProductFlowStepper from './ProductFlowStepper'

export default function ConfigureWallet({
  open,
  onClose,
  onProceed,
  onBackToAddProduct,
  initialAutoSavePercent = 40,
}) {
  const titleId = useId()
  const sliderId = useId()
  const closeButtonRef = useRef(null)
  const [autoSavePercent, setAutoSavePercent] = useState(40)

  const withdrawable = 100 - autoSavePercent

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

  useEffect(() => {
    if (!open) return
    setAutoSavePercent(initialAutoSavePercent ?? 40)
  }, [open, initialAutoSavePercent])

  const handleProceed = () => {
    onProceed?.(autoSavePercent)
  }

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
            aria-label="Close configure wallet modal"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[95vh] w-full max-w-[500px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
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

            <div className="overflow-y-auto px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
              <ProductFlowStepper
                currentStep={2}
                onStepClick={(stepId) => {
                  if (stepId === 1) onBackToAddProduct?.()
                }}
              />

              <h2
                id={titleId}
                className="mt-6 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
              >
                Configure Your Wallet
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Set the percentage of incoming funds to be automatically moved to your savings wallet.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor={sliderId} className="text-sm font-medium text-[#0F172A]">
                      Auto-save Percentage
                    </label>
                    <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-sm font-semibold text-[#0F172A]">
                      {autoSavePercent}%
                    </span>
                  </div>

                  <input
                    id={sliderId}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={autoSavePercent}
                    onChange={(event) => setAutoSavePercent(Number(event.target.value))}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={autoSavePercent}
                    className="configure-wallet-slider mt-4 h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
                    style={{
                      background: `linear-gradient(to right, #0F172A 0%, #0F172A ${autoSavePercent}%, #E5E7EB ${autoSavePercent}%, #E5E7EB 100%)`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#E8F5E9] px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                      Withdrawable
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0F172A]">{withdrawable}%</p>
                  </div>
                  <div className="rounded-xl bg-[#EEF0FB] px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                      Auto-invest
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0F172A]">{autoSavePercent}%</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceed}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/40"
                >
                  Proceed To Review
                  <ArrowRight size={18} aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
