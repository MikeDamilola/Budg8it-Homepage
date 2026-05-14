import { Link as LinkIcon, ShoppingCart } from 'lucide-react'

export default function QuickActions() {
  return (
    <div>
      <h2 className="mb-4 text-base font-bold text-[#0F172A]">Quick Actions</h2>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
            <ShoppingCart size={16} className="text-white" />
          </span>
          Add Product
        </button>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
            <LinkIcon size={16} className="text-[#0F172A]" />
          </span>
          Generate Link
        </button>
      </div>
    </div>
  )
}
