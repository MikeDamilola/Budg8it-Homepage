import { CreditCard, PiggyBank, Sparkles } from 'lucide-react'

const items = [
  {
    title: 'Shareable links in seconds',
    body: 'Create branded checkout links customers can trust—no bulky invoices or chasing wire details.',
    icon: CreditCard,
  },
  {
    title: 'Smart wallets for smarter cash flow',
    body: 'Route incoming funds cleanly, reconcile faster, and see balances at a glance.',
    icon: Sparkles,
  },
  {
    title: 'Savings rules that stick',
    body: 'Automate withholdings on payouts so rainy-day funds grow without spreadsheets.',
    icon: PiggyBank,
  },
]

export default function ValueProp() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm font-semibold tracking-wide text-indigo-500">
          WHY BUDG8IT
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold text-[#0F172A] sm:text-4xl">
          A calmer finances stack for founders and ops teams alike
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
          One surface to collect, route, reconcile, and save—purpose-built around how SMBs actually
          move money.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map(({ title, body, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#FBFCFE] via-white to-[#FDF8EC] p-8 shadow-[0px_22px_50px_-32px_rgba(15,23,42,0.35)] transition hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F172A] text-white shadow-md">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#0F172A]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
