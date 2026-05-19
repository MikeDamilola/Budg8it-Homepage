import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clipboard, Download, Package } from 'lucide-react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'

function buildWalletUrl(walletName) {
  const slug =
    walletName
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'wallet'
  return `pay.budg8it.com/w/${slug}`
}

export default function WalletCreatedSuccess({
  open = true,
  walletName = '',
  paymentUrl,
  linkedProducts = [],
  onDone,
}) {
  const titleId = useId()
  const linkId = useId()
  const [copied, setCopied] = useState(false)

  const url = paymentUrl || buildWalletUrl(walletName)
  const hasProducts = linkedProducts.length > 0
  const showProductNames = linkedProducts.length <= 3

  // Lock body scroll
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Reset copied state on close
  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  // Auto-revert "Copied!" after 2 s
  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const handleDownloadQr = () => {
    const canvas = document.getElementById('wallet-qr-canvas')
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const anchor = document.createElement('a')
    anchor.href = dataUrl
    anchor.download = `${walletName || 'wallet'}-qr-code.png`
    anchor.click()
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
          {/* Backdrop — clicking it also closes via Done */}
          <div
            className="absolute inset-0 bg-black/70"
            aria-hidden
            onClick={onDone}
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
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
              <div className="px-5 pb-7 pt-7 sm:px-7 sm:pb-8 sm:pt-8">

                {/* ── Success icon + heading ── */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-slate-300/60" aria-hidden />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1F4E]">
                      <Check size={22} className="text-white" strokeWidth={2.5} aria-hidden />
                    </div>
                  </div>

                  <h2
                    id={titleId}
                    className="mt-4 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                  >
                    Wallet Created Successfully!
                  </h2>

                  <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-gray-500">
                    Your wallet{' '}
                    <span className="font-bold text-[#0F172A]">
                      {walletName.toUpperCase()}
                    </span>{' '}
                    has been created successfully for savings and withdrawal
                  </p>
                </div>

                {/* ── Wallet Payment Link ── */}
                <div className="mt-8">
                  <label htmlFor={linkId} className="text-[13px] font-medium text-[#6B7355]">
                    Wallet Payment Link
                  </label>
                  <div className="mt-2 flex w-full">
                    <input
                      id={linkId}
                      type="text"
                      readOnly
                      value={url}
                      className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex shrink-0 items-center gap-1.5 rounded-r-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold tracking-wide text-[#0F172A] transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30"
                    >
                      <Clipboard size={14} aria-hidden />
                      {copied ? 'Copied!' : 'COPY'}
                    </button>
                  </div>
                </div>

                {/* ── Linked Products Status Card ── */}
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                  {!hasProducts ? (
                    <div className="flex items-center gap-3">
                      <Package
                        size={20}
                        className="shrink-0 text-gray-400"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className="text-sm text-gray-500">No Product Linked to Wallet</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3">
                        <Package
                          size={20}
                          className="shrink-0 text-[#1A1F4E]"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span className="text-sm font-semibold text-[#0F172A]">
                          {linkedProducts.length} Product{linkedProducts.length !== 1 ? 's' : ''}{' '}
                          Linked to Wallet
                        </span>
                      </div>
                      {showProductNames && (
                        <ul className="mt-2 space-y-1 pl-9">
                          {linkedProducts.map((p) => (
                            <li key={p.id} className="text-xs text-gray-500">
                              {p.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* ── QR Code Card ── */}
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex gap-4">
                    <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/80 p-2">
                      <QRCodeSVG
                        value={url}
                        size={100}
                        aria-label="Wallet QR code"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="text-[15px] font-bold text-[#0F172A]">Wallet QR Code</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                        Download this code for physical point-of-sale displays
                      </p>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] transition hover:opacity-80 focus-visible:outline-none"
                      >
                        <Download size={16} aria-hidden />
                        Download QR Code
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hidden high-res canvas for PNG download */}
                <div
                  className="pointer-events-none absolute -left-[9999px] opacity-0"
                  aria-hidden
                >
                  <QRCodeCanvas id="wallet-qr-canvas" value={url} size={300} />
                </div>

                {/* ── Done Button ── */}
                <button
                  type="button"
                  onClick={onDone}
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#1A1F4E] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
                >
                  Done
                </button>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
