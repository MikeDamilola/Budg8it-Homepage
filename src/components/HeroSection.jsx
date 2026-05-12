import { ArrowUpRight } from 'lucide-react'
import phoneMockupSvg from '../assets/Phone Mockup.svg'

function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection({ onOpenModal }) {
  return (
    <section
      id="home"
      className="relative z-0 -mt-[5.75rem] overflow-visible bg-gradient-to-r from-[#D8DCF0] via-[#EEF0F8] to-[#FBF3DC] px-6 pt-[calc(5.75rem+3.20rem)] pb-0"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,transparent_100%)] md:h-28" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 className="mx-auto flex max-w-5xl flex-col items-center gap-1 text-center text-4xl leading-[1.15] font-semibold text-[#0F172A] sm:text-5xl sm:gap-1.5">
          <span className="sm:whitespace-nowrap">
            Get Paid Faster. Manage Funds Smarter.
          </span>
          <span>Save Automatically.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500 sm:text-base">
          Generate secure payment links, receive payments into smart wallets, and automate
          savings for your business.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#192250] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={onOpenModal}
          >
            Join Waitlist
            <ArrowUpRight size={16} aria-hidden />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[#192250] bg-white px-5 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#192250]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={scrollToFeatures}
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Wider track than headline; flush to hero bottom padding */}
      <div className="relative z-10 mx-auto mt-4 flex w-full max-w-6xl justify-center px-2 sm:mt-6 sm:px-4 md:max-w-7xl">
        <img
          src={phoneMockupSvg}
          alt="Budg8it mobile app mockups"
          className="block h-auto w-full object-contain object-bottom drop-shadow-2xl"
          width={1425}
          height={494}
          decoding="async"
        />
      </div>
    </section>
  )
}
