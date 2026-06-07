import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Search,
  Wallet,
} from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import TransactionDetailModal from '../components/TransactionDetailModal'
import { formatNaira } from '../utils/formatNaira'
import {
  isWithinDateRange,
  mockTransactions,
  splitDateTime,
  TRANSACTION_DATE_RANGE_OPTIONS,
  TYPE_FILTER_OPTIONS,
  typeBadgeStyles,
  typeIconConfig,
} from '../data/transactionsData'

const ITEMS_PER_PAGE = 4

const footerLinks = [
  'Help Center',
  'Privacy Policy',
  'Terms & Conditions',
  '© 2025',
]

function SummaryStatCard({ label, value, subLabel, badgeIcon: BadgeIcon, badgeBg, watermark: Watermark }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white px-5 py-5 sm:px-6">
      <div
        className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg ${badgeBg}`}
      >
        <BadgeIcon size={18} strokeWidth={1.75} />
      </div>
      <Watermark
        size={80}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-[0.12]"
        strokeWidth={1.25}
        aria-hidden
      />
      <div className="relative z-10 pr-10">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-2 text-[22px] font-bold text-[#0F172A]">{value}</p>
        {subLabel && <p className="mt-1 text-xs text-gray-400">{subLabel}</p>}
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('last_30_days')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  const dateDropdownRef = useRef(null)
  const typeDropdownRef = useRef(null)

  const selectedRangeLabel = useMemo(
    () =>
      TRANSACTION_DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.label ??
      'Last 30 Days',
    [dateRange]
  )

  const selectedTypeLabel = useMemo(
    () => TYPE_FILTER_OPTIONS.find((option) => option.value === typeFilter)?.label ?? 'All Types',
    [typeFilter]
  )

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType =
        typeFilter === 'all' || t.type.toLowerCase() === typeFilter.toLowerCase()
      const matchesDate = isWithinDateRange(t.date, dateRange)
      return matchesSearch && matchesType && matchesDate
    })
  }, [searchQuery, typeFilter, dateRange])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE))

  const paginatedTransactions = useMemo(
    () =>
      filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredTransactions, currentPage]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, typeFilter, dateRange])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (!showDateDropdown) return undefined
    const handler = (e) => {
      if (!dateDropdownRef.current?.contains(e.target)) {
        setShowDateDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showDateDropdown])

  useEffect(() => {
    if (!showTypeDropdown) return undefined
    const handler = (e) => {
      if (!typeDropdownRef.current?.contains(e.target)) {
        setShowTypeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showTypeDropdown])

  const handleExport = () => {
    const headers = ['Date & Time', 'Transaction Details', 'ID', 'Type', 'Amount', 'Status']
    const rows = filteredTransactions.map((t) => [
      t.dateTime,
      t.details,
      t.id,
      t.type,
      t.amount,
      t.status,
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'budg8it-transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedTransaction(null)
  }

  return (
    <DashboardLayout>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Transactions History</h1>
        <p className="mt-1 text-[13px] text-gray-400">
          Review and manage all your financial activities from sales and deposits to savings and
          withdrawals place.
        </p>
      </div>

      {/* Summary stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard
          label="Total Inflow"
          value={formatNaira(45500)}
          badgeIcon={ArrowDownLeft}
          badgeBg="bg-blue-50 text-blue-400"
          watermark={ArrowDownLeft}
        />
        <SummaryStatCard
          label="Total Inflow"
          value={formatNaira(45500)}
          badgeIcon={ArrowUpRight}
          badgeBg="bg-rose-50 text-rose-400"
          watermark={ArrowUpRight}
        />
        <SummaryStatCard
          label="Net Balance"
          value={formatNaira(45500)}
          subLabel="Active in 3 wallets"
          badgeIcon={Wallet}
          badgeBg="bg-green-50 text-green-500"
          watermark={Wallet}
        />
      </div>

      {/* Filters bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-[240px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-[#0F172A] outline-none placeholder:text-gray-400 focus:border-gray-300"
          />
        </div>

        <div ref={dateDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setShowDateDropdown((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
            aria-expanded={showDateDropdown}
            aria-haspopup="listbox"
          >
            <CalendarDays size={16} className="text-gray-500" />
            <span>{selectedRangeLabel}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showDateDropdown && (
            <div
              role="listbox"
              className="absolute left-0 z-20 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            >
              {TRANSACTION_DATE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={dateRange === option.value}
                  onClick={() => {
                    setDateRange(option.value)
                    setShowDateDropdown(false)
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50 ${
                    dateRange === option.value
                      ? 'font-semibold text-[#1A1F4E]'
                      : 'text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={typeDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setShowTypeDropdown((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
            aria-expanded={showTypeDropdown}
            aria-haspopup="listbox"
          >
            <span>{selectedTypeLabel}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showTypeDropdown && (
            <div
              role="listbox"
              className="absolute left-0 z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            >
              {TYPE_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={typeFilter === option.value}
                  onClick={() => {
                    setTypeFilter(option.value)
                    setShowTypeDropdown(false)
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50 ${
                    typeFilter === option.value
                      ? 'font-semibold text-[#1A1F4E]'
                      : 'text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Transactions table */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText className="mx-auto mb-3 opacity-40" size={40} />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] table-fixed">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-[140px] pb-3 text-left text-xs font-medium text-gray-400">
                      Date & Time
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-400">
                      Transaction Details
                    </th>
                    <th className="w-[100px] pb-3 text-center text-xs font-medium text-gray-400">
                      Type
                    </th>
                    <th className="w-[120px] pb-3 text-center text-xs font-medium text-gray-400">
                      Amount
                    </th>
                    <th className="w-[120px] pb-3 text-left text-xs font-medium text-gray-400">
                      Status
                    </th>
                    <th className="w-[72px] pb-3 text-right text-xs font-medium text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => {
                    const { date, time } = splitDateTime(transaction.dateTime)
                    const iconConfig = typeIconConfig[transaction.type]
                    const Icon = iconConfig?.icon

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-50 transition hover:bg-gray-50"
                      >
                        <td className="py-4 align-middle">
                          <p className="text-[13px] font-semibold text-[#0F172A]">{date}</p>
                          <p className="text-xs text-gray-400">{time}</p>
                        </td>
                        <td className="py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconConfig?.bg ?? 'bg-gray-100'}`}
                            >
                              {Icon && (
                                <Icon
                                  size={16}
                                  className={iconConfig?.color ?? 'text-gray-600'}
                                  strokeWidth={1.75}
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-bold text-[#0F172A]">
                                {transaction.title}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                ID:{transaction.id} . Qty:{transaction.qty}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center align-middle">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${typeBadgeStyles[transaction.type] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-4 text-center align-middle">
                          <span
                            className={`text-sm ${
                              transaction.status === 'Pending'
                                ? 'font-semibold text-red-500'
                                : 'font-medium text-[#0F172A]'
                            }`}
                          >
                            {formatNaira(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-4 align-middle">
                          {transaction.status === 'Completed' ? (
                            <span className="text-[13px] text-gray-600">
                              <span className="text-[#1A1F4E]">•</span> Completed
                            </span>
                          ) : (
                            <span className="text-[13px] text-gray-400">Pending</span>
                          )}
                        </td>
                        <td className="py-4 text-right align-middle">
                          <button
                            type="button"
                            onClick={() => openDetailModal(transaction)}
                            aria-label={`View details for ${transaction.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                          >
                            <FileText size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-[#1A1F4E] text-white'
                      : 'border border-gray-200 bg-white text-[#0F172A] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 py-6 sm:gap-6">
        {footerLinks.map((item) => (
          <span
            key={item}
            className="cursor-pointer text-xs text-gray-400 transition hover:text-[#0F172A]"
          >
            {item}
          </span>
        ))}
      </footer>

      <TransactionDetailModal
        open={showDetailModal}
        transaction={selectedTransaction}
        onClose={closeDetailModal}
      />
    </DashboardLayout>
  )
}
