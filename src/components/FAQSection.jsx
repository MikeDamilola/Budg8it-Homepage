import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Is Budg8it a bank?',
    answer:
      'No. Budg8it orchestrates payouts, allocations, and savings logic on top of partner institutions. Actual custody still sits with regulated partners you already trust.',
  },
  {
    question: 'Which payment rails do you cover?',
    answer:
      'We start with ACH and card-based links, with instant settlement options rolling out per region. Every link can carry metadata for downstream accounting.',
  },
  {
    question: 'How do autosave rules work?',
    answer:
      'Think of rules as programmable waterfalls: when inbound funds settle, Budg8it allocates percentages or flat amounts toward savings wallets before releasing the remainder.',
  },
  {
    question: 'Can I collaborate with teammates?',
    answer:
      'Yes. Role-based workspaces let finance admins draft flows while reviewers approve sensitive moves—all without sharing master logins.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="border-t border-gray-100 bg-[#FDFBFB] px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.95fr_1.2fr]">
        <div>
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400">FAQ</span>
          <h2 className="mt-5 text-3xl font-bold text-[#0F172A] sm:text-4xl">
            Straight answers before you onboard
          </h2>
          <p className="mt-4 text-gray-600">
            Still unsure? Ping us after joining the waitlist—we read every inbound note personally.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-[22px] border border-gray-100 bg-white p-6 shadow-[0px_18px_50px_-40px_rgba(15,23,42,0.45)]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold text-[#0F172A] focus-visible:ring-2 focus-visible:ring-[#0F172A]/20 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <ChevronDown
                  aria-hidden
                  className="mt-0.5 shrink-0 text-gray-400 transition group-open:-rotate-180"
                  size={20}
                />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
