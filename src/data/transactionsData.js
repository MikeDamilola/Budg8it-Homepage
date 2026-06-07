import {
  ArrowUpFromLine,
  Landmark,
  Link2,
  ShoppingBag,
  Wallet,
} from 'lucide-react'

export const TRANSACTION_DATE_RANGE_OPTIONS = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
]

export const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'sale', label: 'Sale' },
  { value: 'savings', label: 'Savings' },
  { value: 'link', label: 'Link' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
]

export const typeBadgeStyles = {
  Sale: 'bg-[#1A1F4E] text-white',
  Savings: 'bg-slate-100 text-slate-600',
  Link: 'bg-purple-100 text-purple-600',
  Deposit: 'bg-[#1A1F4E] text-white',
  Withdrawal: 'bg-red-100 text-red-500',
}

export const typeIconConfig = {
  Sale: { bg: 'bg-[#1A1F4E]', icon: ShoppingBag, color: 'text-white' },
  Savings: { bg: 'bg-teal-100', icon: Wallet, color: 'text-teal-600' },
  Link: { bg: 'bg-rose-100', icon: Link2, color: 'text-rose-500' },
  Deposit: { bg: 'bg-slate-100', icon: Landmark, color: 'text-slate-600' },
  Withdrawal: { bg: 'bg-amber-100', icon: ArrowUpFromLine, color: 'text-amber-600' },
}

export const mockTransactions = [
  {
    id: 'TR-882190',
    dateTime: 'Oct 24, 2023 14:22 PM',
    date: '2026-06-01',
    title: 'Product: Leather Messenger Bag',
    details: 'Leather Messenger Bag',
    type: 'Sale',
    amount: 12500,
    status: 'Completed',
    wallet: 'Emergency Funds',
    qty: 1,
  },
  {
    id: 'TR-882191',
    dateTime: 'Oct 24, 2023 14:22 PM',
    date: '2026-06-02',
    title: 'Wallet: Emergency Funds',
    details: 'Emergency Funds',
    type: 'Savings',
    amount: 12500,
    status: 'Completed',
    wallet: 'Emergency Funds',
    qty: 1,
  },
  {
    id: 'TR-882192',
    dateTime: 'Oct 24, 2023 14:22 PM',
    date: '2026-06-03',
    title: 'Link: Consultation Fee',
    details: 'Consultation Fee',
    type: 'Link',
    amount: 12500,
    status: 'Pending',
    wallet: null,
    qty: 1,
  },
  {
    id: 'TR-882193',
    dateTime: 'Oct 24, 2023 14:22 PM',
    date: '2026-06-04',
    title: 'Wallet: Main Savings',
    details: 'Main Savings',
    type: 'Deposit',
    amount: 12500,
    status: 'Completed',
    wallet: 'Main Savings',
    qty: 1,
  },
  {
    id: 'TR-882194',
    dateTime: 'Oct 20, 2023 09:15 AM',
    date: '2026-05-28',
    title: 'Product: Wireless Earbuds',
    details: 'Wireless Earbuds',
    type: 'Sale',
    amount: 8900,
    status: 'Completed',
    wallet: 'Business Savings',
    qty: 2,
  },
  {
    id: 'TR-882195',
    dateTime: 'Oct 18, 2023 16:40 PM',
    date: '2026-05-20',
    title: 'Wallet: Business Savings',
    details: 'Business Savings',
    type: 'Withdrawal',
    amount: 20000,
    status: 'Completed',
    wallet: 'Business Savings',
    qty: 1,
  },
  {
    id: 'TR-882196',
    dateTime: 'Oct 15, 2023 11:05 AM',
    date: '2026-05-10',
    title: 'Link: Design Workshop',
    details: 'Design Workshop',
    type: 'Link',
    amount: 15000,
    status: 'Completed',
    wallet: null,
    qty: 1,
  },
  {
    id: 'TR-882197',
    dateTime: 'Oct 12, 2023 08:30 AM',
    date: '2026-04-22',
    title: 'Wallet: Emergency Funds',
    details: 'Emergency Funds',
    type: 'Savings',
    amount: 5000,
    status: 'Completed',
    wallet: 'Emergency Funds',
    qty: 1,
  },
  {
    id: 'TR-882198',
    dateTime: 'Oct 10, 2023 13:55 PM',
    date: '2026-03-15',
    title: 'Product: Canvas Tote Bag',
    details: 'Canvas Tote Bag',
    type: 'Sale',
    amount: 7200,
    status: 'Pending',
    wallet: 'Main Savings',
    qty: 1,
  },
  {
    id: 'TR-882199',
    dateTime: 'Oct 08, 2023 10:20 AM',
    date: '2026-02-10',
    title: 'Wallet: Main Savings',
    details: 'Main Savings',
    type: 'Deposit',
    amount: 30000,
    status: 'Completed',
    wallet: 'Main Savings',
    qty: 1,
  },
  {
    id: 'TR-882200',
    dateTime: 'Oct 05, 2023 17:45 PM',
    date: '2026-01-18',
    title: 'Link: Coaching Session',
    details: 'Coaching Session',
    type: 'Link',
    amount: 18000,
    status: 'Completed',
    wallet: null,
    qty: 1,
  },
  {
    id: 'TR-882201',
    dateTime: 'Oct 01, 2023 12:00 PM',
    date: '2025-12-05',
    title: 'Wallet: Business Savings',
    details: 'Business Savings',
    type: 'Withdrawal',
    amount: 9500,
    status: 'Completed',
    wallet: 'Business Savings',
    qty: 1,
  },
]

export function isWithinDateRange(dateStr, range) {
  const txDate = new Date(`${dateStr}T12:00:00`)
  const now = new Date()
  const diffMs = now.getTime() - txDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  switch (range) {
    case 'last_7_days':
      return diffDays >= 0 && diffDays <= 7
    case 'last_30_days':
      return diffDays >= 0 && diffDays <= 30
    case 'last_3_months':
      return diffDays >= 0 && diffDays <= 90
    case 'last_6_months':
      return diffDays >= 0 && diffDays <= 180
    case 'this_year':
      return txDate.getFullYear() === now.getFullYear()
    default:
      return true
  }
}

export function splitDateTime(dateTime) {
  const match = dateTime.match(/^(.+\d{4})\s+(.+)$/)
  return match ? { date: match[1], time: match[2] } : { date: dateTime, time: '' }
}
