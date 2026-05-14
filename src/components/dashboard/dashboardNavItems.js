import homeIconUrl from '../../assets/Home Icon.svg'
import productIconUrl from '../../assets/Product Icon.svg'
import walletIconUrl from '../../assets/Wallet Icon.svg'
import transactionsIconUrl from '../../assets/Transactions Icon.svg'
import settingsIconUrl from '../../assets/Settings Icon.svg'

export const dashboardNavItems = [
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
