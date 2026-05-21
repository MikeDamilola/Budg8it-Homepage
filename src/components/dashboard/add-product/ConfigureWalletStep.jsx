import { useEffect, useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
export default function ConfigureWalletStep({
  onProceed,
  initialAutoSavePercent = 40,
}) {
  const titleId = useId()
  const sliderId = useId()
  const [autoSavePercent, setAutoSavePercent] = useState(initialAutoSavePercent ?? 40)

  const withdrawable = 100 - autoSavePercent

  useEffect(() => {
    setAutoSavePercent(initialAutoSavePercent ?? 40)
  }, [initialAutoSavePercent])

  return (
    <div className="box-border w-full min-w-0 max-w-full overflow-x-hidden px-5 pb-6 pt-2 sm:px-7 sm:pb-7 sm:pt-3">
      <h2 id={titleId} className="text-xl font-bold text-[#0F172A] sm:text-[1.35rem]">
        Configure Your Wallet
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        Set the percentage of sales to be automatically moved to your savings wallet.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={sliderId} className="text-sm font-medium text-[#0F172A]">
              Auto-save Percentage
            </label>
            <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-sm font-semibold text-[#0F172A]">
              {autoSavePercent}%
            </span>
          </div>

          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={autoSavePercent}
            onChange={(event) => setAutoSavePercent(Number(event.target.value))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={autoSavePercent}
            className="configure-wallet-slider mt-4 h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
            style={{
              background: `linear-gradient(to right, #0F172A 0%, #0F172A ${autoSavePercent}%, #E5E7EB ${autoSavePercent}%, #E5E7EB 100%)`,
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#E8F5E9] px-4 py-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
              Withdrawable
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">{withdrawable}%</p>
          </div>
          <div className="rounded-xl bg-[#EEF0FB] px-4 py-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
              Auto-invest
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">{autoSavePercent}%</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onProceed?.(autoSavePercent)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/40"
        >
          Proceed To Review
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  )
}
