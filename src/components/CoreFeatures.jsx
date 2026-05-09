import { ClipboardList, Landmark, Receipt, Workflow } from 'lucide-react'

const pillars = [
  {
    badge: 'COLLECT',
    title: 'Frictionless invoicing meets modern checkout',
    copy: 'Send a link once, optionally add SKUs or notes, close the loop instantly when funds land.',
    icon: Receipt,
    highlights: ['Branded payer experience', 'Status notifications', 'Unified ledger view'],
  },
  {
    badge: 'ORCHESTRATE',
    title: 'Rules that automate the busywork',
    copy: 'Route deposits by client, geography, or product line without manual splits every Friday.',
    icon: Workflow,
    highlights: ['Multi-wallet routing', 'Approvals-ready audit trail', 'Saved templates'],
  },
  {
    badge: 'GROW CAPITAL',
    title: 'Savings ladders without another bank tab',
    copy: 'Set percentage or fixed pulls on each deposit so reserves grow while you operate.',
    icon: Landmark,
    highlights: ['Round-ups & ladders', 'Guardrails before transfers', 'Projected runway'],
  },
  {
    badge: 'CLARITY',
    title: 'Visibility your accountant will love',
    copy: 'Every movement exports cleanly with context so month-end reconciliations take minutes.',
    icon: ClipboardList,
    highlights: ['CSV-ready exports', 'Role-based workspaces', 'API hooks (soon)'],
  },
]

export default function CoreFeatures() {
  return (
    <section id="features" className="bg-[#F4F6FB] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-gray-400">
              CORE FEATURES
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#0F172A] sm:text-[2.65rem] sm:leading-tight">
              The operating layer for payouts, wallets, and automatic savings.
            </h2>
          </div>
          <p className="max-w-xl text-base text-gray-600 lg:text-right">
            Budg8it keeps payer flows lightweight on the surface while enforcing structure underneath.
            Dial up automation as your team scales—no ripping out spreadsheets mid-quarter.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {pillars.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="flex h-full flex-col rounded-[28px] border border-gray-100 bg-white p-8 shadow-[0px_32px_80px_-48px_rgba(15,23,42,0.45)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold tracking-wide text-gray-400">
                      {feature.badge}
                    </p>
                    <h3 className="text-xl font-semibold text-[#0F172A] sm:text-[1.35rem] leading-snug">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F172A]/5 text-[#0F172A]">
                    <Icon size={24} aria-hidden />
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">{feature.copy}</p>
                <ul className="mt-8 space-y-2">
                  {feature.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium text-[#0F172A]"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#94A4FF]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
