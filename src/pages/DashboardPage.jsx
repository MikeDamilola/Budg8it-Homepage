import { useState } from 'react'
import AddProductModal from '../components/dashboard/add-product/AddProductModal'
import GeneratePaymentLink from '../components/dashboard/generate-payment-link/GeneratePaymentLink'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProductsSection from '../components/dashboard/ProductsSection'
import MobileQuickActions from '../components/dashboard/MobileQuickActions'
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
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isGenerateLinkOpen, setIsGenerateLinkOpen] = useState(false)

  const openAddProduct = () => setIsAddProductOpen(true)
  const openGenerateLink = () => setIsGenerateLinkOpen(true)

  const handleCloseAddProduct = () => {
    setIsAddProductOpen(false)
  }

  const handleCloseGenerateLink = () => {
    setIsGenerateLinkOpen(false)
  }

  const handleGenerateLinkProceed = () => {
    setIsGenerateLinkOpen(false)
  }

  return (
    <DashboardLayout onOpenAddProduct={openAddProduct} onOpenGenerateLink={openGenerateLink}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back, Serah</h1>
        <p className="mt-1 text-sm text-gray-400">
          Here&apos;s what&apos;s happening with your store today
        </p>
      </div>

      <StatsRow />
      <MobileQuickActions onAddProduct={openAddProduct} onGenerateLink={openGenerateLink} />
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

      <AddProductModal open={isAddProductOpen} onClose={handleCloseAddProduct} />
      <GeneratePaymentLink
        open={isGenerateLinkOpen}
        onClose={handleCloseGenerateLink}
        onProceed={handleGenerateLinkProceed}
      />
    </DashboardLayout>
  )
}
