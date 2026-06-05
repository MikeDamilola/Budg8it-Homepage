import { Sparkles } from 'lucide-react'

export default function SmartInsightsCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-[#1A1F4E]" strokeWidth={1.75} />
        <h2 className="text-[15px] font-bold text-[#0F172A]">Smart Insights</h2>
      </div>

      <div className="space-y-2.5">
        <div className="rounded-[10px] bg-[#E8F5E9] p-3.5 text-xs leading-relaxed text-[#1A3A2F]">
          <p>
            Your savings increased by{' '}
            <span className="font-bold text-[#1A1F4E]">22%</span>
            {' '}compared to last month.
          </p>
        </div>

        <div className="rounded-[10px] bg-[#E8F5E9] p-3.5 text-xs leading-relaxed text-[#1A3A2F]">
          <p>
            Product{' '}
            <span className="font-bold text-[#1A1F4E]">SpeedMaxPro X</span>
            {' '}generated 48% of total revenue.
          </p>
        </div>
      </div>
    </div>
  )
}
