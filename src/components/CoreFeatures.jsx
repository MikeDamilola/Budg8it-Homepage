function PaymentIcon() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute bottom-1 left-3 h-3 w-10 rounded-full bg-black/10 blur-sm" aria-hidden />
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <rect x="20" y="8" width="30" height="20" rx="5" fill="#26A69A" transform="rotate(8 35 18)" />
        <rect x="23" y="15" width="24" height="4" rx="2" fill="#00796B" transform="rotate(8 35 18)" />
        <rect x="8" y="28" width="36" height="10" rx="4" fill="#7E57C2" />
        <circle cx="51" cy="30" r="5" fill="#FFD54F" />
        <path d="M17 47c4-6 10-8 16-7 4 1 8 4 11 8-9 5-18 6-27-1Z" fill="#FFAB91" />
      </svg>
    </div>
  )
}

function WalletIcon() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/60" />
      <div className="absolute bottom-1 left-3 h-3 w-10 rounded-full bg-black/10 blur-sm" aria-hidden />
      <svg viewBox="0 0 64 64" className="relative h-16 w-16" aria-hidden>
        <g transform="rotate(-10 32 32)">
          <rect x="10" y="22" width="44" height="24" rx="7" fill="#00796B" />
          <rect x="14" y="25" width="36" height="11" rx="5" fill="#4DB6AC" />
          <circle cx="46" cy="20" r="6" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  )
}

function WithdrawalIcon() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute bottom-1 left-3 h-3 w-10 rounded-full bg-black/10 blur-sm" aria-hidden />
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <g transform="translate(13 14) rotate(-5 18 18)">
          <rect x="0" y="0" width="22" height="36" rx="5" fill="#43A047" />
          <rect x="4" y="4" width="14" height="26" rx="2" fill="#B9F6CA" opacity="0.4" />
        </g>
        <g transform="translate(28 10) rotate(10 11 18)">
          <rect x="0" y="0" width="22" height="36" rx="5" fill="#CDDC39" />
          <rect x="4" y="4" width="14" height="26" rx="2" fill="#FFFFFF" opacity="0.35" />
        </g>
        <circle cx="32" cy="35" r="6" fill="#FFD700" />
        <circle cx="30" cy="33" r="1.7" fill="#FFF4B5" />
      </svg>
    </div>
  )
}

const features = [
  {
    title: 'Create Payment Links Instantly',
    body: 'Share a unique link via WhatsApp, Instagram, SMS, or anywhere and receive payments without stress.',
    icon: PaymentIcon,
  },
  {
    title: 'Smart Wallet Savings',
    body: 'Every deposit goes straight to your secure wallet, with the option to save automatically.',
    icon: WalletIcon,
  },
  {
    title: 'Easy Withdrawals',
    body: 'Cash out to your bank anytime with smooth, fast processing.',
    icon: WithdrawalIcon,
  },
]

export default function CoreFeatures() {
  return (
    <section id="features" className="bg-white px-6 py-20 sm:px-10 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-3xl font-extrabold text-[#0F172A]">Core Features</h2>
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3 md:gap-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className={`flex flex-col items-start gap-4 ${index < 2 ? 'md:border-r md:border-gray-100 md:pr-16' : ''}`}
              >
                <Icon />
                <h3 className="mt-2 text-xl font-bold text-[#0F172A]">{feature.title}</h3>
                <p className="mt-2 max-w-xs text-base leading-relaxed text-gray-500">{feature.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
