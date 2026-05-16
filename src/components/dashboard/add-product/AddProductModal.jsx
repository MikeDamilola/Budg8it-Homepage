import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import AddProductStep from './AddProductStep'
import ConfigureWalletStep from './ConfigureWalletStep'
import ProductFlowStepper from './ProductFlowStepper'
import ProductLiveStep from './ProductLiveStep'
import { buildPaymentUrl } from './buildPaymentUrl'

const slideTransition = { duration: 0.4, ease: [0.32, 0.72, 0, 1] }

export default function AddProductModal({ open, onClose }) {
  const closeButtonRef = useRef(null)
  const [step, setStep] = useState(1)
  const [productDraft, setProductDraft] = useState(null)

  const paymentUrl = useMemo(
    () => buildPaymentUrl(productDraft?.productName),
    [productDraft?.productName]
  )

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setStep(1)
    setProductDraft(null)
  }, [open])

  const handleAddProductProceed = (data) => {
    setProductDraft((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleBackToAddProduct = () => {
    setStep(1)
  }

  const handleWalletProceed = (autoSavePercent) => {
    setProductDraft((prev) => ({ ...prev, autoSavePercent }))
    setStep(3)
  }

  const handleDone = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close add product flow"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Add product"
            className="relative flex max-h-[95vh] w-full max-w-[500px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {step !== 3 && (
              <>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-30 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 sm:right-4 sm:top-4"
                >
                  <X size={20} />
                </button>

                <div className="relative z-10 shrink-0 px-5 pb-3 pt-3 sm:px-7 sm:pb-4">
                  <div className="pt-10 pr-8 sm:pt-11 sm:pr-10">
                    <ProductFlowStepper
                      currentStep={step}
                      onStepClick={
                        step === 2
                          ? (stepId) => {
                              if (stepId === 1) handleBackToAddProduct()
                            }
                          : undefined
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div className="min-h-0 flex-1 overflow-hidden">
              <motion.div
                className="flex h-full"
                animate={{ x: `-${(step - 1) * 100}%` }}
                transition={slideTransition}
              >
                <div className="h-full w-full shrink-0 overflow-y-auto">
                  <AddProductStep onProceed={handleAddProductProceed} />
                </div>

                <div className="h-full w-full shrink-0 overflow-y-auto">
                  <ConfigureWalletStep
                    onProceed={handleWalletProceed}
                    initialAutoSavePercent={productDraft?.autoSavePercent}
                  />
                </div>

                <div className="h-full w-full shrink-0 overflow-y-auto">
                  <ProductLiveStep paymentUrl={paymentUrl} onDone={handleDone} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
