import { useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'


export default function FloatingBackground() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const rotateY = useTransform(pointerX, [-260, 260], [20, -20])
  const rotateX = useTransform(pointerY, [-180, 180], [-14, 14])
  const floatX = useTransform(pointerX, [-260, 260], [-26, 26])
  const floatY = useTransform(pointerY, [-180, 180], [-22, 22])
  const lightX = useTransform(pointerX, [-260, 260], [-70, 70])
  const lightY = useTransform(pointerY, [-180, 180], [-70, 70])

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = event.clientX - window.innerWidth / 2
      const y = event.clientY - window.innerHeight / 2
      pointerX.set(x)
      pointerY.set(y)
    }
    const handlePointerLeave = () => {
      pointerX.set(0)
      pointerY.set(0)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 0.92, 0.8] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,140,60,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]"
      />

      <motion.div
        style={{ x: lightX, y: lightY }}
        className="pointer-events-none absolute left-1/3 top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -40, 0], opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-16 top-28 h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-3xl"
      />
      <motion.div
        animate={{ x: [-40, 30, -40], y: [0, 30, 0], opacity: [0.16, 0.4, 0.16] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-16 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-secondary/25 to-transparent blur-3xl"
      />

      {/* Removed floating photo cards to keep hero clean and non-overlapping */}

      <motion.span
        animate={{ x: [0, 10, 0], y: [0, -10, 0], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-10 left-1/4 h-4 w-4 rounded-full bg-white/40"
      />
      <motion.span
        animate={{ x: [0, -10, 0], y: [0, 12, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/2 right-1/4 h-3 w-3 rounded-full bg-white/30"
      />
      <motion.span
        animate={{ x: [0, 12, 0], y: [0, -8, 0], opacity: [0.16, 0.44, 0.16] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-[60%] left-[15%] h-5 w-5 rounded-full bg-white/25"
      />
      <motion.span
        animate={{ x: [0, -12, 0], y: [0, 10, 0], opacity: [0.12, 0.4, 0.12] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-28 right-[22%] h-4 w-4 rounded-full bg-white/30"
      />
    </div>
  )
}
