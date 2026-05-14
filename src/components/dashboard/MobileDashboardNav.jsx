import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoUrl from '../../assets/Logo.svg'
import { dashboardNavItems } from './dashboardNavItems'

export default function MobileDashboardNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const active = useMemo(() => {
    const match = dashboardNavItems.find((item) => item.href === pathname)
    return match?.label ?? 'Dashboard'
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const go = (href) => {
    navigate(href)
    setOpen(false)
  }

  return (
    <>
      <div className="mb-4 flex items-center md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-[#0F172A] shadow-sm transition hover:bg-gray-50"
          aria-expanded={open}
          aria-label="Open navigation menu"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      </div>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              />
              <div className="absolute left-0 top-0 flex h-full w-[min(280px,88vw)] max-w-full flex-col border-r border-gray-100 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                  <img
                    src={logoUrl}
                    alt="Budg8it"
                    width={108}
                    height={36}
                    decoding="async"
                    className="h-8 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#0F172A]"
                    aria-label="Close navigation"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-0 py-3">
                  {dashboardNavItems.map((item) => {
                    const isActive = active === item.label
                    const iconClass =
                      item.iconTone === 'light'
                        ? isActive
                          ? 'h-5 w-5 shrink-0 object-contain'
                          : 'h-5 w-5 shrink-0 object-contain brightness-0 opacity-60'
                        : isActive
                          ? 'h-5 w-5 shrink-0 object-contain brightness-0 invert'
                          : 'h-5 w-5 shrink-0 object-contain opacity-70'
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => go(item.href)}
                        className={`mx-3 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#192250] text-white'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F172A]'
                        }`}
                      >
                        <img
                          src={item.iconSrc}
                          alt=""
                          className={iconClass}
                          width={20}
                          height={20}
                          decoding="async"
                        />
                        {item.label}
                      </button>
                    )
                  })}
                </nav>

                <button
                  type="button"
                  className="cursor-pointer border-t border-gray-100 px-6 py-4 text-left text-xs text-gray-400 transition hover:bg-gray-50 hover:text-[#0F172A]"
                >
                  Help Center
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
