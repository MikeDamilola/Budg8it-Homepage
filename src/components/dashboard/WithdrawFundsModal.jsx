import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

const formatNaira = (amount) =>
  `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank',
  'Globus Bank',
  'Guaranty Trust Bank',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
]

const inputClassName =
  'box-border w-full max-w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10'

export default function WithdrawFundsModal({
  open = false,
  wallet,
  onClose,
  onSave,
}) {
  const closeButtonRef = useRef(null)
  const titleId = useId()

  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [amountDisplay, setAmountDisplay] = useState('0.00')
  const [amount, setAmount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Escape key closes modal
  useEffect(() => {
    if (!open) return undefined
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset form when closed
  useEffect(() => {
    if (open) return
    setBankName('')
    setAccountNumber('')
    setAccountName('')
    setIsVerified(false)
    setIsVerifying(false)
    setAmountDisplay('0.00')
    setAmount(0)
    setIsSubmitting(false)
  }, [open])

  // Mock account name verification
  useEffect(() => {
    if (!open) return undefined

    const digits = accountNumber.replace(/\D/g, '')
    if (!bankName || digits.length !== 10) {
      setAccountName('')
      setIsVerified(false)
      setIsVerifying(false)
      return undefined
    }

    setIsVerifying(true)
    setIsVerified(false)
    const timer = window.setTimeout(() => {
      setAccountName('ALEXANDER PAUL')
      setIsVerified(true)
      setIsVerifying(false)
    }, 600)

    return () => window.clearTimeout(timer)
  }, [open, bankName, accountNumber])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!wallet || !bankName || !isVerified || amount <= 0) return

    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 350))
      onSave?.({
        walletId: wallet.id,
        bankName,
        accountNumber,
        accountName,
        amount,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!wallet) return null

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
            aria-label="Close withdraw funds"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex h-[min(92dvh,95vh)] max-h-[min(95dvh,95vh)] w-full max-w-[500px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
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
              className="absolute right-3 top-3 z-30 rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 sm:right-4 sm:top-4"
            >
              <X size={18} />
            </button>

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
              <div className="box-border w-full min-w-0 max-w-full overflow-x-hidden px-5 pb-6 pt-2 sm:px-7 sm:pb-7 sm:pt-3">
                <div className="pt-10 pr-8 sm:pt-11 sm:pr-10">
                  <h2
                    id={titleId}
                    className="break-words text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                  >
                    Withdraw Funds
                  </h2>
                </div>

                <form
                  className="mt-6 w-full min-w-0 max-w-full space-y-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Withdrawable balance card */}
                  <div className="rounded-xl bg-[#1A1F4E] px-5 py-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                      Withdrawable Balance
                    </p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {formatNaira(wallet.withdrawableBalance)}
                    </p>
                  </div>

                  {/* Bank Name */}
                  <div className="min-w-0">
                    <label
                      htmlFor="withdrawBankName"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Bank Name
                    </label>
                    <div className="relative">
                      <select
                        id="withdrawBankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className={`${inputClassName} appearance-none pr-10 ${bankName === '' ? 'text-gray-400' : 'text-[#0F172A]'}`}
                      >
                        <option value="" disabled>Select a bank</option>
                        {NIGERIAN_BANKS.map((bank) => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="min-w-0">
                    <label
                      htmlFor="withdrawAccountNumber"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Account Number
                    </label>
                    <input
                      id="withdrawAccountNumber"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setAccountNumber(digits)
                      }}
                      placeholder="Enter 10-digit account number"
                      className={inputClassName}
                    />
                  </div>

                  {/* Account Name */}
                  <div className="min-w-0">
                    <label
                      htmlFor="withdrawAccountName"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Account Name
                    </label>
                    <div className="relative">
                      <input
                        id="withdrawAccountName"
                        type="text"
                        readOnly
                        value={isVerifying ? 'Verifying…' : accountName}
                        placeholder=""
                        className={`${inputClassName} bg-[#EEF2F7] pr-10 text-[#475569] ${isVerified ? 'font-semibold uppercase tracking-wide' : ''}`}
                      />
                      {isVerified && (
                        <CheckCircle2
                          size={18}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                          aria-hidden
                        />
                      )}
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-400">
                      Account name automatically verified from bank records.
                    </p>
                  </div>

                  {/* Price (₦) */}
                  <div className="min-w-0">
                    <label
                      htmlFor="withdrawAmount"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Price (₦)
                    </label>
                    <div className="flex min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10">
                      <span className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500">
                        (₦)
                      </span>
                      <input
                        id="withdrawAmount"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amountDisplay}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^\d.]/g, '')
                          setAmountDisplay(raw)
                          const parsed = parseFloat(raw)
                          setAmount(Number.isNaN(parsed) ? 0 : parsed)
                        }}
                        onBlur={() => {
                          const parsed = parseFloat(amountDisplay)
                          const val = Number.isNaN(parsed) ? 0 : parsed
                          setAmount(val)
                          setAmountDisplay(val.toFixed(2))
                        }}
                        className="min-w-0 flex-1 bg-white px-3 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl border border-[#1A1F4E] bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1F4E] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/30"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !bankName || !isVerified || amount <= 0}
                      className="rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Saving…' : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
