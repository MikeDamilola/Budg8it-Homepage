import { Check, ChevronRight } from 'lucide-react'

const transactions = Array.from({ length: 5 }, () => ({
  name: 'Leather Messenger Bag',
  person: 'Adebayo Johnson',
  amount: '₦5,500.00',
  date: 'Feb 4, 1:23 PM',
  status: 'success',
}))

export default function RecentTransactions() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0F172A]">Recent Transactions</h2>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 text-xs font-medium text-[#0D5C6B] hover:underline"
        >
          View all
          <ChevronRight size={14} />
        </button>
      </div>

      <div>
        {transactions.map((tx, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-gray-50 py-3 last:border-none"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Check size={14} className="text-blue-500" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight text-[#0F172A]">{tx.name}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{tx.person}</p>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs font-bold text-[#0F172A]">{tx.amount}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
