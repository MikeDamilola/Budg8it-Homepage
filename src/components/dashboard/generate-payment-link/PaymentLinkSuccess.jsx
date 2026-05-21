import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clipboard, Download, Wallet } from 'lucide-react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'

function buildPaymentLinkUrl(purpose) {
  const slug =
    purpose
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'payment'
  return `pay.budg8it.com/p/${slug}`
}

export default function PaymentLinkSuccess({
  open = false,
  purpose = '',
  linkToWallet = false,
  walletName = '',
  onDone,
}) {
  const titleId = useId()
  const linkId = useId()
  const [copied, setCopied] = useState(false)

  const url = buildPaymentLinkUrl(purpose)

  // Lock body scroll
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Reset copied on close
  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  // Auto-revert "Copied!" after 2s
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
    const canvas = document.getElementById('payment-link-qr-canvas')
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const anchor = document.createElement('a')
    anchor.href = dataUrl
    anchor.download = `${purpose || 'payment-link'}-qr-code.png`
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
          {/* Backdrop */}
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
              <div className="box-border w-full min-w-0 max-w-full overflow-x-hidden px-5 pb-7 pt-7 sm:px-7 sm:pb-8 sm:pt-8">

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
                    Payment Link Generated Successfully!
                  </h2>

                  <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-gray-500">
                    Your payment link for{' '}
                    <span className="font-bold text-[#0F172A]">
                      {purpose.toUpperCase()}
                    </span>{' '}
                    has been generated successfully and is ready to share
                  </p>
                </div>

                {/* ── Shareable Payment Link ── */}
                <div className="mt-8">
                  <label htmlFor={linkId} className="text-[13px] font-medium text-[#6B7355]">
                    Shareable Payment Link
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

                {/* ── Wallet Status Card ── */}
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                  {linkToWallet && walletName ? (
                    <div className="flex items-center gap-3">
                      <Wallet
                        size={20}
                        className="shrink-0 text-[#1A1F4E]"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A]">Linked to Wallet</p>
                        <p className="truncate text-xs text-gray-500">{walletName}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Wallet
                        size={20}
                        className="shrink-0 text-gray-400"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className="text-sm text-gray-500">No Wallet Linked</span>
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
                        aria-label="Payment link QR code"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="text-[15px] font-bold text-[#0F172A]">Payment Link QR Code</p>
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
                  <QRCodeCanvas id="payment-link-qr-canvas" value={url} size={300} />
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
