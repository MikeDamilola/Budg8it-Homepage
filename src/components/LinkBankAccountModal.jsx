import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const BANK_OPTIONS = [
  'Access Bank',
  'GTBank',
  'First Bank',
  'Zenith Bank',
  'UBA',
  'Stanbic IBTC',
  'Fidelity Bank',
  'Sterling Bank',
  'Other',
]

const ACCOUNT_TYPE_OPTIONS = ['Savings', 'Current', 'Corporate']

const inputClassName =
  'box-border w-full max-w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10'

const selectClassName = `${inputClassName} appearance-none pr-10`

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  )
}

export default function LinkBankAccountModal({ open = false, onClose, onAddBankAccount }) {
  const titleId = useId()
  const closeButtonRef = useRef(null)

  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountType, setAccountType] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [errors, setErrors] = useState({})
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
    setBankName('')
    setAccountNumber('')
    setAccountName('')
    setAccountType('')
    setIsVerifying(false)
    setErrors({})
    setIsSubmitting(false)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const digits = accountNumber.replace(/\D/g, '')
    if (!bankName || digits.length !== 10) {
      setAccountName('')
      setIsVerifying(false)
      return undefined
    }

    setIsVerifying(true)
    const timer = window.setTimeout(() => {
      setAccountName('MONI ROY')
      setIsVerifying(false)
    }, 600)

    return () => window.clearTimeout(timer)
  }, [open, bankName, accountNumber])

  const validate = () => {
    const nextErrors = {}

    if (!bankName) nextErrors.bankName = 'Bank name is required'
    if (!accountNumber || accountNumber.length !== 10) {
      nextErrors.accountNumber = 'Enter a valid 10-digit account number'
    }
    if (!accountType) nextErrors.accountType = 'Account type is required'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 350))
      onAddBankAccount?.({
        bankName,
        accountNumber,
        accountName,
        accountType,
      })
      onClose?.()
    } finally {
      setIsSubmitting(false)
    }
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
            aria-label="Close link bank account modal"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
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

            <div className="overflow-y-auto px-5 pb-6 pt-2 sm:px-7 sm:pb-7 sm:pt-3">
              <div className="pt-10 pr-8 sm:pt-11 sm:pr-10">
                <h2 id={titleId} className="text-lg font-bold text-[#1A1F4E] sm:text-xl">
                  Link Bank Account
                </h2>
                <p className="mt-2 text-[13px] text-gray-400">
                  Add a bank account for withdrawals
                </p>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="linkBankName" className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
                    Bank Name
                  </label>
                  <div className="relative">
                    <select
                      id="linkBankName"
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value)
                        setErrors((prev) => ({ ...prev, bankName: '' }))
                      }}
                      className={`${selectClassName} ${bankName === '' ? 'text-gray-400' : 'text-[#0F172A]'}`}
                    >
                      <option value="" disabled>
                        Select a bank
                      </option>
                      {BANK_OPTIONS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                  {errors.bankName && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.bankName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="linkAccountNumber"
                    className="mb-1.5 block text-[13px] font-medium text-[#0F172A]"
                  >
                    Account Number
                  </label>
                  <input
                    id="linkAccountNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setAccountNumber(digits)
                      setErrors((prev) => ({ ...prev, accountNumber: '' }))
                    }}
                    placeholder="Enter 10-digit account number"
                    className={inputClassName}
                  />
                  {errors.accountNumber && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="linkAccountName"
                    className="mb-1.5 block text-[13px] font-medium text-[#0F172A]"
                  >
                    Account Name
                  </label>
                  <input
                    id="linkAccountName"
                    type="text"
                    readOnly
                    value={isVerifying ? 'Verifying…' : accountName}
                    placeholder="Auto-filled after account number entry"
                    className={`${inputClassName} bg-gray-50 text-[#475569]`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkAccountType"
                    className="mb-1.5 block text-[13px] font-medium text-[#0F172A]"
                  >
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      id="linkAccountType"
                      value={accountType}
                      onChange={(e) => {
                        setAccountType(e.target.value)
                        setErrors((prev) => ({ ...prev, accountType: '' }))
                      }}
                      className={`${selectClassName} ${accountType === '' ? 'text-gray-400' : 'text-[#0F172A]'}`}
                    >
                      <option value="" disabled>
                        Select account type
                      </option>
                      {ACCOUNT_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                  {errors.accountType && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.accountType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-[#1A1F4E] bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1F4E] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Adding…' : 'Add Bank Account'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
