import { useState } from 'react'
import { CheckCircle, Copy, ExternalLink, Store } from 'lucide-react'

const STORE_URL = 'https://preview--budg8-sa...'

export default function StoreLinkCard() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(STORE_URL)
    } catch {
      // ignore
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl bg-[#0F172A] p-5 text-white">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
        <Store size={24} className="text-white" />
      </div>
      <h3 className="mb-1 text-base font-bold text-white">Your Store Link</h3>
      <p className="mb-4 text-xs leading-relaxed text-white/60">
        Share your customized store with customers
      </p>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-xs text-white/80">{STORE_URL}</span>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="text-white/70 transition hover:text-white"
            aria-label="Copy link"
          >
            {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
          <button type="button" className="text-white/70 transition hover:text-white" aria-label="Open link">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
