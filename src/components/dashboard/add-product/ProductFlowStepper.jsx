import addProductIconUrl from '../../../assets/Add Product.svg'
import linkIconUrl from '../../../assets/Link.svg'
import walletIconUrl from '../../../assets/Wallet.svg'

const steps = [
  { id: 1, label: 'Add Product', iconSrc: addProductIconUrl, variant: 'add-product' },
  { id: 2, label: 'Set Up Wallet', iconSrc: walletIconUrl, variant: 'wallet' },
  { id: 3, label: 'Payment Link', iconSrc: linkIconUrl, variant: 'link' },
]

function getStepIconClassName(variant, isComplete) {
  const base = 'h-3.5 w-3.5 object-contain'

  if (isComplete) {
    return variant === 'add-product' ? base : `${base} brightness-0 invert`
  }

  return variant === 'add-product' ? `${base} brightness-0` : base
}

export default function ProductFlowStepper({ currentStep = 1, onStepClick }) {
  return (
    <div
      className="w-full rounded-xl bg-[#F5F6FA] px-3 py-3.5 sm:px-4 sm:py-4"
      aria-label={`Step ${currentStep} of 3`}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        {steps.map((step) => {
          const isComplete = step.id < currentStep
          const isActive = step.id === currentStep
          const isNavigable = isComplete && typeof onStepClick === 'function'

          const stepContent = (
            <>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isComplete
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <img
                    src={step.iconSrc}
                    alt=""
                    width={14}
                    height={14}
                    decoding="async"
                    className={getStepIconClassName(step.variant, isComplete)}
                  />
                </div>
                <span className="truncate text-[11px] font-medium leading-tight text-[#0F172A] sm:text-xs">
                  {step.label}
                </span>
              </div>

              <div className="mt-2.5 flex h-1 w-full items-end">
                {isComplete ? (
                  <span className="sr-only">Completed</span>
                ) : (
                  <div
                    className={`w-full rounded-full ${
                      isActive ? 'h-1 bg-[#0F172A]' : 'h-px bg-gray-300'
                    }`}
                    aria-hidden={!isActive}
                  />
                )}
              </div>
            </>
          )

          return (
            <div
              key={step.id}
              className="flex min-w-0 flex-1 flex-col"
              aria-current={isActive ? 'step' : undefined}
            >
              {isNavigable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className="flex w-full min-w-0 flex-col rounded-lg text-left transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/25"
                  aria-label={`Go back to ${step.label}`}
                >
                  {stepContent}
                </button>
              ) : (
                stepContent
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
