import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudUpload, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import ProductFlowStepper from './ProductFlowStepper'
import { addProductSchema } from './addProductSchema'

const ACCEPTED_EXTENSIONS =
  'JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT'

function formatNaira(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '₦0.00'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(num)
}

export default function AddProductModal({ open, onClose, onProceed }) {
  const titleId = useId()
  const fileInputRef = useRef(null)
  const closeButtonRef = useRef(null)

  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [priceDisplay, setPriceDisplay] = useState('0.00')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      productName: '',
      price: 0,
      stocksQuantity: undefined,
      image: undefined,
    },
  })

  const imageFile = watch('image')

  const clearPreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const handleFile = useCallback(
    (file) => {
      if (!file) return
      setValue('image', file, { shouldValidate: true })
      clearPreview()
      setPreviewUrl(URL.createObjectURL(file))
    },
    [clearPreview, setValue]
  )

  const removeImage = useCallback(() => {
    setValue('image', undefined, { shouldValidate: true })
    clearPreview()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [clearPreview, setValue])

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
    if (open) return
    reset()
    removeImage()
    setPriceDisplay('0.00')
    setIsSubmitting(false)
    setIsDragging(false)
  }, [open, removeImage, reset])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 450))
      onProceed?.(data)
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
            aria-label="Close add product modal"
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
              <ProductFlowStepper currentStep={1} />

              <h2
                id={titleId}
                className="mt-6 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
              >
                Add a New Product
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Fill in your product details below to create a unique payment link that you can
                share with your buyers.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label
                    htmlFor="productName"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Product Name
                  </label>
                  <input
                    id="productName"
                    type="text"
                    placeholder="e.g Organic Shea Butter (250g)"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10"
                    {...register('productName')}
                  />
                  {errors.productName && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Price (₦)
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10">
                      <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500">
                        ₦
                      </span>
                      <input
                        id="price"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={priceDisplay}
                        className="w-full bg-white px-3 py-3 text-sm text-[#0F172A] focus:outline-none"
                        onChange={(event) => {
                          const raw = event.target.value.replace(/[^\d.]/g, '')
                          setPriceDisplay(raw)
                          const parsed = parseFloat(raw)
                          setValue('price', Number.isNaN(parsed) ? 0 : parsed, {
                            shouldValidate: true,
                          })
                        }}
                        onBlur={() => {
                          const parsed = parseFloat(priceDisplay)
                          const value = Number.isNaN(parsed) ? 0 : parsed
                          setValue('price', value, { shouldValidate: true })
                          setPriceDisplay(value.toFixed(2))
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400" aria-live="polite">
                      {formatNaira(watch('price') ?? 0)}
                    </p>
                    {errors.price && (
                      <p className="mt-1.5 text-xs text-red-500" role="alert">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="stocksQuantity"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Stocks Quantity
                    </label>
                    <input
                      id="stocksQuantity"
                      type="number"
                      min={1}
                      step={1}
                      placeholder="E.g 20"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10"
                      {...register('stocksQuantity')}
                    />
                    {errors.stocksQuantity && (
                      <p className="mt-1.5 text-xs text-red-500" role="alert">
                        {errors.stocksQuantity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                    Upload Image
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        fileInputRef.current?.click()
                      }
                    }}
                    onDragEnter={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault()
                      setIsDragging(false)
                    }}
                    onDrop={onDrop}
                    className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                      isDragging
                        ? 'border-[#0F172A] bg-[#0F172A]/5'
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,application/pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) handleFile(file)
                      }}
                    />

                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Product preview"
                          className="max-h-28 max-w-full rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            removeImage()
                          }}
                          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-md transition hover:bg-[#1e293b]"
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload
                          size={32}
                          className="mb-3 text-gray-400"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-[#0F172A]">Drag & drop file</span> or{' '}
                          <button
                            type="button"
                            className="font-semibold text-blue-600 hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                          >
                            Browse
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Supported formats: {ACCEPTED_EXTENSIONS}
                  </p>
                  {errors.image && (
                    <p className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.image.message}
                    </p>
                  )}
                  {imageFile && !previewUrl && (
                    <p className="mt-1 text-xs text-gray-500">{imageFile.name}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden />
                      Processing…
                    </>
                  ) : (
                    'Proceed To Wallet Setup →'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
