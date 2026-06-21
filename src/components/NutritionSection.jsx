import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

const targets = { protein: 55, carbs: 110, fat: 55, fiber: 15 }

export default function NutritionSection({ nutrition }) {
  const nutrients = [
    ['Protein', nutrition.protein, 'g', targets.protein],
    ['Carbohydrates', nutrition.carbs, 'g', targets.carbs],
    ['Fat', nutrition.fat, 'g', targets.fat],
    ['Fiber', nutrition.fiber, 'g', targets.fiber],
  ]

  return (
    <section className="detail-section nutrition-section" aria-labelledby="nutrition-title">
      <div className="detail-section-heading">
        <p className="premium-eyebrow"><Activity size={15} /> Nutrition</p>
        <h2 id="nutrition-title">Balanced by the kitchen</h2>
        <p>Approximate values per serving, prepared to the standard recipe.</p>
      </div>
      <div className="nutrition-layout">
        <motion.div className="calorie-orbit" initial={{ scale: 0.75, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
          <strong>{nutrition.calories}</strong><span>kcal</span>
        </motion.div>
        <div className="nutrition-bars">
          {nutrients.map(([label, value, unit, target], index) => (
            <div className="nutrition-row" key={label}>
              <div><span>{label}</span><strong>{value}{unit}</strong></div>
              <div className="nutrition-track"><motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: Math.min(value / target, 1) }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
