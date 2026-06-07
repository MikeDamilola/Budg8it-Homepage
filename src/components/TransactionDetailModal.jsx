import { useEffect, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { formatNaira } from '../utils/formatNaira'
import { splitDateTime, typeBadgeStyles } from '../data/transactionsData'

export default function TransactionDetailModal({ open = false, transaction, onClose }) {
  const titleId = useId()

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
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!transaction) return null

  const { date, time } = splitDateTime(transaction.dateTime)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <div className="px-6 pb-6 pt-8">
              <h2 id={titleId} className="text-lg font-bold text-[#0F172A]">
                Transaction Details
              </h2>
              <div className="mt-4 border-b border-gray-100" />

              <div className="mt-4 divide-y divide-gray-100">
                <DetailRow label="Transaction ID" value={transaction.id} />
                <DetailRow label="Date & Time" value={`${date} · ${time}`} />
                <DetailRow
                  label="Type"
                  value={
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${typeBadgeStyles[transaction.type] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {transaction.type}
                    </span>
                  }
                />
                <DetailRow label="Description" value={transaction.title} />
                <DetailRow
                  label="Amount"
                  value={
                    <span
                      className={
                        transaction.status === 'Pending'
                          ? 'font-semibold text-red-500'
                          : 'font-semibold text-[#0F172A]'
                      }
                    >
                      {formatNaira(transaction.amount)}
                    </span>
                  }
                />
                <DetailRow label="Status" value={transaction.status} />
                {transaction.wallet && (
                  <DetailRow label="Wallet" value={transaction.wallet} />
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-[#1A1F4E] py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
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

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-right text-sm font-medium text-[#0F172A]">{value}</span>
    </div>
  )
}
