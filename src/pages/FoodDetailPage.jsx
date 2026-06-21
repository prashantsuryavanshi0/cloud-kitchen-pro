import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  ChefHat,
  ChevronDown,
  Clock3,
  Download,
  Flame,
  Heart,
  Leaf,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ChefSection from '../components/ChefSection'
import FoodGallery from '../components/FoodGallery'
import NutritionSection from '../components/NutritionSection'
import RelatedDishes from '../components/RelatedDishes'
import ReviewsSection from '../components/ReviewsSection'
import { getFoodBySlug, getRelatedFoods } from '../data/foodData'
import logoImg from '../assets/logo.svg'

const details = [
  ['Category', 'category', Sparkles],
  ['Preparation', 'time', Clock3],
  ['Serving', 'serving', Users],
  ['Spice level', 'spice', Flame],
]

function DetailParticles() {
  return <div className="detail-particles" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <span key={index} style={{ '--x': `${(index * 43) % 100}%`, '--y': `${(index * 67) % 100}%`, '--delay': `${-(index % 8) * 1.1}s`, '--duration': `${7 + (index % 6)}s` }} />)}</div>
}

export default function FoodDetailPage() {
  const { slug } = useParams()
  const dish = getFoodBySlug(slug)
  const heroRef = useRef(null)
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  const [notice, setNotice] = useState('')
  const [cartCount, setCartCount] = useState(() => Number(localStorage.getItem('cloud-cart-count') || 0))
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 58])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.86], [1, 0.45])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!dish) return
    document.title = dish.meta.title
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = dish.meta.description
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${window.location.origin}/menu/${dish.slug}`
  }, [dish])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  if (!dish) {
    return <main className="detail-not-found"><img src={logoImg} alt="Cloud Kitchen" /><p className="premium-eyebrow">Menu note</p><h1>This course is not on tonight's menu.</h1><Link to="/#menu"><ArrowLeft size={18} /> Return to signature meals</Link></main>
  }

  const related = getRelatedFoods(dish)

  const addToCart = () => {
    const count = cartCount + quantity
    setCartCount(count)
    localStorage.setItem('cloud-cart-count', String(count))
    const stored = JSON.parse(localStorage.getItem('cloud-market-cart') || '[]')
    localStorage.setItem('cloud-market-cart', JSON.stringify([...stored, { slug: dish.slug, quantity, price: dish.priceValue }]))
    setNotice(`${quantity} x ${dish.name} reserved for your order.`)
  }

  const shareDish = async () => {
    const shareData = { title: dish.name, text: dish.description, url: window.location.href }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch { return }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setNotice('Private menu link copied.')
    }
  }

  return (
    <motion.div className="food-detail-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <header className="detail-nav">
        <Link to="/" className="detail-brand"><img src={logoImg} alt="Cloud Kitchen" /><span>Cloud Kitchen<small>Signature meals</small></span></Link>
        <nav><Link to="/#menu"><ArrowLeft size={17} /> All dishes</Link><button type="button" onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })} aria-label={`${cartCount} items in cart`}><ShoppingBag size={19} /><span>{cartCount}</span></button></nav>
      </header>

      <section ref={heroRef} className="food-detail-hero">
        <motion.div className="detail-hero-image" style={{ y: imageY, opacity: heroOpacity }}><img src={dish.image} alt={dish.name} loading="eager" fetchPriority="high" /></motion.div>
        <div className="detail-hero-overlay" />
        <DetailParticles />
        <motion.div className="detail-hero-content" style={{ y: contentY }}>
          <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.75 }}>
            <div className="detail-hero-tags"><span>{dish.tag}</span><span className={dish.type === 'Veg' ? 'is-veg' : 'is-nonveg'}>{dish.type}</span></div>
            <p className="premium-eyebrow">Chef-curated signature</p>
            <h1>{dish.name}</h1>
            <p>{dish.description}</p>
            <div className="detail-rating"><span><Star size={17} fill="currentColor" /> {dish.rating}</span><span><Clock3 size={17} /> {dish.time}</span><span><BadgeCheck size={17} /> 98% reorder</span></div>
            <div className="detail-hero-actions">
              <a href="#order" className="detail-primary-action">Reserve this dish <ChevronDown size={18} /></a>
              <motion.button type="button" onClick={() => { setFavorite(!favorite); setNotice(favorite ? 'Removed from favorites.' : 'Added to your private favorites.'); }} animate={{ scale: favorite ? [1, 1.28, 1] : 1, rotate: favorite ? [0, -10, 8, 0] : 0 }} transition={{ duration: 0.42 }} className={favorite ? 'is-favorite' : ''} aria-label="Toggle favorite"><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /></motion.button>
              <button type="button" onClick={shareDish} aria-label="Share dish"><Share2 size={19} /></button>
            </div>
          </motion.div>
        </motion.div>
        <div className="hero-scroll-note"><span /> Scroll to explore</div>
      </section>

      <main className="detail-content-shell">
        <section id="order" className="detail-order-grid">
          <motion.div className="dish-information" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="premium-eyebrow">The composition</p>
            <h2>A signature course, finished for your table</h2>
            <p className="chef-recommendation"><ChefHat size={21} /><span><strong>Chef recommendation</strong>{dish.recommendation}</span></p>
            <div className="dish-facts">{details.map(([label, key, Icon]) => <div key={key}><Icon size={19} /><span>{label}<strong>{dish[key]}</strong></span></div>)}</div>
            <div className="ingredients"><h3>Ingredients</h3><div>{dish.ingredients.map((item) => <span key={item}>{item}</span>)}</div></div>
            <div className="dietary"><Leaf size={18} />{dish.dietary.map((item) => <span key={item}>{item}</span>)}</div>
          </motion.div>

          <motion.aside className="order-console" initial={{ opacity: 0, x: 34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div><p>Tonight's price</p><strong>{dish.price}</strong><span>Taxes and premium packaging included</span></div>
            <div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={17} /></button><span>{quantity}<small>serving{quantity > 1 ? 's' : ''}</small></span><button type="button" onClick={() => setQuantity(Math.min(8, quantity + 1))} aria-label="Increase quantity"><Plus size={17} /></button></div>
            <motion.button type="button" onClick={addToCart} whileTap={{ scale: 0.96 }} className="order-add-button"><ShoppingBag size={19} /> Add to order <span>Rs. {(dish.priceValue * quantity).toLocaleString('en-IN')}</span></motion.button>
            <button type="button" onClick={() => setNotice('Delivery scheduling concierge opened for this evening.')} className="order-schedule-button"><CalendarClock size={18} /> Schedule delivery</button>
            <p className="order-assurance"><BadgeCheck size={17} /> Prepared fresh after confirmation. Tamper sealed.</p>
          </motion.aside>
        </section>

        <FoodGallery images={dish.gallery} name={dish.name} />
        <ChefSection chef={dish.chef} />
        <NutritionSection nutrition={dish.nutrition} />
        <ReviewsSection reviews={dish.reviews} rating={dish.rating} />
        <RelatedDishes dishes={related} />

        <section className="detail-cta">
          <DetailParticles />
          <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="premium-eyebrow">Your table is waiting</p><h2>Bring the chef's pass home.</h2><p>Priority preparation slots are limited each evening.</p>
            <div><button type="button" onClick={addToCart}><ShoppingBag size={18} /> Order now</button><button type="button" onClick={() => setNotice('Delivery scheduling concierge opened for this evening.')}><CalendarClock size={18} /> Schedule delivery</button><a href="#chef-story"><ChefHat size={18} /> Contact chef</a><Link to="/#app"><Download size={18} /> Download app</Link></div>
          </motion.div>
        </section>
      </main>

      <footer className="detail-footer"><Link to="/"><img src={logoImg} alt="" /> Cloud Kitchen</Link><p>Michelin-inspired delivery, plated for home.</p></footer>

      <AnimatePresence>
        {notice && <motion.div className="detail-toast" initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14 }}><BadgeCheck size={19} /><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={16} /></button></motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}
