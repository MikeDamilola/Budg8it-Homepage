import core1Url from '../assets/Core 1.svg'
import core2Url from '../assets/Core 2.svg'
import core3Url from '../assets/Core 3.svg'

const features = [
  {
    title: 'Create Payment Links Instantly',
    body: 'Share a unique link via WhatsApp, Instagram, SMS, or anywhere and receive payments without stress.',
    icon: core1Url,
  },
  {
    title: 'Smart Wallet Savings',
    body: 'Every deposit goes straight to your secure wallet, with the option to save automatically.',
    icon: core2Url,
  },
  {
    title: 'Easy Withdrawals',
    body: 'Cash out to your bank anytime with smooth, fast processing.',
    icon: core3Url,
  },
]

export default function CoreFeatures() {
  return (
    <section id="features" className="bg-white px-6 py-20 sm:px-10 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-3xl font-semibold text-[#0F172A]">Core Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-stretch md:gap-8 lg:gap-10">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex h-full min-h-0 flex-col items-start gap-4 rounded-2xl border border-gray-100/90 bg-white p-6 shadow-md shadow-gray-900/5 sm:p-8"
            >
              <img
                src={feature.icon}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 object-contain object-left"
                decoding="async"
                aria-hidden
              />
              <h3 className="text-lg font-bold text-[#0F172A]">{feature.title}</h3>
              <p className="max-w-xs flex-1 text-base leading-relaxed text-gray-500">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
