import { useState } from 'react'
import AddProductModal from '../components/dashboard/add-product/AddProductModal'
import SetupWalletModal from '../components/dashboard/add-product/SetupWalletModal'
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
  const [isSetupWalletOpen, setIsSetupWalletOpen] = useState(false)
  const [productDraft, setProductDraft] = useState(null)

  const openAddProduct = () => setIsAddProductOpen(true)

  const handleAddProductProceed = (data) => {
    setProductDraft(data)
    setIsAddProductOpen(false)
    setIsSetupWalletOpen(true)
  }

  const handleCloseWalletSetup = () => {
    setIsSetupWalletOpen(false)
    setProductDraft(null)
  }

  return (
    <DashboardLayout onOpenAddProduct={openAddProduct}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back, Serah</h1>
        <p className="mt-1 text-sm text-gray-400">
          Here&apos;s what&apos;s happening with your store today
        </p>
      </div>

      <StatsRow />
      <MobileQuickActions onAddProduct={openAddProduct} />
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

      <AddProductModal
        open={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProceed={handleAddProductProceed}
      />

      <SetupWalletModal
        open={isSetupWalletOpen}
        onClose={handleCloseWalletSetup}
        productName={productDraft?.productName}
      />
    </DashboardLayout>
  )
}
