import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import FallbackImage from './FallbackImage'

export default function RelatedDishes({ dishes }) {
  return (
    <section className="detail-section related-section" aria-labelledby="related-title">
      <div className="detail-section-heading"><p className="premium-eyebrow">Curated next</p><h2 id="related-title">Frequently ordered together</h2></div>
      <div className="related-grid">
        {dishes.map((dish, index) => (
          <motion.article key={dish.slug} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }}>
            <Link to={`/menu/${dish.slug}`}>
              <div><FallbackImage src={dish.image} alt={dish.name} /><span>{dish.tag}</span></div>
              <section><p>{dish.category}</p><h3>{dish.name}</h3><div><span><Star size={14} fill="currentColor" /> {dish.rating}</span><span><Clock3 size={14} /> {dish.time}</span><strong>{dish.price}</strong></div><i><ArrowUpRight size={18} /></i></section>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
