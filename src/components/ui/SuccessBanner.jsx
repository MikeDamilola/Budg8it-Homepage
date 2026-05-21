/**
 * SuccessBanner — reusable success notification banner.
 *
 * Usage:
 *   const [show, setShow] = useState(false)
 *
 *   // trigger after a successful action
 *   setShow(true)
 *
 *   <SuccessBanner
 *     message="Product edited successfully"
 *     visible={show}
 *     onDismiss={() => setShow(false)}
 *   />
 *
 * Props:
 *   message       string   — text to display (default: "Saved successfully")
 *   visible       boolean  — controls visibility
 *   onDismiss     () => void — called when X is clicked or auto-dismiss fires
 *   autoDismissMs number   — ms before auto-dismiss (default 4500, pass 0 to disable)
 *   className     string   — extra Tailwind classes on the root element
 */

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

export default function SuccessBanner({
  message = 'Saved successfully',
  visible = false,
  onDismiss,
  autoDismissMs = 4500,
  className = '',
}) {
  const timerRef = useRef(null)

  // Auto-dismiss
  useEffect(() => {
    if (!visible || autoDismissMs === 0) return undefined
    timerRef.current = window.setTimeout(() => onDismiss?.(), autoDismissMs)
    return () => window.clearTimeout(timerRef.current)
  }, [visible, autoDismissMs, onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="success-banner"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={[
            'flex w-full items-center gap-3',
            'rounded-xl border border-green-400 bg-white',
            'px-4 py-3.5 shadow-sm',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Icon */}
          <CheckCircle2
            size={18}
            className="shrink-0 text-green-500"
            strokeWidth={2}
            aria-hidden
          />

          {/* Message */}
          <p className="flex-1 text-sm font-medium text-slate-600">
            {message}
          </p>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => {
              window.clearTimeout(timerRef.current)
              onDismiss?.()
            }}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
          >
            <X size={14} strokeWidth={2.5} aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
