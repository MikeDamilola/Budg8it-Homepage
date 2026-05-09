import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import logoUrl from '../assets/Logo.svg'
import createAccountIconUrl from '../assets/Create account icon.svg'

function scrollToAnchor(id, onDone) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  onDone?.()
}

export default function Navbar({ onOpenModal }) {
  const [activeLink, setActiveLink] = useState('Home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    function onEscape(e) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const navigate = (label, anchorId) => () => {
    setActiveLink(label)
    scrollToAnchor(anchorId, () => setMobileOpen(false))
  }

  const linkClass = (label) =>
    `${activeLink === label ? 'font-bold text-[#0F172A]' : 'font-normal text-gray-400 hover:text-[#0F172A]'} transition focus-visible:ring-2 focus-visible:ring-[#0F172A]/20 focus-visible:ring-offset-2 focus-visible:outline-none rounded-full px-1`

  const handleOpenModal = () => {
    setMobileOpen(false)
    onOpenModal()
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent px-6 py-4">
      <div className="mx-auto max-w-2xl">
        <nav
          className="flex items-center justify-between rounded-full border border-[#0F172A]/10 bg-transparent px-6 py-2.5 shadow-none backdrop-blur-md supports-[backdrop-filter]:bg-white/10"
          aria-label="Primary"
        >
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={logoUrl}
              alt="Budg8it"
              width={108}
              height={36}
              decoding="async"
              className="h-8 w-auto max-w-[min(100%,9rem)] shrink-0 object-contain md:h-9 md:max-w-[10rem]"
            />
          </div>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <button
              type="button"
              className={`${linkClass('Home')} cursor-pointer`}
              onClick={navigate('Home', 'home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`${linkClass('Features')} cursor-pointer`}
              onClick={navigate('Features', 'features')}
            >
              Features
            </button>
            <button
              type="button"
              className={`${linkClass('Contact Us')} cursor-pointer`}
              onClick={navigate('Contact Us', 'contact')}
            >
              Contact Us
            </button>
          </div>

          <div className="hidden md:block">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#192250] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#192250]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={handleOpenModal}
            >
              Create Account
              <img
                src={createAccountIconUrl}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 shrink-0 object-contain"
                aria-hidden
              />
            </button>
          </div>

          <button
            type="button"
            className="flex rounded-full p-2 text-[#0F172A] transition hover:bg-[#0F172A]/5 focus-visible:ring-2 focus-visible:ring-[#0F172A]/20 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {mobileOpen ? (
          <div className="mt-2 rounded-2xl bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-1 text-sm">
              <button
                type="button"
                className={`${linkClass('Home')} rounded-xl py-3 text-left`}
                onClick={navigate('Home', 'home')}
              >
                Home
              </button>
              <button
                type="button"
                className={`${linkClass('Features')} rounded-xl py-3 text-left`}
                onClick={navigate('Features', 'features')}
              >
                Features
              </button>
              <button
                type="button"
                className={`${linkClass('Contact Us')} rounded-xl py-3 text-left`}
                onClick={navigate('Contact Us', 'contact')}
              >
                Contact Us
              </button>
            </div>
            <button
              type="button"
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#192250] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#192250]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={handleOpenModal}
            >
              Create Account
              <img
                src={createAccountIconUrl}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 shrink-0 object-contain"
                aria-hidden
              />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
