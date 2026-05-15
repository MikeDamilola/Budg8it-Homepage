import revenueIconUrl from '../../assets/Revenue.svg'
import stocksIconUrl from '../../assets/Stocks.svg'
import transactionsIconUrl from '../../assets/Transactions.svg'
import autosavingsIconUrl from '../../assets/Autosavings.svg'

const stats = [
  {
    iconSrc: revenueIconUrl,
    iconBg: 'bg-blue-50',
    label: 'Total Revenue',
    value: '₦45,500.00',
  },
  {
    iconSrc: stocksIconUrl,
    iconBg: 'bg-green-50',
    label: 'Active Stocks',
    value: '127',
  },
  {
    iconSrc: transactionsIconUrl,
    iconBg: 'bg-purple-50',
    label: 'Transactions',
    value: '10',
  },
  {
    iconSrc: autosavingsIconUrl,
    iconBg: 'bg-yellow-50',
    label: 'Auto Savings',
    value: '₦45,500.00',
  },
]

export default function StatsRow() {
  return (
    <div
      className="mb-8 mx-1 flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:snap-none"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-h-[152px] w-[min(200px,calc(100vw-5.5rem))] shrink-0 snap-start flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:w-auto lg:shrink lg:p-5"
        >
          <div
            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.iconBg}`}
          >
            <img
              src={stat.iconSrc}
              alt=""
              width={20}
              height={20}
              decoding="async"
              className="h-5 w-5 object-contain"
            />
          </div>
          <p className="text-sm font-medium text-gray-400">{stat.label}</p>
          <p className="mt-1 text-xl font-bold text-[#0F172A]">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
