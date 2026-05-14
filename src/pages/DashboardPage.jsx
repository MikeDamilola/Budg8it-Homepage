import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProductsSection from '../components/dashboard/ProductsSection'
import StatsRow from '../components/dashboard/StatsRow'
import WalletsSection from '../components/dashboard/WalletsSection'

const footerItems = [
  'Help Center',
  'Privacy Policy',
  'Privacy Policy',
  'Terms & Conditions',
  '© 2025',
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back, Serah</h1>
        <p className="mt-1 text-sm text-gray-400">
          Here&apos;s what&apos;s happening with your store today
        </p>
      </div>

      <StatsRow />
      <WalletsSection />
      <ProductsSection />

      <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 py-6 sm:gap-6">
        {footerItems.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="cursor-pointer text-xs text-gray-400 transition hover:text-[#0F172A]"
          >
            {item}
          </span>
        ))}
      </footer>
    </DashboardLayout>
  )
}
