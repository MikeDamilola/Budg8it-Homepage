import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, CloudUpload, Search, X } from 'lucide-react'

const inputClassName =
  'box-border w-full max-w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10'

const readOnlyInputClassName =
  'cursor-default bg-gray-50 text-gray-400'

const ACCEPTED_EXTENSIONS = 'JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT'

export default function LinkProductsSection({
  existingProducts = [],
  onProductData,
}) {
  const fileInputRef = useRef(null)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [productName, setProductName] = useState('')
  const [priceDisplay, setPriceDisplay] = useState('0.00')
  const [price, setPrice] = useState(0)
  const [stockQuantity, setStockQuantity] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Filter existing products as the user types
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    const results = existingProducts.filter((p) =>
      p.name.toLowerCase().includes(q)
    )
    setSearchResults(results)
    setShowDropdown(results.length > 0)
  }, [searchQuery, existingProducts])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        !searchRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Clean up object URL on unmount / change
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  // Propagate data upward whenever any field changes
  useEffect(() => {
    onProductData?.({
      productId: selectedProduct?.id,
      productName,
      price,
      stockQuantity: stockQuantity === '' ? 0 : Number(stockQuantity),
      imageFile,
      isExisting: !!selectedProduct,
    })
  }, [selectedProduct, productName, price, stockQuantity, imageFile, onProductData])

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setProductName(product.name)
    setPriceDisplay(product.price.toFixed(2))
    setPrice(product.price)
    setStockQuantity(String(product.stockQuantity))
    setSearchQuery(product.name)
    setShowDropdown(false)
  }

  const handleClearSelection = () => {
    setSelectedProduct(null)
    setProductName('')
    setPriceDisplay('0.00')
    setPrice(0)
    setStockQuantity('')
    setSearchQuery('')
  }

  const handleFile = useCallback((file) => {
    if (!file) return
    setImageFile(file)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }, [])

  const removeImage = () => {
    setImageFile(null)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isLocked = !!selectedProduct

  return (
    <div className="space-y-4 pt-4">
      {/* Search bar */}
      <div className="relative min-w-0" ref={searchRef}>
        <div
          className="flex min-w-0 items-center overflow-hidden rounded-full border border-gray-200 bg-white px-3.5 py-2.5 transition focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10"
        >
          <Search size={16} className="mr-2.5 shrink-0 text-gray-400" aria-hidden />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true)
            }}
            placeholder="Search for products"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="ml-2 shrink-0 text-gray-400 transition hover:text-[#0F172A]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            {searchResults.map((product) => (
              <button
                key={product.id}
                type="button"
                onMouseDown={() => handleSelectProduct(product)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-[#0F172A]">{product.name}</span>
                <span className="ml-3 shrink-0 text-xs text-gray-500">
                  ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Name */}
      <div className="min-w-0">
        <div className="mb-1.5 flex min-w-0 items-center gap-2">
          <label htmlFor="lps-productName" className="text-sm font-medium text-[#0F172A]">
            Product Name
          </label>
          {isLocked && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 size={11} strokeWidth={2.5} aria-hidden />
              Existing Product
            </span>
          )}
        </div>
        <input
          id="lps-productName"
          type="text"
          value={productName}
          readOnly={isLocked}
          onChange={(e) => {
            if (isLocked) return
            setProductName(e.target.value)
          }}
          placeholder="e.g Organic Shea Butter (250g)"
          className={`${inputClassName} ${isLocked ? readOnlyInputClassName : ''}`}
        />
      </div>

      {/* Price + Stock Quantity */}
      <div className="grid min-w-0 grid-cols-2 gap-3">
        {/* Price */}
        <div className="min-w-0">
          <label htmlFor="lps-price" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
            Price (₦)
          </label>
          <div
            className={`flex min-w-0 overflow-hidden rounded-xl border border-gray-200 transition focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-[#0F172A]/10 ${
              isLocked ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <span className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500">
              ₦
            </span>
            <input
              id="lps-price"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={priceDisplay}
              readOnly={isLocked}
              onChange={(e) => {
                if (isLocked) return
                const raw = e.target.value.replace(/[^\d.]/g, '')
                setPriceDisplay(raw)
                const parsed = parseFloat(raw)
                setPrice(Number.isNaN(parsed) ? 0 : parsed)
              }}
              onBlur={() => {
                if (isLocked) return
                const parsed = parseFloat(priceDisplay)
                const val = Number.isNaN(parsed) ? 0 : parsed
                setPrice(val)
                setPriceDisplay(val.toFixed(2))
              }}
              className={`min-w-0 flex-1 px-3 py-3 text-sm focus:outline-none ${
                isLocked
                  ? 'cursor-default bg-gray-50 text-gray-400'
                  : 'bg-white text-[#0F172A]'
              }`}
            />
          </div>
        </div>

        {/* Stock Quantity */}
        <div className="min-w-0">
          <label
            htmlFor="lps-stockQuantity"
            className="mb-1.5 block text-sm font-medium text-[#0F172A]"
          >
            Stocks Quantity
          </label>
          <input
            id="lps-stockQuantity"
            type="number"
            min={0}
            step={1}
            value={stockQuantity}
            readOnly={isLocked}
            onChange={(e) => {
              if (isLocked) return
              setStockQuantity(e.target.value)
            }}
            placeholder="E.g 20"
            className={`${inputClassName} ${isLocked ? readOnlyInputClassName : ''}`}
          />
        </div>
      </div>

      {/* Upload Image */}
      <div className="min-w-0">
        <span className="mb-1.5 block text-sm font-medium text-[#0F172A]">Upload Image</span>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragOver(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative box-border flex min-h-[160px] w-full max-w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
            isDragOver
              ? 'border-[#1A1F4E] bg-[#1A1F4E]/5'
              : 'border-slate-300 bg-gray-50/40 hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />

          {imagePreview ? (
            <div className="relative max-w-full px-2">
              <img
                src={imagePreview}
                alt="Product preview"
                className="mx-auto max-h-28 max-w-full rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-md transition hover:bg-[#1e293b]"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
              {imageFile && (
                <p className="mt-2 max-w-[180px] truncate text-xs text-gray-500">
                  {imageFile.name}
                </p>
              )}
            </div>
          ) : (
            <>
              <CloudUpload
                size={38}
                className="mb-3 text-slate-400"
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="break-words px-1 text-sm text-gray-600">
                <span className="font-semibold text-[#0F172A]">Drag & drop file</span> or{' '}
                <button
                  type="button"
                  style={{ color: '#2DD4BF' }}
                  className="font-semibold underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Browse
                </button>
              </p>
              <p className="mt-2 break-words text-[11px] text-gray-400">
                Supported formats: {ACCEPTED_EXTENSIONS}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
