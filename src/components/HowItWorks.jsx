const steps = [
  {
    order: '01',
    title: 'Design your payer flow',
    body: 'Create payment links tied to SKU-style line items so customers know exactly what they are settling.',
  },
  {
    order: '02',
    title: 'Route funds deliberately',
    body: 'Point deposits into primary, tax, payroll, or project wallets with guardrails baked in.',
  },
  {
    order: '03',
    title: 'Automate the discipline',
    body: 'Kick off savings ladders, escrow holds, or sweeps whenever money hits—with full traceability.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400">HOW IT WORKS</span>
          <h2 className="mt-4 text-3xl font-bold text-[#0F172A] sm:text-4xl">
            Spin up payouts in three guided moves
          </h2>
          <p className="mt-4 text-gray-600">
            No labyrinth of tabs—each step mirrors how finance teams explain money movement to founders.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[30px] top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-[#CBD4FF] via-[#E9DCC4] to-transparent md:block lg:left-[calc(16.666%-4px)]"
          />
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            {steps.map((step, index) => (
              <article key={step.title} className="relative flex-1">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="flex items-center md:block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-[#F4F6FB] text-sm font-semibold text-[#0F172A] shadow-inner md:sticky md:top-32">
                      {step.order}
                    </div>
                    {index < steps.length - 1 ? (
                      <div className="mx-auto my-4 h-full w-px flex-1 bg-gradient-to-b from-[#CBD4FF] to-transparent md:hidden" />
                    ) : null}
                  </div>
                  <div className="rounded-[28px] border border-gray-100 bg-[#FBFCFE] p-8 shadow-inner">
                    <h3 className="text-xl font-semibold text-[#0F172A]">{step.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-gray-600">{step.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
