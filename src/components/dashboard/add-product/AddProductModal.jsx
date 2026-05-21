import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import AddProductStep from './AddProductStep'
import ConfigureWalletStep from './ConfigureWalletStep'
import ProductFlowStepper from './ProductFlowStepper'
import ProductLiveStep from './ProductLiveStep'
import { buildPaymentUrl } from './buildPaymentUrl'

const STEP_TRANSITION = { duration: 0.28, ease: [0.22, 1, 0.36, 1] }

export default function AddProductModal({ open, onClose, onProductCreated }) {
  const closeButtonRef = useRef(null)
  const scrollRef = useRef(null)
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
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
    setDirection(1)
    setProductDraft(null)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [step])

  const goForward = (nextStep, updater) => {
    setDirection(1)
    if (updater) setProductDraft((prev) => ({ ...prev, ...updater }))
    setStep(nextStep)
  }

  const goBack = (prevStep) => {
    setDirection(-1)
    setStep(prevStep)
  }

  const handleAddProductProceed = (data) => goForward(2, data)
  const handleBackToAddProduct = () => goBack(1)
  const handleWalletProceed = (autoSavePercent) => goForward(3, { autoSavePercent })

  const handleDone = () => {
    if (productDraft) {
      onProductCreated?.({
        name: productDraft.productName ?? 'New Product',
        price: productDraft.price ?? 0,
        stockQuantity: productDraft.stocksQuantity ?? 0,
        autoSavePercent: productDraft.autoSavePercent ?? 40,
        paymentUrl: paymentUrl,
        // Create a temporary blob URL from the uploaded File so the grid can preview it
        image: productDraft.image instanceof File
          ? URL.createObjectURL(productDraft.image)
          : null,
      })
    }
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
            className="relative flex h-[min(92dvh,95vh)] max-h-[min(95dvh,95vh)] w-full max-w-[500px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Stepper header — always visible across all steps */}
            <div className="relative z-10 shrink-0 px-5 pb-3 pt-3 sm:px-7 sm:pb-4">
              {/* Close (X) button — only on steps 1 and 2; step 3 uses the Done button */}
              {step !== 3 && (
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-30 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 sm:right-4 sm:top-4"
                >
                  <X size={20} />
                </button>
              )}
              <div className={step !== 3 ? 'pt-10 pr-8 sm:pt-11 sm:pr-10' : 'pt-2'}>
                <ProductFlowStepper
                  currentStep={step}
                  onStepClick={
                    step === 2
                      ? (stepId) => { if (stepId === 1) handleBackToAddProduct() }
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Single-step view: only the active step is mounted */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            >
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
                    center: { opacity: 1, x: 0 },
                    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={STEP_TRANSITION}
                  className="w-full"
                >
                  {step === 1 && (
                    <AddProductStep onProceed={handleAddProductProceed} />
                  )}
                  {step === 2 && (
                    <ConfigureWalletStep
                      onProceed={handleWalletProceed}
                      initialAutoSavePercent={productDraft?.autoSavePercent}
                    />
                  )}
                  {step === 3 && (
                    <ProductLiveStep paymentUrl={paymentUrl} onDone={handleDone} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
