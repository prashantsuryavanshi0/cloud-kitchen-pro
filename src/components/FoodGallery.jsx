import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Expand, X } from 'lucide-react'
import FallbackImage from './FallbackImage'

export default function FoodGallery({ images, name }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active === null) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setActive(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])

  return (
    <section className="detail-section" aria-labelledby="gallery-title">
      <div className="detail-section-heading">
        <p className="premium-eyebrow">Visual tasting</p>
        <h2 id="gallery-title">Crafted from every angle</h2>
      </div>
      <div className="food-gallery-grid">
        {images.map((image, index) => (
          <motion.button
            key={image}
            type="button"
            className={`food-gallery-item ${index === 0 ? 'food-gallery-primary' : ''}`}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.08, duration: 0.65 }}
            whileHover={{ y: -6 }}
            onClick={() => setActive(index)}
            aria-label={`Open ${name} image ${index + 1}`}
          >
            <FallbackImage src={image} alt={`${name} presentation ${index + 1}`} />
            <span className="gallery-expand"><Expand size={18} /> View</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${name} image preview`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <FallbackImage src={images[active]} alt={`${name} expanded presentation`} />
              <button type="button" onClick={() => setActive(null)} aria-label="Close image preview"><X size={22} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
