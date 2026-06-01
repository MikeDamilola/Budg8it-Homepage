import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  Check,
  Clipboard,
  Lock,
  MoreVertical,
  Settings,
  Wallet,
} from 'lucide-react'
import wallet1Bg from '../../assets/Linked Wallet1.png'
import wallet2Bg from '../../assets/Linked Wallet2.png'
import wallet3Bg from '../../assets/Linked Wallet3.png'

const formatNaira = (amount) =>
  `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

const THEMES = {
  navy: {
    bg: wallet1Bg,
    badge: 'bg-white/15',
    nameText: 'text-white',
    muted: 'text-white/60',
    pill: 'bg-white/20 text-white',
    withdrawBtn: 'bg-white/90 text-[#3D6B58]',
    innerBg: 'bg-white/15 backdrop-blur-sm',
    innerLabel: 'text-white/60',
    innerValue: 'text-white',
    innerMuted: 'text-white/60',
  },
  teal: {
    bg: wallet2Bg,
    badge: 'bg-white/15',
    nameText: 'text-white',
    muted: 'text-white/60',
    pill: 'bg-white/20 text-white',
    withdrawBtn: 'bg-white/90 text-[#5A5068]',
    innerBg: 'bg-white/15 backdrop-blur-sm',
    innerLabel: 'text-white/60',
    innerValue: 'text-white',
    innerMuted: 'text-white/60',
  },
  olive: {
    bg: wallet3Bg,
    badge: 'bg-black/10',
    nameText: 'text-[#3D3920]',
    muted: 'text-[#5A5438]/80',
    pill: 'bg-black/10 text-[#3D3920]',
    withdrawBtn: 'bg-[#6B6840] text-white',
    innerBg: 'bg-black/8 backdrop-blur-sm',
    innerLabel: 'text-[#5A5438]/70',
    innerValue: 'text-[#2D2B15]',
    innerMuted: 'text-[#5A5438]/70',
  },
}

export default function WalletCard({
  wallet,
  onWithdraw,
  onManageWallet,
  onBreakSavings,
}) {
  const theme = THEMES[wallet.colorTheme] ?? THEMES.navy
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  // Close on outside click
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

  // Auto-revert copied
  useEffect(() => {
    if (!copied) return undefined
    const t = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(wallet.paymentUrl ?? '')
      setCopied(true)
    } catch { /* clipboard unavailable */ }
    setMenuOpen(false)
  }

  return (
    // Outer wrapper: relative, NO overflow-hidden so the dropdown can escape the card
    <div className="relative">

      {/* Inner card: overflow-hidden clips the bg image to rounded corners */}
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5">
        {/* Background image */}
        <img
          src={theme.bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />

        {/* ── Header: icon + name + three-dot ── */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme.badge}`}>
              <Wallet size={16} className={theme.nameText} aria-hidden />
            </div>
            <span className={`text-sm font-bold ${theme.nameText}`}>{wallet.name}</span>
          </div>

          {/* Three-dot trigger — ref lives here so position is tracked */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Wallet options"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 ${theme.muted}`}
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* ── Withdrawable balance + button ── */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${theme.muted}`}>
              Withdrawable Balance
            </p>
            <p className={`mt-1 text-xl font-bold ${theme.nameText}`}>
              {formatNaira(wallet.withdrawableBalance)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onWithdraw?.(wallet.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${theme.withdrawBtn}`}
          >
            WITHDRAW
          </button>
        </div>

        {/* ── Inner savings block ── */}
        <div className={`relative z-10 min-h-[80px] rounded-xl p-3 ${theme.innerBg}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest ${theme.innerLabel}`}>
                In Savings
              </p>
              <p className={`mt-1 text-base font-bold ${theme.innerValue}`}>
                {formatNaira(wallet.savingsBalance)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              {wallet.matured ? (
                <div className={`flex items-center gap-1 ${theme.innerMuted}`}>
                  <Calendar size={12} aria-hidden />
                  <span className="text-[11px] font-medium">Matured</span>
                </div>
              ) : (
                <div className={`flex items-center gap-1 ${theme.innerMuted}`}>
                  <Lock size={11} aria-hidden />
                  <span className="text-[11px]">
                    Matures in {wallet.daysToMaturity ?? 0} days
                  </span>
                </div>
              )}

              {!wallet.matured && (
                <button
                  type="button"
                  onClick={() => onBreakSavings?.(wallet.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 transition hover:text-rose-300 focus-visible:outline-none"
                >
                  <AlertTriangle size={11} aria-hidden />
                  Break Savings
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Products linked pill ── */}
        <div className="relative z-10 flex">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${theme.pill}`}>
            {wallet.linkedProductsCount > 0
              ? `${wallet.linkedProductsCount} products Linked`
              : 'No product linked'}
          </span>
        </div>
      </div>

      {/* ── Dropdown — lives outside overflow-hidden so it floats freely over the card ── */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-3 top-10 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.22)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-gray-50"
          >
            {copied
              ? <Check size={14} className="shrink-0 text-green-500" />
              : <Clipboard size={14} className="shrink-0 text-gray-400" />
            }
            <span className="font-medium">
              {copied ? 'Copied!' : 'Copy Wallet Link'}
            </span>
          </button>

          <div className="mx-3 border-t border-gray-100" />

          <button
            type="button"
            role="menuitem"
            onClick={() => { onManageWallet?.(wallet.id); setMenuOpen(false) }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-gray-50"
          >
            <Settings size={14} className="shrink-0 text-gray-400" />
            <span className="font-medium">Manage Wallet</span>
          </button>
        </div>
      )}
    </div>
  )
}
