import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clipboard, CloudUpload, Loader2, X } from 'lucide-react'
import SuccessBanner from '../../ui/SuccessBanner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { buildPaymentUrl } from './buildPaymentUrl'

const ACCEPTED_EXTENSIONS = 'JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT'
const MAX_FILE_SIZE = 15 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'application/pdf',
]

const editProductSchema = z.object({
  productName: z.string().trim().min(1, 'Product name is required').max(120, 'Product name is too long'),
  price: z.coerce.number({ invalid_type_error: 'Enter a valid price' }).min(0, 'Price cannot be negative'),
  stocksQuantity: z.coerce
    .number({ invalid_type_error: 'Enter a valid quantity' })
    .int('Quantity must be a whole number')
    .min(1, 'Stock quantity must be at least 1'),
  image: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || ACCEPTED_IMAGE_TYPES.includes(f.type), 'Unsupported file format')
    .refine((f) => !f || f.size <= MAX_FILE_SIZE, 'File must be under 15 MB'),
})

const inputClassName =
  'box-border w-full max-w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10'

export default function EditProductModal({ open, product, onClose, onSave }) {
  const closeButtonRef = useRef(null)
  const scrollRef = useRef(null)
  const fileInputRef = useRef(null)
  const titleId = useId()
  const sliderId = useId()
  const linkId = useId()

  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [priceDisplay, setPriceDisplay] = useState('0.00')
  const [autoSavePercent, setAutoSavePercent] = useState(40)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProductSchema),
    defaultValues: { productName: '', price: 0, stocksQuantity: 1 },
  })

  const productName = watch('productName')
  const paymentUrl = buildPaymentUrl(productName)
  const withdrawalPercent = 100 - autoSavePercent

  // Pre-fill form whenever the modal opens with a product
  useEffect(() => {
    if (!open || !product) return
    reset({
      productName: product.name ?? '',
      price: product.price ?? 0,
      stocksQuantity: product.stockQuantity ?? 1,
    })
    setPriceDisplay(
      product.price ? Number(product.price).toFixed(2) : '0.00'
    )
    setAutoSavePercent(product.autoSavePercent ?? 40)
    setPreviewUrl(product.image ?? null)
    setShowSuccess(false)
    setCopied(false)
    closeButtonRef.current?.focus()
  }, [open, product, reset])

  // Reset all state on close
  useEffect(() => {
    if (open) return
    setPreviewUrl(null)
    setIsSubmitting(false)
    setShowSuccess(false)
    setCopied(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [open])

  // Lock body scroll
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Escape closes
  useEffect(() => {
    if (!open) return undefined
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Auto-revert "Copied!" label
  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const clearPreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const handleFile = useCallback((file) => {
    if (!file) return
    setValue('image', file, { shouldValidate: true })
    clearPreview()
    setPreviewUrl(URL.createObjectURL(file))
  }, [clearPreview, setValue])

  const removeImage = useCallback(() => {
    setValue('image', undefined, { shouldValidate: true })
    clearPreview()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [clearPreview, setValue])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
    } catch { /* clipboard unavailable */ }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 350))
      onSave?.({
        ...product,
        name: data.productName,
        price: data.price,
        stockQuantity: data.stocksQuantity,
        autoSavePercent,
        paymentUrl,
        image: data.image instanceof File
          ? URL.createObjectURL(data.image)
          : product?.image ?? null,
      })
      setShowSuccess(true)
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      // Close modal after the user sees the notice
      window.setTimeout(() => onClose?.(), 1800)
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
            aria-label="Close edit product"
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
              <div className="box-border w-full min-w-0 max-w-full overflow-x-hidden px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">

                {/* ── In-modal success notice ── */}
                <SuccessBanner
                  message="Product edited successfully"
                  visible={showSuccess}
                  onDismiss={() => setShowSuccess(false)}
                  autoDismissMs={0}
                  className="mb-4"
                />

                {/* ── Title ── */}
                <h2
                  id={titleId}
                  className="text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                >
                  Edit Product
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Edit your product details below.
                </p>

                <form
                  className="mt-5 w-full min-w-0 max-w-full space-y-5"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* Product Name */}
                  <div className="min-w-0">
                    <label htmlFor="edit-productName" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                      Product Name
                    </label>
                    <input
                      id="edit-productName"
                      type="text"
                      placeholder="e.g Organic Shea Butter (250g)"
                      className={inputClassName}
                      {...register('productName')}
                    />
                    {errors.productName && (
                      <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.productName.message}</p>
                    )}
                  </div>

                  {/* Price + Stocks Quantity */}
                  <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="edit-price" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                        Price (₦)
                      </label>
                      <div className="flex min-w-0 overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10">
                        <span className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500">
                          ₦
                        </span>
                        <input
                          id="edit-price"
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={priceDisplay}
                          className="min-w-0 flex-1 bg-white px-3 py-3 text-sm text-[#0F172A] focus:outline-none"
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d.]/g, '')
                            setPriceDisplay(raw)
                            const parsed = parseFloat(raw)
                            setValue('price', Number.isNaN(parsed) ? 0 : parsed, { shouldValidate: true })
                          }}
                          onBlur={() => {
                            const parsed = parseFloat(priceDisplay)
                            const val = Number.isNaN(parsed) ? 0 : parsed
                            setValue('price', val, { shouldValidate: true })
                            setPriceDisplay(val.toFixed(2))
                          }}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="edit-stocksQuantity" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                        Stocks Quantity
                      </label>
                      <input
                        id="edit-stocksQuantity"
                        type="number"
                        min={1}
                        step={1}
                        placeholder="E.g 20"
                        className={inputClassName}
                        {...register('stocksQuantity')}
                      />
                      {errors.stocksQuantity && (
                        <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.stocksQuantity.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Upload Image */}
                  <div className="min-w-0">
                    <span className="mb-1.5 block text-sm font-medium text-[#0F172A]">Upload Image</span>
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          fileInputRef.current?.click()
                        }
                      }}
                      onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative box-border flex min-h-[160px] w-full max-w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                        isDragging
                          ? 'border-[#0F172A] bg-[#0F172A]/5'
                          : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFile(file)
                        }}
                      />
                      {previewUrl ? (
                        <div className="relative max-w-full px-2">
                          <img
                            src={previewUrl}
                            alt="Product preview"
                            className="mx-auto max-h-28 max-w-full rounded-lg object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage() }}
                            className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-md transition hover:bg-[#1e293b]"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <CloudUpload size={32} className="mb-3 text-gray-400" strokeWidth={1.5} aria-hidden />
                          <p className="break-words px-1 text-sm text-gray-600">
                            <span className="font-medium text-[#0F172A]">Drag & drop file</span>{' '}or{' '}
                            <button
                              type="button"
                              className="font-semibold text-blue-600 hover:underline"
                              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                            >
                              Browse
                            </button>
                          </p>
                        </>
                      )}
                    </div>
                    <p className="mt-2 break-words text-xs text-gray-400">
                      Supported formates: {ACCEPTED_EXTENSIONS}
                    </p>
                    {errors.image && (
                      <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.image.message}</p>
                    )}
                  </div>

                  {/* Shareable Payment Link */}
                  <div className="min-w-0">
                    <label htmlFor={linkId} className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                      Shareable Payment Link
                    </label>
                    <div className="flex w-full">
                      <input
                        id={linkId}
                        type="text"
                        readOnly
                        value={paymentUrl}
                        className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex shrink-0 items-center gap-1.5 rounded-r-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold tracking-wide text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30"
                      >
                        <Clipboard size={14} aria-hidden />
                        {copied ? 'Copied!' : 'COPY'}
                      </button>
                    </div>
                  </div>

                  {/* Auto-save Percentage slider */}
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor={sliderId} className="text-sm font-medium text-[#0F172A]">
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
                        background: `linear-gradient(to right, #0F172A 0%, #0F172A ${autoSavePercent}%, #E5E7EB ${autoSavePercent}%, #E5E7EB 100%)`,
                      }}
                    />
                    <div className="mt-2 flex justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        WITHDRAWAL {withdrawalPercent}%
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        SAVINGS {autoSavePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Cancel + Save Changes */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex flex-1 items-center justify-center rounded-xl border border-[#0F172A] bg-white px-4 py-3.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden />
                          Saving…
                        </>
                      ) : (
                        'Save Changes'
                      )}
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
