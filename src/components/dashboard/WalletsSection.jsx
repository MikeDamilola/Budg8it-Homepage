import { BarChart3, Briefcase, MoreVertical, Plus, Receipt } from 'lucide-react'

const wallets = [
  {
    name: 'Expenses Wallet',
    icon: Receipt,
    bg: 'from-[#4A7C59] to-[#3A6B49]',
    autoSave: '25%',
    amountSaved: '₦45,500.00',
    available: '₦12,500.00',
    linked: 'No product linked',
  },
  {
    name: 'Business Funds',
    icon: Briefcase,
    bg: 'from-[#7B6BA8] to-[#6B5B98]',
    autoSave: '25%',
    amountSaved: '₦45,500.00',
    available: '₦12,500.00',
    linked: 'No product linked',
  },
  {
    name: 'Weekly Stocks',
    icon: BarChart3,
    bg: 'from-[#B8A040] to-[#A89030]',
    autoSave: '25%',
    amountSaved: '₦45,500.00',
    available: '₦12,500.00',
    linked: '12 product linked',
  },
]

export default function WalletsSection() {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0F172A]">Your Wallets</h2>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
        >
          <Plus size={16} aria-hidden />
          Add Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {wallets.map((w) => {
          const Icon = w.icon
          return (
            <div
              key={w.name}
              className={`relative min-h-[200px] overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white ${w.bg}`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-white/80" />
                  <span className="text-sm font-semibold text-white">{w.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center rounded-lg bg-white/20 px-2 py-1 text-center text-[10px] font-bold text-white">
                    <span>AUTO</span>
                    <span>SAVE</span>
                    <span>{w.autoSave}</span>
                  </div>
                  <button type="button" className="text-white/70" aria-label="More options">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                AMOUNT SAVED
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{w.amountSaved}</p>

              <div className="my-3 border-t border-white/20" />

              <p className="text-[10px] uppercase tracking-wider text-white/60">
                AVAILABLE FOR WITHDRAWAL
              </p>
              <p className="mt-1 text-xl font-bold text-white">{w.available}</p>

              <p className="mt-3 text-xs text-white/60">{w.linked}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
