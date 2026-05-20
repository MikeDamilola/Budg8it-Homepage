import { useEffect, useRef, useState } from 'react'
import { BarChart3, Briefcase, Link2, MoreVertical, Plus, Receipt, Settings2 } from 'lucide-react'
import wallet1Url from '../../assets/Wallet1.png'
import wallet2Url from '../../assets/Wallet2.png'
import wallet3Url from '../../assets/Wallet3.png'

const wallets = [
  {
    name: 'Expenses Wallet',
    icon: Receipt,
    imageUrl: wallet1Url,
    autoSave: '25%',
    amountSaved: '₦45,500.00',
    available: '₦12,500.00',
    linked: 'No product linked',
  },
  {
    name: 'Business Funds',
    icon: Briefcase,
    imageUrl: wallet2Url,
    autoSave: '25%',
    amountSaved: '₦45,500.00',
    available: '₦12,500.00',
    linked: 'No product linked',
  },
  {
    name: 'Weekly Stocks',
    icon: BarChart3,
    imageUrl: wallet3Url,
    autoSave: '25%',
    amountSaved: '₦45,500.00',
    available: '₦12,500.00',
    linked: '12 product linked',
  },
]

function buildWalletUrl(name) {
  const slug =
    name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'wallet'
  return `pay.budg8it.com/w/${slug}`
}

function WalletCard({ w, isMenuOpen, onToggleMenu, onCloseMenu }) {
  const Icon = w.icon
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const paymentUrl = buildWalletUrl(w.name)

  // Close dropdown on outside click
  useEffect(() => {
    if (!isMenuOpen) return undefined
    const handler = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        onCloseMenu()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isMenuOpen, onCloseMenu])

  // Close on Escape
  useEffect(() => {
    if (!isMenuOpen) return undefined
    const handler = (e) => {
      if (e.key === 'Escape') onCloseMenu()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isMenuOpen, onCloseMenu])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — silently ignore
    }
    onCloseMenu()
  }

  const handleManageWallet = () => {
    onCloseMenu()
  }

  return (
    // Outer wrapper: relative, NO overflow-hidden so the dropdown can escape
    <div className="relative">
      {/* Inner card: overflow-hidden clips the background image to rounded corners */}
      <div className="min-h-[200px] overflow-hidden rounded-2xl text-white shadow-sm">
        <img
          src={w.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={400}
          height={300}
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[200px] flex-col p-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-white/90 drop-shadow-sm" />
              <span className="text-sm font-semibold text-white drop-shadow-sm">
                {w.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center rounded-lg bg-white/20 px-2 py-1 text-center text-[8px] font-bold text-white backdrop-blur-[2px]">
                <span>AUTO</span>
                <span>SAVE</span>
                <span>{w.autoSave}</span>
              </div>

              {/* More-options trigger */}
              <button
                ref={triggerRef}
                type="button"
                aria-label="More options"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                onClick={onToggleMenu}
                className="rounded-full p-0.5 text-white/90 drop-shadow-sm transition hover:bg-white/20"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/85">
            AMOUNT SAVED
          </p>
          <p className="mt-1 text-2xl font-bold text-white drop-shadow-sm">
            {w.amountSaved}
          </p>

          <div className="my-3 border-t border-white/25" />

          <p className="text-[10px] uppercase tracking-wider text-white/85">
            AVAILABLE FOR WITHDRAWAL
          </p>
          <p className="mt-1 text-xl font-bold text-white drop-shadow-sm">
            {w.available}
          </p>

          <p className="mt-3 text-xs text-white/80">{w.linked}</p>
        </div>
      </div>

      {/* Dropdown card — floats above the wallet, outside overflow-hidden */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={`${w.name} options`}
          className="absolute right-3 top-10 z-50 min-w-[152px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.18)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-gray-50"
          >
            <Link2 size={15} className="shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
            <span className="font-medium">
              {copied ? 'Copied!' : 'Wallet Link'}
            </span>
          </button>

          <div className="mx-3 border-t border-gray-100" />

          <button
            type="button"
            role="menuitem"
            onClick={handleManageWallet}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-gray-50"
          >
            <Settings2 size={15} className="shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
            <span className="font-medium">Manage Wallet</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function WalletsSection({ onAddWallet }) {
  const [openMenuIdx, setOpenMenuIdx] = useState(-1)

  const handleToggleMenu = (idx) => {
    setOpenMenuIdx((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0F172A]">Your Wallets</h2>
        <button
          type="button"
          onClick={onAddWallet}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
        >
          <Plus size={16} aria-hidden />
          Add Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {wallets.map((w, idx) => (
          <WalletCard
            key={w.name}
            w={w}
            isMenuOpen={openMenuIdx === idx}
            onToggleMenu={() => handleToggleMenu(idx)}
            onCloseMenu={() => setOpenMenuIdx(-1)}
          />
        ))}
      </div>
    </section>
  )
}
