import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Edit2, MoreVertical, ShoppingBag, Trash2 } from 'lucide-react'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
}

export default function ProductCard({
  product,
  onManageProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return undefined
    const handler = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return undefined
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOpen])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(product.paymentUrl ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
    setMenuOpen(false)
  }

  return (
    <div className="flex flex-col overflow-visible rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">

      {/* ── Product image ── */}
      <div className="relative h-[200px] w-full overflow-hidden rounded-t-2xl bg-gray-100">
        {product.image ? (
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

        {/* Auto-save badge */}
        <span className="absolute left-3 top-3 rounded-lg bg-[#8394DB] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {product.autoSavePercent ?? 15}% auto-save
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="relative flex flex-1 flex-col p-4">

        {/* Name + three-dot menu */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 break-words text-sm font-bold leading-snug text-[#0F172A]">
            {product.name}
          </h3>

          {/* Three-dot trigger */}
          <div className="relative shrink-0" ref={triggerRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Product options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A]"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute right-0 top-8 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.18)]"
              >
                {/* Copy product link */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-gray-50"
                >
                  {copied
                    ? <Check size={14} className="shrink-0 text-green-500" />
                    : <Copy size={14} className="shrink-0 text-gray-400" />
                  }
                  <span className="font-medium">
                    {copied ? 'Copied!' : 'Copy Product Link'}
                  </span>
                </button>

                <div className="mx-3 border-t border-gray-100" />

                {/* Edit product */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { onEditProduct?.(product.id); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-gray-50"
                >
                  <Edit2 size={14} className="shrink-0 text-gray-400" />
                  <span className="font-medium">Edit Product</span>
                </button>

                <div className="mx-3 border-t border-gray-100" />

                {/* Delete product */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { onDeleteProduct?.(product.id); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={14} className="shrink-0" />
                  <span className="font-medium">Delete Product</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price + stock */}
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-base font-bold text-[#0F172A]">
            {formatNaira(product.price)}
          </span>
          <div className="flex items-center gap-1">
            <ShoppingBag size={13} className="text-gray-400" aria-hidden />
            <span className="text-xs text-gray-400">{product.stockQuantity} In Stock</span>
          </div>
        </div>

        {/* Sold + revenue */}
        <div className="mt-2 flex items-center gap-3 border-t border-gray-100 pt-2">
          <span className="text-xs font-medium text-gray-500">Sold: {product.sold}</span>
          <span className="text-xs text-gray-200" aria-hidden>|</span>
          <span className="text-xs text-gray-500">Revenue: {formatNaira(product.revenue)}</span>
        </div>

        {/* Manage product CTA */}
        <button
          type="button"
          onClick={() => onManageProduct?.(product.id)}
          className="mt-3 w-full rounded-xl bg-[#0F172A] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/40"
        >
          Manage Product
        </button>
      </div>
    </div>
  )
}
