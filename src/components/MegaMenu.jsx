import { motion } from 'framer-motion'

const categories = [
  { title: 'Signature Meals', items: ['Wood-fired pizza', 'Royal Biryani', 'Truffle pasta'] },
  { title: 'Fast Favorites', items: ['Smash burger', 'Chili momos', 'Loaded fries'] },
  { title: 'Dessert Bar', items: ['Caramel souffle', 'Berry cheesecake', 'Chocolate lava'] },
  { title: 'Drinks & Sides', items: ['Craft soda', 'Masala fries', 'Fresh salads'] },
]

export default function MegaMenu({ open }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden border-b border-white/10 bg-darkbg/95 text-white"
    >
      <div className="container grid gap-8 py-8 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.title}>
            <p className="text-sm uppercase tracking-[0.32em] text-secondary">{category.title}</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {category.items.map((item) => (
                <li key={item} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 hover:border-secondary/40 hover:bg-white/10">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
