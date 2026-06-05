import { CalendarDays, LayoutList } from 'lucide-react'
import { formatNaira } from '../../utils/formatNaira'

export default function RevenueInsightsCard({ analyticsData }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-[15px] font-bold text-[#0F172A]">Revenue Insights</h2>

      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-[10px] border border-gray-200 bg-white p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0F8]">
            <CalendarDays size={20} className="text-[#1A1F4E]" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Highest Revenue Day</p>
            <p className="text-sm font-bold text-[#0F172A]">{analyticsData.highestRevenueDay}</p>
            <p className="text-xs text-gray-500">{formatNaira(analyticsData.highestRevenueAmount)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-[10px] border border-gray-200 bg-white p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0F8]">
            <LayoutList size={20} className="text-[#1A1F4E]" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Avg. Transaction Value</p>
            <p className="text-sm font-bold text-[#0F172A]">
              {formatNaira(analyticsData.avgTransactionValue)}
            </p>
            <p className="text-xs text-gray-500">
              Based on {analyticsData.salesCount} sales
            </p>
          </div>
        </div>

        <div className="rounded-[10px] bg-[#E8F5E9] p-3.5 text-xs leading-relaxed text-green-700">
          <p>
            Revenue is up{' '}
            <span className="font-bold">{analyticsData.revenueGrowthPercent}%</span>
            {' '}compared to the previous 30-day period.
          </p>
          <p className="mt-1 font-medium">Great job!</p>
        </div>
      </div>
    </div>
  )
}
