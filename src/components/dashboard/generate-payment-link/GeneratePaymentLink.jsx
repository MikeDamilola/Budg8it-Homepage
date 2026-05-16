import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Wallet, X } from 'lucide-react'

const EXISTING_WALLETS = ['Expenses Wallet', 'Business Funds', 'Weekly Stocks']

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10'

function WalletToggle({ checked, onChange, labelId }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-[46px] shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#1A1F4E]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      >
        {checked && <Check size={13} className="text-[#1A1F4E]" strokeWidth={3} aria-hidden />}
      </span>
    </button>
  )
}

export default function GeneratePaymentLink({ open = true, onClose, onProceed }) {
  const closeButtonRef = useRef(null)
  const titleId = useId()
  const sliderId = useId()
  const linkToWalletLabelId = useId()

  const [purpose, setPurpose] = useState('')
  const [priceDisplay, setPriceDisplay] = useState('0.00')
  const [price, setPrice] = useState(0)
  const [linkToWallet, setLinkToWallet] = useState(true)
  const [allocationMethod, setAllocationMethod] = useState('create')
  const [walletName, setWalletName] = useState('')
  const [existingWallet, setExistingWallet] = useState(EXISTING_WALLETS[0])
  const [autoSavePercent, setAutoSavePercent] = useState(40)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setPurpose('')
    setPriceDisplay('0.00')
    setPrice(0)
    setLinkToWallet(true)
    setAllocationMethod('create')
    setWalletName('')
    setExistingWallet(EXISTING_WALLETS[0])
    setAutoSavePercent(40)
    setErrors({})
    setIsSubmitting(false)
  }, [open])

  const validate = () => {
    const nextErrors = {}

    if (!purpose.trim()) {
      nextErrors.purpose = 'Payment purpose is required'
    }

    if (!price || price <= 0) {
      nextErrors.price = 'Price must be greater than 0'
    }

    if (linkToWallet && allocationMethod === 'create' && !walletName.trim()) {
      nextErrors.walletName = 'Wallet name is required'
    }

    if (linkToWallet && allocationMethod === 'existing' && !existingWallet) {
      nextErrors.existingWallet = 'Please select a wallet'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 350))
      onProceed?.({
        purpose: purpose.trim(),
        price,
        linkToWallet,
        allocationMethod,
        walletName:
          linkToWallet && allocationMethod === 'create'
            ? walletName.trim()
            : linkToWallet && allocationMethod === 'existing'
              ? existingWallet
              : undefined,
        autoSavePercent,
      })
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
            aria-label="Close generate payment link"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[95vh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-2xl bg-[#F5F5F0] shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-30 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 sm:right-4 sm:top-4"
            >
              <X size={20} />
            </button>

            <div className="max-h-[90vh] overflow-y-auto px-8 pb-8 pt-10 sm:pt-11">
              <h2 id={titleId} className="pr-10 text-[1.375rem] font-bold leading-tight text-[#0F172A]">
                Generate Payment Link
              </h2>
              <p className="mt-2 text-sm text-gray-500">Create a secure checkout link for use</p>

              <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="purpose" className="mb-1.5 block text-[13px] font-medium text-[#334155]">
                    Payment Purpose/Details
                  </label>
                  <input
                    id="purpose"
                    type="text"
                    value={purpose}
                    onChange={(event) => {
                      setPurpose(event.target.value)
                      if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: undefined }))
                    }}
                    placeholder="e.g Consultation Fee"
                    className={inputClassName}
                  />
                  {errors.purpose && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.purpose}
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-1/2">
                  <label htmlFor="price" className="mb-1.5 block text-[13px] font-medium text-[#334155]">
                    Price (₦)
                  </label>
                  <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10">
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                      (₦)
                    </span>
                    <input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={priceDisplay}
                      onChange={(event) => {
                        const raw = event.target.value
                        setPriceDisplay(raw)
                        const parsed = parseFloat(raw)
                        const value = Number.isNaN(parsed) ? 0 : parsed
                        setPrice(value)
                        if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }))
                      }}
                      onBlur={() => {
                        const parsed = parseFloat(priceDisplay)
                        const value = Number.isNaN(parsed) ? 0 : parsed
                        setPrice(value)
                        setPriceDisplay(value.toFixed(2))
                      }}
                      className="w-full bg-white px-3 py-3 text-sm text-[#0F172A] focus:outline-none"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5" id={linkToWalletLabelId}>
                      <Wallet size={20} className="text-[#0F172A]" strokeWidth={1.75} aria-hidden />
                      <span className="text-sm font-bold text-[#0F172A]">Link to Wallet</span>
                    </div>
                    <WalletToggle
                      checked={linkToWallet}
                      onChange={setLinkToWallet}
                      labelId={linkToWalletLabelId}
                    />
                  </div>

                  <div
                    className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
                      linkToWallet
                        ? 'mt-4 grid-rows-[1fr] opacity-100'
                        : 'mt-0 grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-gray-100 pt-4">
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="allocationMethod"
                              className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-400"
                            >
                              Allocation Method
                            </label>
                            <div className="relative">
                              <select
                                id="allocationMethod"
                                value={allocationMethod}
                                onChange={(event) => {
                                  setAllocationMethod(event.target.value)
                                  setErrors((prev) => ({
                                    ...prev,
                                    walletName: undefined,
                                    existingWallet: undefined,
                                  }))
                                }}
                                className={`${inputClassName} appearance-none pr-10`}
                              >
                                <option value="create">Create New Wallet</option>
                                <option value="existing">Existing Wallet</option>
                              </select>
                              <ChevronDown
                                size={18}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                aria-hidden
                              />
                            </div>
                          </div>

                          {allocationMethod === 'create' ? (
                            <div>
                              <label
                                htmlFor="walletName"
                                className="mb-1.5 block text-[13px] font-medium text-[#334155]"
                              >
                                New Wallet Name
                              </label>
                              <input
                                id="walletName"
                                type="text"
                                value={walletName}
                                onChange={(event) => {
                                  setWalletName(event.target.value)
                                  if (errors.walletName) {
                                    setErrors((prev) => ({ ...prev, walletName: undefined }))
                                  }
                                }}
                                placeholder="e.g Q4 Project Fund"
                                className={inputClassName}
                              />
                              {errors.walletName && (
                                <p className="mt-1.5 text-xs text-red-500" role="alert">
                                  {errors.walletName}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <label
                                htmlFor="existingWallet"
                                className="mb-1.5 block text-[13px] font-medium text-[#334155]"
                              >
                                Select Wallet
                              </label>
                              <div className="relative">
                                <select
                                  id="existingWallet"
                                  value={existingWallet}
                                  onChange={(event) => {
                                    setExistingWallet(event.target.value)
                                    if (errors.existingWallet) {
                                      setErrors((prev) => ({ ...prev, existingWallet: undefined }))
                                    }
                                  }}
                                  className={`${inputClassName} appearance-none pr-10`}
                                >
                                  {EXISTING_WALLETS.map((name) => (
                                    <option key={name} value={name}>
                                      {name}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={18}
                                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  aria-hidden
                                />
                              </div>
                              {errors.existingWallet && (
                                <p className="mt-1.5 text-xs text-red-500" role="alert">
                                  {errors.existingWallet}
                                </p>
                              )}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <label htmlFor={sliderId} className="text-sm font-semibold text-[#0F172A]">
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

                            <div className="mt-2 flex justify-between text-[11px] text-gray-400">
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A1F4E] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing…' : 'Proceed To Wallet Setup →'}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
