import { ArrowUpRight } from 'lucide-react'
import logoUrl from '../assets/Logo White.svg'

const columns = [
  {
    title: 'Quick Links',
    links: ['Home', 'Features', 'FAQs', 'Join Waitlist'],
  },
  {
    title: 'Features',
    links: ['Payment Links', 'Smart Wallets', 'Withdrawal System'],
  },
  {
    title: 'Contact',
    links: ['support@budg8it.app',],
  },
]

export default function Footer({ onOpenModal }) {
  return (
    <footer className="bg-[#0F172A] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div
          id="contact"
          className="flex flex-col gap-10 rounded-[32px] border border-white/10 bg-white/5 p-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Contact us</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Let's build calmer books together</h2>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              Drop a line for partnerships, press, or product questions. We reply within two business days.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] focus-visible:outline-none"
              href="mailto:hello@budg8it.com"
            >
              hello@budg8it.com
            </a>
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] focus-visible:outline-none"
            >
              Join waitlist
              <ArrowUpRight size={16} aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src={logoUrl}
              alt="Budg8it"
              width={120}
              height={40}
              decoding="async"
              className="h-8 w-auto object-contain"
            />
            <p className="mt-4 text-sm text-white/70">Get Paid Instantly. Save Seamlessly. All in One Wallet.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold sentencecase tracking-wide text-white/50">{col.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="text-left transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] focus-visible:outline-none"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Budg8it. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              type="button"
              className="transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] focus-visible:outline-none"
            >
              Privacy
            </button>
            <button
              type="button"
              className="transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] focus-visible:outline-none"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
