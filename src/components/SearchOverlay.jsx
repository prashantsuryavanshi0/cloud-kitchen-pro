import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock3, Search, ShoppingCart, Star, X } from 'lucide-react'

const suggestions = ['Pizza', 'Biryani', 'Dessert', 'Veg', 'Chef Special']

export default function SearchOverlay({ open, onClose, dishes = [], onAddToCart, onQuickView }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return dishes
    return dishes.filter((dish) =>
      [dish.name, dish.description, dish.tag, dish.type].join(' ').toLowerCase().includes(value)
    )
  }, [dishes, query])

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
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search dishes, offers, or tags"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {suggestions.map((suggestion) => (
              <button key={suggestion} onClick={() => setQuery(suggestion)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                {suggestion}
              </button>
            ))}
          </div>
          <div className="mt-6 grid max-h-[48vh] gap-4 overflow-y-auto pr-2 md:grid-cols-2">
            {filtered.map((dish) => (
              <div key={dish.name} className="group rounded-[28px] border border-white/10 bg-slate-900/80 p-4 transition hover:-translate-y-1 hover:border-amber-200/30">
                <div className="flex gap-4">
                  <img src={dish.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{dish.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{dish.description}</p>
                      </div>
                      <p className="text-sm font-semibold text-amber-100">{dish.price}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1 text-amber-200"><Star size={14} fill="currentColor" /> {dish.rating}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {dish.time}</span>
                      <button onClick={() => onQuickView?.(dish)} className="ml-auto rounded-full border border-white/10 px-3 py-1 hover:bg-white/10">View</button>
                      <button onClick={() => onAddToCart?.(dish)} className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 font-semibold text-darkbg">
                        <ShoppingCart size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300 md:col-span-2">
                No matching dishes found. Try pizza, biryani, dessert, or chef special.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
