import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How do payment links work?',
    answer:
      'Once you create an account, you can generate a unique payment link from your dashboard in seconds. Share it via WhatsApp, SMS, Instagram, or any channel. Anyone who clicks the link can pay you instantly no app download required on their end.',
  },
  {
    question: 'Who can use this platform?',
    answer:
      'Budg8it is built for freelancers, small business owners, and modern SMEs who want a faster, smarter way to receive payments, track transactions, and automate their savings all from one wallet.',
  },
  {
    question: 'Is my money safe?',
    answer:
      'Absolutely. All funds are stored in a secure, encrypted wallet backed by regulated financial infrastructure. We use bank-level security protocols to ensure your money and personal data are always protected.',
  },
  {
    question: 'Are there any fees?',
    answer:
      'We charge a small processing fee per transaction received through your payment link. There are no hidden charges all fees are shown clearly before you confirm any action.',
  },
  {
    question: 'When is the official launch?',
    answer:
      'We are currently in closed beta, refining the experience for our early users. Join the waitlist today to be among the first to get full access when we officially launch plus early adopters get exclusive perks.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="bg-[#FDFBFB] px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.95fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600">
            Still unsure? After joining the waitlist, we read every inbound note personally.
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
