import { motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'

export default function WishlistPanel({ open, onClose, wishlist }) {
  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: open ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-slate-950/95 shadow-2xl backdrop-blur-2xl md:w-[360px]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Wishlist</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Saved favorites</h2>
        </div>
        <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-white hover:bg-white/10">
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-6">
        {wishlist.length === 0 ? (
          <div className="grid place-items-center gap-4 rounded-[32px] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
            <Heart size={40} className="text-secondary" />
            <p className="text-white">Your wishlist is empty. Add premium dishes to save them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                  <div className="text-right text-white">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  )
}
