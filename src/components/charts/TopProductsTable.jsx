import { formatNaira } from '../../utils/formatNaira'

function InventoryBadge({ status }) {
  const isLowStock = status === 'low_stock'
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
        isLowStock
          ? 'border-red-200 bg-red-100 text-red-600'
          : 'border-[#1A1F4E] bg-white text-[#1A1F4E]'
      }`}
    >
      In Stock
    </span>
  )
}

export default function TopProductsTable({ products }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-[15px] font-bold text-[#0F172A]">Top Performing Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="pb-3 font-medium">Product Name</th>
              <th className="pb-3 text-center font-medium">Unit Sold</th>
              <th className="pb-3 text-center font-medium">Revenue</th>
              <th className="pb-3 text-right font-medium">Inventory</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-sm font-bold text-[#0F172A]">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 text-center text-sm text-gray-600">{product.unitsSold}</td>
                <td className="py-4 text-center text-sm font-medium text-[#1A1F4E]">
                  {formatNaira(product.revenue)}
                </td>
                <td className="py-4 text-right">
                  <InventoryBadge status={product.inventoryStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
