import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2, X } from 'lucide-react'

const formatNaira = (amount) =>
  `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

export default function BreakSavingsModal({ wallet, onClose, onBreakSavings }) {
  const titleId = useId()
  const [isBreaking, setIsBreaking] = useState(false)

  // Escape closes
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleConfirm = async () => {
    setIsBreaking(true)
    try {
      await new Promise((res) => setTimeout(res, 500))
      onBreakSavings?.(wallet?.id)
      onClose?.()
    } finally {
      setIsBreaking(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Cancel"
          className="absolute inset-0 bg-black/65"
          onClick={onClose}
          disabled={isBreaking}
        />

        {/* Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={isBreaking}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 hover:text-[#0F172A] disabled:opacity-50"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col items-center px-7 pb-7 pt-8 text-center">
            {/* Warning icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle size={26} className="text-amber-500" strokeWidth={1.8} />
            </div>

            <h2 id={titleId} className="text-lg font-bold text-[#0F172A]">
              Break Savings?
            </h2>

            <p className="mt-2 max-w-[340px] text-[13px] leading-relaxed text-gray-500">
              Breaking your savings for{' '}
              <span className="font-semibold text-[#0F172A]">{wallet?.name}</span> early
              will incur a penalty fee. Your current savings of{' '}
              <span className="font-semibold text-[#0F172A]">
                {formatNaira(wallet?.savingsBalance)}
              </span>{' '}
              will be released minus the penalty. This action cannot be undone.
            </p>

            {/* Penalty info box */}
            <div className="mt-4 w-full rounded-xl bg-amber-50 px-4 py-3">
              <p className="text-[12px] font-medium text-amber-700">
                Early break penalty: 5% of savings amount
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex w-full gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isBreaking}
                className="flex-1 rounded-xl border border-[#0F172A] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isBreaking}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBreaking ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden />
                    Breaking…
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} aria-hidden />
                    Yes, Break Savings
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
