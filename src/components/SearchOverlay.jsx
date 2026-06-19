import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

const suggestions = ['Cloud Pizza', 'Royal Biryani', 'Fast delivery', 'Dessert deals', 'Healthy bowls']
const results = [
  { title: 'Biryani Feast', description: 'Aromatic historic flavors ready in 30 min.' },
  { title: 'Gourmet Pizza', description: 'Thin crust with premium toppings.' },
  { title: 'Chef’s Special Burgers', description: 'Juicy, rich, and crafted to order.' },
]

export default function SearchOverlay({ open, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'} bg-slate-950/95 backdrop-blur-xl`}
    >
      <div className="container mx-auto flex h-full flex-col justify-center px-6 py-10 text-white">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Search</p>
            <h2 className="mt-3 text-4xl font-semibold">Find your next favorite meal</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/15">
            <X size={20} />
          </button>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-slate-950/80 px-5 py-4">
            <Search size={18} className="text-secondary" />
            <input type="search" placeholder="Search dishes, offers, or locations" className="w-full bg-transparent text-white outline-none placeholder:text-slate-400" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-secondary">Popular searches</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-secondary">Featured results</p>
              <div className="mt-4 space-y-4">
                {results.map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
