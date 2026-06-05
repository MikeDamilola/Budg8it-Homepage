import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNaira } from '../../utils/formatNaira'

const CHART_TABS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const Y_TICKS = [0, 50000, 100000, 200000, 500000, 1000000]

function formatYAxis(value) {
  if (value >= 1000000) return `${value / 1000000}M`
  if (value >= 1000) return `${value / 1000}k`
  return value
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-bold text-[#1A1F4E]">
          {formatNaira(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

export default function RevenueChart({ chartPeriod, chartData, onPeriodChange }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Revenue Over Time</h2>

        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          {CHART_TABS.map((tab) => {
            const isActive = chartPeriod === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onPeriodChange(tab.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-white text-[#1A1F4E] font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={Y_TICKS}
              tickFormatter={formatYAxis}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              width={42}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 159, 232, 0.08)' }} />
            <Bar dataKey="revenue" fill="#8B9FE8" radius={[4, 4, 0, 0]} maxBarSize={42} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
