import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import slideshow1Url from '../../assets/Slideshow1.svg'
import slideshow2Url from '../../assets/Slideshow2.svg'
import slideshow3Url from '../../assets/Slideshow3.svg'
import slideshow4Url from '../../assets/Slideshow4.svg'

const slides = [
  {
    image: slideshow1Url,
    title: 'Get Started',
    subtitle: 'Create an account and start managing your products today.',
  },
  {
    image: slideshow2Url,
    title: 'Generate Payment Links Easily',
    subtitle: 'Share a unique link with anyone and get paid without stress fast, simple, and secure.',
  },
  {
    image: slideshow3Url,
    title: 'Build Savings Effortlessly',
    subtitle: 'Automatically save from every deposit or payment you receive. Grow your wallet balance seamlessly.',
  },
  {
    image: slideshow4Url,
    title: 'Monitor Your Wallet & Transactions',
    subtitle: 'Stay in control with real-time balance updates, payment history, and smart money insights.',
  },
]

export default function SlideShow() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goToNext = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
      setIsAnimating(false)
    }, 300)
  }, [isAnimating])

  const goToPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
      setIsAnimating(false)
    }, 300)
  }

  useEffect(() => {
    const timer = setInterval(goToNext, 4000)
    return () => clearInterval(timer)
  }, [current, goToNext])

  return (
    <div className="-mt-32 w-full px-10">
      <div
        className="mb-8 flex h-[280px] w-full items-center justify-center transition-all duration-300 ease-in-out"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateX(20px)' : 'translateX(0)',
        }}
      >
        <img
          src={slides[current].image}
          alt={slides[current].title}
          width={280}
          height={220}
          className="h-[220px] w-[280px] object-contain"
          decoding="async"
        />
      </div>

      <h2
        className="mt-4 text-center text-2xl font-bold text-[#0F172A] transition-all duration-300 ease-in-out"
        style={{ opacity: isAnimating ? 0 : 1 }}
      >
        {slides[current].title}
      </h2>

      <p
        className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-gray-400 transition-all duration-300 ease-in-out"
        style={{ opacity: isAnimating ? 0 : 1 }}
      >
        {slides[current].subtitle}
      </p>

      <div className="mx-auto mt-8 flex w-full max-w-xs items-center justify-between">
        <button
          type="button"
          onClick={goToPrev}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-gray-400 hover:text-gray-600"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                current === i ? 'h-3 w-3 bg-[#0F172A]' : 'h-2 w-2 bg-gray-300'
              }`}
              aria-label={`Go to ${slide.title}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNext}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-gray-400 hover:text-gray-600"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
