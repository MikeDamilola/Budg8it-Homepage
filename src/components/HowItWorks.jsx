import { BadgeDollarSign, Link, UserCheck } from 'lucide-react'
import HowItWorks1 from '../assets/HowItWorks1.png'
import HowItWorks2 from '../assets/HowItWorks2.jpg'
import HowItWorks3 from '../assets/HowItWorks3.jpg'

const steps = [
  {
    icon: <UserCheck size={24} strokeWidth={1.8} className="text-[#0F172A]" />,
    title: 'Sign Up & Verify',
    body: 'Sign up and generate payment links, receive payments, and manage your wallets seamlessly.',
    image: HowItWorks1,
  },
  {
    icon: <Link size={24} strokeWidth={1.8} className="text-[#0F172A]" />,
    title: 'Generate Payment Links',
    body: 'Create a secure payment link in seconds and share it with anyone. Receive payments instantly without complicated processes.',
    image: HowItWorks2,
  },
  {
    icon: <BadgeDollarSign size={24} strokeWidth={1.8} className="text-[#0F172A]" />,
    title: 'Receive Money Instantly',
    body: 'Get paid directly into your wallet instantly. Track incoming funds and manage your money effortlessly in one place.',
    image: HowItWorks3,
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="overflow-hidden bg-white px-6 pt-20 pb-0 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-3xl font-semibold text-[#0F172A]">How it Works</h2>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 pt-8 pb-0 shadow-md"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#E8E4F8] to-[#FEF9C3] shadow-sm">
                {step.icon}
              </div>

              <h3 className="mb-4 text-2xl leading-tight font-semibold text-[#0F172A]">{step.title}</h3>

              <p className="mb-4 text-md leading-relaxed text-gray-400">{step.body}</p>

              <div className="mt-2">
                <img
                  src={step.image}
                  alt={`${step.title} mockup`}
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
