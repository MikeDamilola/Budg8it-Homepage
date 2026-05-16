import { Zap } from 'lucide-react'
import addProductIconUrl from '../../assets/Add Product.svg'
import generateLinkIconUrl from '../../assets/Generate Link.svg'
import storeLinkIconUrl from '../../assets/Store Link.svg'

const actions = [
  { label: 'Add Product', iconSrc: addProductIconUrl },
  { label: 'Generate Link', iconSrc: generateLinkIconUrl },
  { label: 'Store Link', iconSrc: storeLinkIconUrl },
]

export default function MobileQuickActions({ onAddProduct, onGenerateLink }) {
  return (
    <section className="mb-8 lg:hidden" aria-label="Quick Actions">
      <div className="mx-1 rounded-2xl bg-[#161B40] px-5 py-5">
        <div className="mb-5 flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Quick Actions</h2>
          <Zap size={16} className="text-white" aria-hidden />
        </div>

        <div className="flex items-start justify-between gap-3">
          {actions.map(({ label, iconSrc }) => (
            <button
              key={label}
              type="button"
              onClick={
                label === 'Add Product'
                  ? onAddProduct
                  : label === 'Generate Link'
                    ? onGenerateLink
                    : undefined
              }
              className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-2.5 transition active:opacity-80"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                <img
                  src={iconSrc}
                  alt=""
                  width={24}
                  height={24}
                  decoding="async"
                  className="h-6 w-6 object-contain"
                />
              </span>
              <span className="text-center text-xs font-medium leading-tight text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
