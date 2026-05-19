import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CreditCard, X } from 'lucide-react'
import LinkProductsSection from './LinkProductsSection'

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Organic Shea Butter (250g)', price: 4500, stockQuantity: 30 },
  { id: 'p2', name: 'Natural Hair Oil (100ml)', price: 3200, stockQuantity: 15 },
  { id: 'p3', name: 'Herbal Face Cream', price: 6800, stockQuantity: 50 },
  { id: 'p4', name: 'Aloe Vera Gel (200g)', price: 2500, stockQuantity: 40 },
]

const inputClassName =
  'box-border w-full max-w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10'

function Toggle({ checked, onChange, labelId }) {
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

export default function CreateNewWallet({
  open = true,
  onClose,
  onToggleLinkProducts,
  onCreateWallet,
}) {
  const closeButtonRef = useRef(null)
  const scrollRef = useRef(null)
  const titleId = useId()
  const sliderId = useId()
  const linkProductsLabelId = useId()

  const [walletName, setWalletName] = useState('')
  const [autoSavePercent, setAutoSavePercent] = useState(40)
  const [linkProducts, setLinkProducts] = useState(false)
  const [linkedProductData, setLinkedProductData] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const withdrawalPercent = 100 - autoSavePercent

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

  // Reset state on close
  useEffect(() => {
    if (open) return
    setWalletName('')
    setAutoSavePercent(40)
    setLinkProducts(false)
    setLinkedProductData(null)
    setErrors({})
    setIsSubmitting(false)
  }, [open])

  const handleToggleLinkProducts = (value) => {
    setLinkProducts(value)
    onToggleLinkProducts?.(value)
  }

  const validate = () => {
    const next = {}
    if (!walletName.trim()) next.walletName = 'Wallet name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 350))
      onCreateWallet?.({
        walletName: walletName.trim(),
        autoSavePercent,
        linkProducts,
        linkedProductData: linkProducts ? linkedProductData : null,
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
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close create wallet"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          {/* Modal card */}
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
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-30 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 sm:right-4 sm:top-4"
            >
              <X size={20} />
            </button>

            {/* Scrollable body */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            >
              <div className="box-border w-full min-w-0 max-w-full overflow-x-hidden px-5 pb-6 pt-2 sm:px-7 sm:pb-7 sm:pt-3">

                {/* Header */}
                <div className="pt-10 pr-8 sm:pt-11 sm:pr-10">
                  <h2
                    id={titleId}
                    className="break-words text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                  >
                    Create New Wallet
                  </h2>
                </div>

                <form
                  className="mt-6 w-full min-w-0 max-w-full space-y-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Wallet Name */}
                  <div className="min-w-0">
                    <label
                      htmlFor="walletName"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Wallet Name
                    </label>
                    <input
                      id="walletName"
                      type="text"
                      value={walletName}
                      onChange={(e) => {
                        setWalletName(e.target.value)
                        if (errors.walletName) setErrors((prev) => ({ ...prev, walletName: undefined }))
                      }}
                      placeholder="e.g Consultation Fee"
                      className={inputClassName}
                    />
                    {errors.walletName && (
                      <p className="mt-1.5 text-xs text-red-500" role="alert">
                        {errors.walletName}
                      </p>
                    )}
                  </div>

                  {/* Auto-save Slider */}
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <label
                        htmlFor={sliderId}
                        className="min-w-0 text-sm font-medium text-[#0F172A]"
                      >
                        Auto-save Percentage
                      </label>
                      <span className="shrink-0 rounded-full bg-[#E8F5E9] px-3 py-1 text-sm font-semibold text-[#0F172A]">
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
                      onChange={(e) => setAutoSavePercent(Number(e.target.value))}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={autoSavePercent}
                      className="configure-wallet-slider mt-4 h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
                      style={{
                        background: `linear-gradient(to right, #1A1F4E 0%, #1A1F4E ${autoSavePercent}%, #E5E7EB ${autoSavePercent}%, #E5E7EB 100%)`,
                      }}
                    />

                    {/* Inline split labels */}
                    <div className="mt-2 flex justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        WITHDRAWAL {withdrawalPercent}%
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        SAVINGS {autoSavePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Link Products card */}
                  <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                    {/* Toggle row — always visible */}
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <div
                        className="flex min-w-0 items-center gap-2.5"
                        id={linkProductsLabelId}
                      >
                        <CreditCard
                          size={20}
                          className="shrink-0 text-[#0F172A]"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span className="truncate text-sm font-bold text-[#0F172A]">
                          Link Products (OPTIONAL)
                        </span>
                      </div>
                      <Toggle
                        checked={linkProducts}
                        onChange={handleToggleLinkProducts}
                        labelId={linkProductsLabelId}
                      />
                    </div>

                    {/* Animated expanded section */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
                        linkProducts
                          ? 'mt-4 grid-rows-[1fr] opacity-100'
                          : 'mt-0 grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t-2 border-[#1A1F4E]/20">
                          <LinkProductsSection
                            existingProducts={SAMPLE_PRODUCTS}
                            onProductData={setLinkedProductData}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="box-border flex w-full min-w-0 max-w-full items-center justify-center gap-2 rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Creating…' : 'Create Wallet →'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
