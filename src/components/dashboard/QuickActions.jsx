import { Link as LinkIcon, ShoppingCart } from 'lucide-react'

export default function QuickActions({ onAddProduct }) {
  return (
    <div className="mt-14 w-full">
      <h2 className="mb-1.5 px-5 text-base font-bold leading-tight text-[#0F172A]">Quick Actions</h2>
      <div className="flex min-h-[152px] w-full flex-col justify-center gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={onAddProduct}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#0F172A] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <ShoppingCart size={16} className="text-white" />
          </span>
          Add Product
        </button>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <LinkIcon size={16} className="text-[#0F172A]" />
          </span>
          Generate Link
        </button>
      </div>
    </div>
  )
}
