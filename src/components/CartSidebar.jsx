import { motion } from 'framer-motion'
import { CheckCircle2, CreditCard, Package, X } from 'lucide-react'

const parseAmount = (price) => Number(price.replace(/[^0-9.]/g, ''))

export default function CartSidebar({ open, onClose, cartItems, onRemove, onCheckout }) {
  const subtotal = cartItems.reduce((sum, item) => sum + parseAmount(item.price), 0)

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: open ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 190, damping: 22 }}
      className="cart-drawer fixed right-0 top-0 z-50 h-full w-full max-w-md shadow-2xl backdrop-blur-2xl md:w-[420px]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Your cart</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Order summary</h2>
        </div>
        <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-white hover:bg-white/10">
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-6">
        {cartItems.length === 0 ? (
          <div className="grid place-items-center gap-4 rounded-[32px] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
            <CheckCircle2 size={40} className="text-secondary" />
            <p className="text-white">No items yet. Add a dish to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="cart-line rounded-[28px] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{item.price}</p>
                    <button onClick={() => onRemove(index)} className="mt-3 text-xs uppercase tracking-[0.25em] text-secondary hover:text-white">
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto border-t border-white/10 px-6 py-6">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Subtotal</span>
          <span className="text-white">Rs. {subtotal.toFixed(2)}</span>
        </div>
        <button onClick={onCheckout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-sm font-semibold text-darkbg shadow-soft transition hover:-translate-y-0.5">
          <CreditCard size={18} /> Checkout
        </button>
        <div className="mt-5 flex items-center gap-3 rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
          <Package size={18} className="text-secondary" />
          <span>Fast delivery with premium packaging.</span>
        </div>
      </div>
    </motion.aside>
  )
}
