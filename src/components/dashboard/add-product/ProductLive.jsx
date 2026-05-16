import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clipboard, Download } from 'lucide-react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'

export default function ProductLive({ open, paymentUrl, onDone }) {
  const titleId = useId()
  const linkId = useId()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const handleDownloadQr = () => {
    const canvas = document.getElementById('product-qr-canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'product-qr-code.png'
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
          <button
            type="button"
            aria-label="Close and return to dashboard"
            className="absolute inset-0 bg-black/70"
            onClick={onDone}
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
            <div className="overflow-y-auto px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-slate-300/60" aria-hidden />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#0F172A]">
                    <Check size={22} className="text-white" strokeWidth={2.5} aria-hidden />
                  </div>
                </div>

                <h2
                  id={titleId}
                  className="mt-5 text-xl font-bold text-[#0F172A] sm:text-[1.35rem]"
                >
                  Product Live!
                </h2>
                <p className="mt-2 max-w-[400px] text-sm leading-relaxed text-gray-500">
                  Your product has been successfully added to your inventory and is ready for
                  sales.
                </p>
              </div>

              <div className="mt-8">
                <label htmlFor={linkId} className="text-[13px] font-medium text-[#6B7355]">
                  Shareable Payment Link
                </label>
                <div className="mt-2 flex w-full">
                  <input
                    id={linkId}
                    type="text"
                    readOnly
                    value={paymentUrl}
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

              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex gap-4">
                  <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/80 p-2">
                    <QRCodeSVG value={paymentUrl} size={100} aria-label="Product QR code" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="text-[15px] font-bold text-[#0F172A]">Product QR Code</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                      Download this code for physical point-of-sale displays
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] transition hover:opacity-80"
                    >
                      <Download size={16} aria-hidden />
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -left-[9999px] opacity-0" aria-hidden>
                <QRCodeCanvas id="product-qr-canvas" value={paymentUrl} size={200} />
              </div>

              <button
                type="button"
                onClick={onDone}
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/40"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
