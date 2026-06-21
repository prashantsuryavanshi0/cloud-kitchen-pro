import { motion } from 'framer-motion'
import { ArrowRight, CreditCard } from 'lucide-react'

const parseAmount = (price) => Number(price.replace(/[^0-9.]/g, ''))

export default function MiniCheckoutDrawer({ open, onClose, items, onCheckout }) {
  const total = items.reduce((sum, item) => sum + parseAmount(item.price), 0)
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: open ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl md:max-w-2xl md:mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Quick checkout</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Ready to order?</h2>
        </div>
        <button onClick={onClose} className="rounded-full border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10">
          Close
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
            <p className="text-sm font-semibold text-white">{item.price}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-4">
        <div>
          <p className="text-sm text-slate-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-white">Rs. {total.toFixed(2)}</p>
        </div>
        <button onClick={onCheckout} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-darkbg shadow-soft">
          Checkout <CreditCard size={18} />
        </button>
      </div>
      <div className="mt-6 text-center text-sm text-slate-400">Swipe up or tap Close to hide this drawer.</div>
    </motion.div>
  )
}
