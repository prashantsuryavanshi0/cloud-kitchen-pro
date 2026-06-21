import { motion } from 'framer-motion'
import { ChefHat, Quote, Star } from 'lucide-react'
import FallbackImage from './FallbackImage'

export default function ChefSection({ chef }) {
  return (
    <section id="chef-story" className="detail-section chef-detail-section" aria-labelledby="chef-title">
      <motion.div className="chef-detail-image" initial={{ opacity: 0, x: -34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
        <FallbackImage src={chef.image} alt={chef.name} />
        <span><Star size={15} fill="currentColor" /> Michelin-trained craft</span>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
        <p className="premium-eyebrow"><ChefHat size={15} /> Chef's story</p>
        <h2 id="chef-title">{chef.name}</h2>
        <div className="chef-detail-meta"><span>{chef.experience} experience</span><span>{chef.style}</span></div>
        <blockquote><Quote size={26} /> {chef.quote}</blockquote>
        <p>Every order is finished against the same tasting notes used at the pass: heat, contrast, aroma, and a final visual inspection before sealing.</p>
      </motion.div>
    </section>
  )
}
