import { useMemo, useState } from 'react'
import { Package, Search } from 'lucide-react'
import SuccessBanner from '../components/ui/SuccessBanner'
import addProductIconUrl from '../assets/Add Product.svg'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProductCard from '../components/dashboard/ProductCard'
import AddProductModal from '../components/dashboard/add-product/AddProductModal'
import EditProductModal from '../components/dashboard/add-product/EditProductModal'
import product1 from '../assets/Product1.png'
import product2 from '../assets/Product2.png'
import product3 from '../assets/Product3.png'

// Cycle through the 3 available product images
const PRODUCT_IMAGES = [product1, product2, product3]

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Leather Messenger Bag',
    price: 5500,
    stockQuantity: 20,
    sold: 12,
    revenue: 40000,
    autoSavePercent: 15,
    paymentUrl: 'pay.budg8it.com/p/leather-messenger-bag',
    image: product1,
  },
  {
    id: '2',
    name: 'Canvas Tote Bag',
    price: 3200,
    stockQuantity: 15,
    sold: 8,
    revenue: 25600,
    autoSavePercent: 20,
    paymentUrl: 'pay.budg8it.com/p/canvas-tote-bag',
    image: product2,
  },
  {
    id: '3',
    name: 'Herbal Face Cream',
    price: 6800,
    stockQuantity: 50,
    sold: 30,
    revenue: 204000,
    autoSavePercent: 10,
    paymentUrl: 'pay.budg8it.com/p/herbal-face-cream',
    image: product3,
  },
  {
    id: '4',
    name: 'Organic Shea Butter (250g)',
    price: 4500,
    stockQuantity: 30,
    sold: 18,
    revenue: 81000,
    autoSavePercent: 15,
    paymentUrl: 'pay.budg8it.com/p/organic-shea-butter',
    image: product1,
  },
  {
    id: '5',
    name: 'Natural Hair Oil (100ml)',
    price: 3200,
    stockQuantity: 25,
    sold: 10,
    revenue: 32000,
    autoSavePercent: 25,
    paymentUrl: 'pay.budg8it.com/p/natural-hair-oil',
    image: product2,
  },
  {
    id: '6',
    name: 'Aloe Vera Gel (200g)',
    price: 2500,
    stockQuantity: 40,
    sold: 22,
    revenue: 55000,
    autoSavePercent: 10,
    paymentUrl: 'pay.budg8it.com/p/aloe-vera-gel',
    image: product3,
  },
  {
    id: '7',
    name: 'Vitamin C Face Serum',
    price: 8500,
    stockQuantity: 12,
    sold: 5,
    revenue: 42500,
    autoSavePercent: 20,
    paymentUrl: 'pay.budg8it.com/p/vitamin-c-serum',
    image: product1,
  },
  {
    id: '8',
    name: 'Coconut Body Lotion',
    price: 4000,
    stockQuantity: 35,
    sold: 16,
    revenue: 64000,
    autoSavePercent: 15,
    paymentUrl: 'pay.budg8it.com/p/coconut-body-lotion',
    image: product2,
  },
]

const footerLinks = [
  'Help Center',
  'Privacy Policy',
  'Privacy Policy',
  'Terms & Conditions',
  '© 2025',
]

export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editProductId, setEditProductId] = useState(null)
  const [showEditToast, setShowEditToast] = useState(false)

  const productToEdit = useMemo(
    () => products.find((p) => p.id === editProductId) ?? null,
    [products, editProductId]
  )

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  )

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [
      {
        ...newProduct,
        id: `p-${Date.now()}`,
        sold: 0,
        revenue: 0,
        // Fall back to a cycling image if the modal didn't provide a blob URL
        image: newProduct.image ?? PRODUCT_IMAGES[prev.length % PRODUCT_IMAGES.length],
      },
      ...prev,
    ])
  }

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleEditProduct = (id) => {
    setEditProductId(id)
  }

  const handleSaveEdit = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    )
    setEditProductId(null)
    setShowEditToast(true)
  }


  const handleManageProduct = (id) => {
    // Future: navigate to product detail page
    console.info('Manage product', id)
  }

  return (
    <DashboardLayout>
      {/* ── Edit success notification ── */}
      <SuccessBanner
        message="Product edited successfully"
        visible={showEditToast}
        onDismiss={() => setShowEditToast(false)}
        className="mb-5"
      />

      {/* ── Page header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Products</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your inventory and generate payment links
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddProductOpen(true)}
          className="flex w-50 cursor-pointer items-center gap-3 rounded-xl bg-[#1A1F4E] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <img src={addProductIconUrl} alt="" width={16} height={16} className="h-4 w-4 object-contain brightness-0 invert" decoding="async" />
          </span>
          Add Product
        </button>
      </div>

      {/* ── Product search bar ── */}
      <div className="mb-6 flex w-full max-w-md items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <Search size={16} className="shrink-0 text-gray-400" aria-hidden />
        <input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-gray-400"
          aria-label="Search products"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="shrink-0 text-xs text-gray-400 transition hover:text-[#0F172A]"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Product grid ── */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onManageProduct={handleManageProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white">
          <Package size={32} className="text-gray-300" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-gray-400">
            {searchQuery ? `No products match "${searchQuery}"` : 'No products yet'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="mt-1 text-sm font-semibold text-[#1A1F4E] transition hover:opacity-70"
            >
              Add your first product →
            </button>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 py-6 sm:gap-6">
        {footerLinks.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="cursor-pointer text-xs text-gray-400 transition hover:text-[#0F172A]"
          >
            {item}
          </span>
        ))}
      </footer>

      {/* ── Add Product Modal ── */}
      <AddProductModal
        open={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={handleProductCreated}
      />

      {/* ── Edit Product Modal ── */}
      <EditProductModal
        open={editProductId !== null}
        product={productToEdit}
        onClose={() => setEditProductId(null)}
        onSave={handleSaveEdit}
      />
    </DashboardLayout>
  )
}
