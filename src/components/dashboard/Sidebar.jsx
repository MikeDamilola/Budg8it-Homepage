import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logoUrl from '../../assets/Logo.svg'
import homeIconUrl from '../../assets/Home Icon.svg'
import productIconUrl from '../../assets/Product Icon.svg'
import walletIconUrl from '../../assets/Wallet Icon.svg'
import transactionsIconUrl from '../../assets/Transactions Icon.svg'
import settingsIconUrl from '../../assets/Settings Icon.svg'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    iconSrc: homeIconUrl,
    iconTone: 'light',
  },
  {
    label: 'Products',
    href: '/products',
    iconSrc: productIconUrl,
    iconTone: 'dark',
  },
  {
    label: 'Wallet',
    href: '/wallet',
    iconSrc: walletIconUrl,
    iconTone: 'dark',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    iconSrc: transactionsIconUrl,
    iconTone: 'dark',
  },
  {
    label: 'Settings',
    href: '/settings',
    iconSrc: settingsIconUrl,
    iconTone: 'dark',
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = useMemo(() => {
    const match = navItems.find((item) => item.href === pathname)
    return match?.label ?? 'Dashboard'
  }, [pathname])

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden min-h-screen w-[220px] flex-col border-r border-gray-100 bg-white md:flex">
      <div className="mb-4 flex items-center gap-2 px-6 py-5">
        <img
          src={logoUrl}
          alt="Budg8it"
          width={108}
          height={36}
          decoding="async"
          className="h-8 w-auto object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-0">
        {navItems.map((item) => {
          const isActive = active === item.label
          const iconClass =
            item.iconTone === 'light'
              ? isActive
                ? 'h-5 w-5 shrink-0 object-contain'
                : 'h-5 w-5 shrink-0 object-contain brightness-0 opacity-60'
              : isActive
                ? 'h-5 w-5 shrink-0 object-contain brightness-0 invert'
                : 'h-5 w-5 shrink-0 object-contain opacity-70'
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.href)}
              className={`mx-3 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#192250] text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F172A]'
              }`}
            >
              <img src={item.iconSrc} alt="" className={iconClass} width={20} height={20} decoding="async" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        className="mt-auto cursor-pointer px-6 py-4 text-left text-xs text-gray-400 transition hover:text-[#0F172A]"
      >
        Help Center
      </button>
    </aside>
  )
}
