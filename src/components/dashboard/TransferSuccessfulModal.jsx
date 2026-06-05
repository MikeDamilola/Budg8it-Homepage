import { useEffect, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ShieldCheck } from 'lucide-react'

const formatNaira = (amount) =>
  `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

function maskAccountNumber(accountNumber) {
  const digits = String(accountNumber ?? '').replace(/\D/g, '')
  if (digits.length < 4) return '****'
  return `...${digits.slice(-4)}`
}

export default function TransferSuccessfulModal({
  open = false,
  amount = 0,
  bankName = '',
  accountNumber = '',
  transactionId = '',
  transactionDate = '',
  onBackToDashboard,
  onDownloadReceipt,
}) {
  const titleId = useId()

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
          className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4"
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
              {/* Success icon */}
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#C7D2FE]/50" aria-hidden />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1F4E]">
                  <Check size={22} className="text-white" strokeWidth={2.5} aria-hidden />
                </div>
              </div>

              <h2
                id={titleId}
                className="mt-5 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
              >
                Transfer Successful!
              </h2>

              <p className="mx-auto mt-2 max-w-[320px] text-sm leading-relaxed text-gray-500">
                {formatNaira(amount)} has been sent to the bank account provided
              </p>

              {/* Transaction details */}
              <div className="mx-auto mt-6 max-w-[320px] rounded-xl bg-[#EEF0F8] px-4 py-4 text-left">
                <div className="flex items-center justify-between gap-3 border-b border-[#1A1F4E]/10 pb-3">
                  <span className="text-xs text-gray-500">Transaction ID</span>
                  <span className="text-xs font-bold text-[#1A1F4E]">{transactionId}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-[#1A1F4E]/10 py-3">
                  <span className="text-xs text-gray-500">Date</span>
                  <span className="text-xs font-bold text-[#1A1F4E]">{transactionDate}</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-3">
                  <span className="text-xs text-gray-500">Destination</span>
                  <span className="text-xs font-bold text-[#1A1F4E]">
                    {bankName} ({maskAccountNumber(accountNumber)})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onBackToDashboard}
                className="mt-8 w-full rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
              >
                Back to Dashboard
              </button>

              <button
                type="button"
                onClick={onDownloadReceipt}
                className="mt-3 w-full rounded-xl border border-[#1A1F4E] bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1F4E] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/30"
              >
                Download Receipt
              </button>

              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck size={14} className="shrink-0" aria-hidden />
                <span>Secured by WalletPro Vault</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
