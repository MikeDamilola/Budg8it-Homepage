import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Banknote,
  Clipboard,
  Download,
  Edit2,
  Loader2,
  Package,
  PiggyBank,
  Share2,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

const formatNaira = (amount) =>
  `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

function buildDisplayId(product) {
  if (product?.id && String(product.id).startsWith('WPRO')) return product.id
  const slug = (product?.name ?? 'product')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .slice(0, 12)
  return `WPRO-${slug}-${String(product?.id ?? '001').slice(-3).padStart(3, '0')}`
}

// ─── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmationModal({ productName, onCancel, onConfirm, isDeleting }) {
  const titleId = useId()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cancel delete"
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
        disabled={isDeleting}
      />

      {/* Card */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 hover:text-[#0F172A] disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center px-7 pb-7 pt-8 text-center">
          {/* Warning icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={26} className="text-red-500" strokeWidth={1.8} />
          </div>

          <h2 id={titleId} className="text-lg font-bold text-[#0F172A]">
            Delete Product?
          </h2>

          <p className="mt-2 max-w-[320px] text-[13px] leading-relaxed text-gray-500">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-[#0F172A]">{productName}</span>? This
            action cannot be undone and will remove the product and its payment link
            permanently.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl border border-[#0F172A] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={15} aria-hidden />
                  Yes, Delete
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ iconBg, icon: Icon, iconColor, label, value }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon size={18} className={iconColor} strokeWidth={1.8} aria-hidden />
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="text-[17px] font-bold text-[#0F172A]">{value}</p>
    </div>
  )
}

// ─── ManageProductModal ────────────────────────────────────────────────────────
export default function ManageProductModal({
  open,
  product,
  onClose,
  onEditProduct,
  onDeleteProduct,
}) {
  const titleId = useId()
  const qrId = useId()
  const scrollRef = useRef(null)

  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Lock body scroll
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Escape closes (when delete confirm not open)
  useEffect(() => {
    if (!open || showDeleteConfirm) return undefined
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, showDeleteConfirm])

  // Reset on close
  useEffect(() => {
    if (open) return
    setCopied(false)
    setShowDeleteConfirm(false)
    setIsDeleting(false)
  }, [open])

  // Auto-revert "Copied!"
  useEffect(() => {
    if (!copied) return undefined
    const t = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(product?.paymentUrl ?? '')
      setCopied(true)
    } catch { /* clipboard unavailable */ }
  }

  const handleShare = async () => {
    const url = product?.paymentUrl ?? ''
    if (navigator.share) {
      try { await navigator.share({ title: product?.name, url }) }
      catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  const handleDownloadQr = () => {
    const canvas = document.getElementById(qrId)
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${(product?.name ?? 'product').replace(/\s+/g, '-')}-qr-code.png`
    a.click()
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    await new Promise((res) => setTimeout(res, 500))
    onDeleteProduct?.(product?.id)
    setIsDeleting(false)
    setShowDeleteConfirm(false)
    onClose?.()
  }

  const displayId = buildDisplayId(product)
  const totalRevenue = product?.revenue ?? product?.totalRevenue ?? 0
  const totalSold = product?.sold ?? product?.totalSold ?? 0
  const currentStock = product?.stockQuantity ?? product?.currentStock ?? 0
  const autoSavePercent = product?.autoSavePercent ?? 0
  const linkedWallet = product?.linkedWallet ?? null

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
            aria-label="Close"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[92dvh] w-full max-w-[780px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20"
            >
              <X size={16} />
            </button>

            {/* Hidden QR canvas */}
            <QRCodeCanvas
              id={qrId}
              value={product?.paymentUrl ?? 'https://pay.budg8it.com'}
              size={300}
              style={{ display: 'none' }}
            />

            {/* Scrollable body */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            >
              <div className="space-y-6 px-5 pb-7 pt-6 sm:px-8">

                {/* ── Section 1: Product Header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4 pr-8">
                  {/* Left: image + identity */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>
                    <div>
                      <h2
                        id={titleId}
                        className="text-lg font-bold leading-snug text-[#0F172A] sm:text-xl"
                      >
                        {product?.name ?? '—'}
                      </h2>
                      <p className="mt-0.5 text-[13px] text-gray-400">
                        Product ID:{' '}
                        <span className="font-medium text-gray-500">
                          #{displayId}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditProduct?.(product?.id)}
                      className="flex items-center gap-2 rounded-lg bg-[#1A1F4E] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
                    >
                      <Edit2 size={14} aria-hidden />
                      Edit Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      <Trash2 size={14} aria-hidden />
                      Delete
                    </button>
                  </div>
                </div>

                {/* ── Section 2: Stats cards ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard
                    iconBg="bg-green-50"
                    icon={Banknote}
                    iconColor="text-green-600"
                    label="Total Revenue"
                    value={formatNaira(totalRevenue)}
                  />
                  <StatCard
                    iconBg="bg-teal-50"
                    icon={ShoppingCart}
                    iconColor="text-teal-600"
                    label="Total Sold"
                    value={`${totalSold} Units`}
                  />
                  <StatCard
                    iconBg="bg-purple-50"
                    icon={Package}
                    iconColor="text-purple-600"
                    label="Current Stock"
                    value={`${currentStock} in Stock`}
                  />
                  <StatCard
                    iconBg="bg-amber-50"
                    icon={PiggyBank}
                    iconColor="text-amber-600"
                    label="Auto Savings"
                    value={`${autoSavePercent}% Active`}
                  />
                </div>

                {/* ── Sections 3 + 4: Two-column row ── */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

                  {/* Section 3: Payment & Links (left, wider) */}
                  <div className="flex flex-col gap-4 lg:col-span-3">
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        Payment & Links
                      </h3>
                      <p className="mt-0.5 text-[12px] text-gray-400">
                        Direct customer payment integration
                      </p>
                    </div>

                    {/* Payment URL box */}
                    <div>
                      <p className="mb-1.5 text-[12px] font-medium text-gray-400">
                        Product Payment URL
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-600">
                          {product?.paymentUrl ?? '—'}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20"
                        >
                          <Clipboard size={12} aria-hidden />
                          {copied ? 'Copied!' : 'COPY'}
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0F172A] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20"
                      >
                        <Share2 size={14} aria-hidden />
                        Share Link
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0F172A] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20"
                      >
                        <Download size={14} aria-hidden />
                        Download QR
                      </button>
                    </div>
                  </div>

                  {/* Section 4: Linked Wallet (right, narrower) */}
                  <div className="flex flex-col rounded-xl bg-[#1A1F4E] p-5 lg:col-span-2">
                    {/* Header */}
                    <div className="mb-4">
                      <p className="text-[15px] font-bold text-white">
                        Linked Wallet
                      </p>
                      <p className="mt-0.5 text-[12px] text-blue-200/70">
                        Proceeds target
                      </p>
                    </div>

                    {linkedWallet ? (
                      <>
                        {/* Account name block */}
                        <div className="rounded-lg bg-white/10 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200/70">
                            Account Name
                          </p>
                          <p className="mt-1 text-base font-bold text-white">
                            {linkedWallet.name}
                          </p>
                        </div>

                        {/* Total savings */}
                        <div className="mt-auto pt-5">
                          <p className="text-[12px] text-blue-200/70">
                            Total Savings from this product
                          </p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatNaira(linkedWallet.totalSavings)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-white/10 py-6 text-center">
                        <PiggyBank
                          size={28}
                          className="text-blue-200/50"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <p className="text-[13px] text-blue-200/60">
                          No wallet linked
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Delete Confirmation Modal (stacked on top) ── */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <DeleteConfirmationModal
                productName={product?.name ?? 'this product'}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
