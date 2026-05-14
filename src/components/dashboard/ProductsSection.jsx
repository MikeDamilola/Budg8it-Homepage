import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Copy,
  Link as LinkIcon,
  MoreVertical,
  ShoppingCart,
} from 'lucide-react'
import product1 from '../../assets/HowItWorks1.png'
import product2 from '../../assets/HowItWorks2.jpg'
import product3 from '../../assets/HowItWorks3.jpg'

const products = [
  {
    image: product1,
    badge: '15% auto-save',
    name: 'Leather Messenger Bag',
    price: '₦5,500.00',
    stock: '20 In Stock',
    sold: 12,
    revenue: '₦40,000',
  },
  {
    image: product2,
    badge: '15% auto-save',
    name: 'Leather Messenger Bag',
    price: '₦5,500.00',
    stock: '20 In Stock',
    sold: 12,
    revenue: '₦40,000',
  },
  {
    image: product3,
    badge: '15% auto-save',
    name: 'Leather Messenger Bag',
    price: '₦5,500.00',
    stock: '20 In Stock',
    sold: 12,
    revenue: '₦40,000',
  },
]

export default function ProductsSection() {
  const [openMenu, setOpenMenu] = useState(null)

  useEffect(() => {
    if (openMenu === null) return
    function handleMouseDown(e) {
      const root = e.target.closest?.('[data-product-dropdown-root]')
      if (!root) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openMenu])

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0F172A]">Your Products</h2>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="relative h-[200px] w-full bg-gray-200">
              <img src={product.image} alt="" className="h-full w-full object-cover" />

              <span className="absolute top-3 left-3 rounded-lg bg-[#0F172A] px-2.5 py-1 text-xs font-semibold text-white">
                {product.badge}
              </span>

              <div className="absolute top-3 right-3 z-10" data-product-dropdown-root>
                <button
                  type="button"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/80"
                  onClick={() => setOpenMenu(openMenu === index ? null : index)}
                  aria-expanded={openMenu === index}
                  aria-label="Product menu"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
                {openMenu === index ? (
                  <div className="absolute top-10 right-0 z-20 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setOpenMenu(null)}
                    >
                      <Copy size={14} />
                      Copy Link
                    </button>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      onClick={() => setOpenMenu(null)}
                    >
                      <LinkIcon size={14} />
                      Payment Link
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-bold text-[#0F172A]">{product.name}</h3>
                <MoreVertical size={16} className="flex-shrink-0 text-gray-400" aria-hidden />
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-base font-bold text-[#0F172A]">{product.price}</span>
                <div className="flex items-center gap-1">
                  <ShoppingCart size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{product.stock}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 border-t border-gray-100 pt-2">
                <span className="text-xs font-medium text-gray-500">Sold: {product.sold}</span>
                <span className="text-gray-200">|</span>
                <span className="text-xs text-gray-500">Revenue: {product.revenue}</span>
              </div>

              <button
                type="button"
                className="mt-3 w-full cursor-pointer rounded-xl bg-[#0F172A] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Manage Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
