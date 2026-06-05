import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Banknote,
  Building2,
  CalendarDays,
  ChevronDown,
  Coins,
  Download,
  Link2,
  Package,
  PiggyBank,
  Receipt,
  Wallet,
} from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import RevenueChart from '../components/charts/RevenueChart'
import TopProductsTable from '../components/charts/TopProductsTable'
import RevenueInsightsCard from '../components/charts/RevenueInsightsCard'
import SmartInsightsCard from '../components/charts/SmartInsightsCard'
import { formatNaira } from '../utils/formatNaira'
import {
  analyticsByDateRange,
  dailyData,
  DATE_RANGE_OPTIONS,
  generateCSVFromData,
  monthlyData,
  topProducts,
  weeklyData,
  yearlyData,
} from '../data/reportsAnalyticsData'

const footerLinks = [
  'Help Center',
  'Privacy Policy',
  'Privacy Policy',
  'Terms & Conditions',
  '© 2025',
]

function PrimaryStatCard({ icon: Icon, iconBg, watermark: Watermark, label, value }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5">
      <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon size={18} className="text-[#0F172A]" strokeWidth={1.75} />
      </div>
      <Watermark
        size={80}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#0F172A] opacity-[0.06]"
        strokeWidth={1.25}
        aria-hidden
      />
      <div className="relative z-10 mt-8">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 text-xl font-bold text-[#0F172A]">{value}</p>
      </div>
    </div>
  )
}

function SecondaryStatCard({ icon: Icon, iconBg, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-gray-200 bg-white p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon size={18} className="text-[#0F172A]" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 text-base font-bold text-[#0F172A]">{value}</p>
      </div>
    </div>
  )
}

export default function ReportsAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_30_days')
  const [chartPeriod, setChartPeriod] = useState('monthly')
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const dateDropdownRef = useRef(null)

  const selectedRangeLabel = useMemo(
    () => DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.label ?? 'Last 30 Days',
    [dateRange]
  )

  const analyticsData = useMemo(
    () => analyticsByDateRange[dateRange] ?? analyticsByDateRange.last_30_days,
    [dateRange]
  )

  const chartData = useMemo(() => {
    switch (chartPeriod) {
      case 'daily':
        return dailyData
      case 'weekly':
        return weeklyData
      case 'yearly':
        return yearlyData
      case 'monthly':
      default:
        return monthlyData
    }
  }, [chartPeriod])

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

  const handleExportReport = () => {
    const csvContent = generateCSVFromData(analyticsData, selectedRangeLabel)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `budg8it-report-${dateRange}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-400">
            Track your earnings, growth, and product performance in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
                className="absolute right-0 z-20 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              >
                {DATE_RANGE_OPTIONS.map((option) => (
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

          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 rounded-lg bg-[#1A1F4E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
          >
            <Download size={16} />
            Export report
          </button>
        </div>
      </div>

      {/* Primary stats */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PrimaryStatCard
          icon={Coins}
          iconBg="bg-green-100"
          watermark={Banknote}
          label="Total Revenue"
          value={formatNaira(analyticsData.totalRevenue)}
        />
        <PrimaryStatCard
          icon={PiggyBank}
          iconBg="bg-amber-100"
          watermark={PiggyBank}
          label="Total Savings"
          value={formatNaira(analyticsData.totalSavings)}
        />
        <PrimaryStatCard
          icon={Building2}
          iconBg="bg-teal-100"
          watermark={Building2}
          label="Withdrawable Balance"
          value={String(analyticsData.withdrawableBalance)}
        />
      </div>

      {/* Secondary stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SecondaryStatCard
          icon={Receipt}
          iconBg="bg-slate-100"
          label="Transactions"
          value={formatNaira(analyticsData.transactions)}
        />
        <SecondaryStatCard
          icon={Wallet}
          iconBg="bg-green-100"
          label="Active Wallets"
          value={String(analyticsData.activeWallets)}
        />
        <SecondaryStatCard
          icon={Package}
          iconBg="bg-blue-100"
          label="Products"
          value={String(analyticsData.products)}
        />
        <SecondaryStatCard
          icon={Link2}
          iconBg="bg-purple-100"
          label="Payment Links"
          value={String(analyticsData.paymentLinks)}
        />
      </div>

      {/* Main two-column content */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          <RevenueChart
            chartPeriod={chartPeriod}
            chartData={chartData}
            onPeriodChange={setChartPeriod}
          />
          <TopProductsTable products={topProducts} />
        </div>

        <div className="space-y-5">
          <RevenueInsightsCard analyticsData={analyticsData} />
          <SmartInsightsCard />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 py-6 sm:gap-6">
        {footerLinks.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="cursor-pointer text-xs text-gray-400 transition hover:text-[#0F172A]"
          >
            {item}
          </span>
        ))}
      </footer>
    </DashboardLayout>
  )
}
