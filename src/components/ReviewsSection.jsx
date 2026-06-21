import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Star } from 'lucide-react'

export default function ReviewsSection({ reviews, rating }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % reviews.length), 4200)
    return () => window.clearInterval(interval)
  }, [reviews.length])

  return (
    <section className="detail-section reviews-detail-section" aria-labelledby="reviews-title">
      <div className="detail-section-heading reviews-heading">
        <div><p className="premium-eyebrow">Guest notes</p><h2 id="reviews-title">A table worth returning to</h2></div>
        <div className="reviews-score"><strong>{rating}</strong><span><Star size={16} fill="currentColor" /> average</span></div>
      </div>
      <div className="review-carousel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.article key={reviews[active].id} initial={{ opacity: 0, x: 36, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -36 }} transition={{ duration: 0.5 }}>
            <div className="review-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={17} fill="currentColor" />)}</div>
            <p>“{reviews[active].text}”</p>
            <footer><span>{reviews[active].avatar}</span><div><strong>{reviews[active].name}</strong><small><BadgeCheck size={14} /> Verified customer</small></div></footer>
          </motion.article>
        </AnimatePresence>
        <div className="review-dots">{reviews.map((review, index) => <button type="button" key={review.id} className={active === index ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Show review ${index + 1}`} />)}</div>
      </div>
    </section>
  )
}
