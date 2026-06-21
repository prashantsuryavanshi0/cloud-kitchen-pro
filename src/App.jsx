import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  Apple,
  ArrowRight,
  BadgeCheck,
  Bike,
  ChefHat,
  ChevronUp,
  Clock3,
  Crown,
  Heart,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Play,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Timer,
  Truck,
  X,
} from 'lucide-react'
import CartSidebar from './components/CartSidebar'
import ChatbotPanel from './components/ChatbotPanel'
import MegaMenu from './components/MegaMenu'
import MiniCheckoutDrawer from './components/MiniCheckoutDrawer'
import MobileBottomNav from './components/MobileBottomNav'
import SearchOverlay from './components/SearchOverlay'
import WishlistPanel from './components/WishlistPanel'
import FallbackImage from './components/FallbackImage'
import logoImg from './assets/logo.svg'
import sizzlerImg from './assets/smoky-peri-peri-sizzler.png'
import { Link } from 'react-router-dom'
import { foodData as dishes } from './data/foodData'

const SizzlerEffects = lazy(() => import('./components/SizzlerEffects'))

const stats = [
  { label: 'Orders Delivered', value: 24800, suffix: '+', icon: Truck, progress: 92 },
  { label: 'Average Rating', value: 4.9, suffix: '/5', icon: Star, progress: 98, decimals: 1 },
  { label: 'Daily Customers', value: 1200, suffix: '+', icon: Crown, progress: 84 },
  { label: 'Delivery Time', value: 24, suffix: ' min', icon: Timer, progress: 76 },
]

const whyItems = [
  { title: 'Chef-Led Cloud Kitchen', text: 'Every dish is finished by trained chefs with plating-level discipline.', icon: ChefHat, span: 'lg:col-span-2' },
  { title: 'Sealed Luxury Packaging', text: 'Heat-locked, tamper-sealed boxes designed to arrive pristine.', icon: ShieldCheck, span: '' },
  { title: 'Live Concierge Support', text: 'Chat support handles edits, allergies, and gifting notes in real time.', icon: MessageCircle, span: '' },
  { title: 'Curated Seasonal Menu', text: 'Short, sharp menus built around the best produce of the week.', icon: Sparkles, span: '' },
  { title: 'Precision Dispatch', text: 'Timed pickup windows and live route visibility keep food at peak texture.', icon: Bike, span: 'lg:col-span-2' },
]

const chefs = [
  { name: 'Chef Armaan Kapoor', specialty: 'Modern Indian fire kitchen', exp: '14 years', rating: '4.9', image: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { name: 'Chef Mira Sato', specialty: 'Italian, fermentation, sauces', exp: '11 years', rating: '5.0', image: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { name: 'Chef Dev Mehra', specialty: 'Desserts and plated classics', exp: '9 years', rating: '4.8', image: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=900' },
]

const reviews = [
  { name: 'Aarav Malhotra', text: 'It felt like a tasting menu arrived at my apartment. Beautiful packaging, hot food, flawless details.', rating: 5, avatar: 'AM' },
  { name: 'Mira Rao', text: 'The app experience is smooth, the tracker is accurate, and the dishes look expensive in the best way.', rating: 5, avatar: 'MR' },
  { name: 'Dev Shah', text: 'The biryani and dessert were restaurant-level. This is my new premium dinner plan.', rating: 5, avatar: 'DS' },
]

const deliverySteps = [
  { title: 'Order Confirmed', text: 'Concierge accepted your dinner reservation.', time: '01:16', icon: BadgeCheck, status: 'Complete' },
  { title: 'Preparing', text: 'Chef station is finishing sauces and garnish.', time: '01:19', icon: ChefHat, status: 'Live' },
  { title: 'Packed', text: 'Heat-locked packaging and tamper seal ready.', time: '01:27', icon: ShieldCheck, status: 'Queued' },
  { title: 'Out For Delivery', text: 'Priority rider follows the fastest warm route.', time: '01:34', icon: Bike, status: 'Next' },
  { title: 'Delivered', text: 'Final table handoff with premium presentation.', time: '01:40', icon: Crown, status: 'ETA' },
]
const navLinks = ['Home', 'Menu', 'Chefs', 'Tracker', 'App', 'Contact']

function FoodSteamLayer({ visible }) {
  if (!visible) return null

  return (
    <div className="food-steam-layer" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

function LuxuryParticleField({ style }) {
  const motes = Array.from({ length: 28 }, (_, index) => ({
    left: `${(index * 37 + 11) % 100}%`,
    top: `${(index * 53 + 7) % 100}%`,
    drift: `${-18 + (index % 7) * 6}px`,
    duration: `${8 + (index % 6) * 1.7}s`,
    delay: `${-(index % 9) * 1.15}s`,
    scale: 0.65 + (index % 4) * 0.18,
  }))

  return (
    <motion.div className="luxury-particle-field" style={style} aria-hidden="true">
      {motes.map((mote, index) => (
        <span
          key={index}
          className={index % 7 === 0 ? 'particle-gem' : index % 3 === 0 ? 'particle-silver' : 'particle-gold'}
          style={{
            '--particle-left': mote.left,
            '--particle-top': mote.top,
            '--particle-drift': mote.drift,
            '--particle-duration': mote.duration,
            '--particle-delay': mote.delay,
            '--particle-scale': mote.scale,
          }}
        />
      ))}
    </motion.div>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 38, scale: 0.985, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-72px', amount: 0.16 }}
      transition={{ duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ label, title, text }) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      <p className="premium-eyebrow">{label}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
      {text && <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{text}</p>}
    </Reveal>
  )
}

function MagneticButton({ children, className = '', onClick }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 16 })
  const springY = useSpring(y, { stiffness: 220, damping: 16 })

  const onMove = (event) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      onClick={onClick}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      className={`luxury-button ${className}`}
    >
      {children}
    </motion.button>
  )
}

function CountUp({ value, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / 1600, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return `${display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`
}

function App() {
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeReview, setActiveReview] = useState(0)
  const [chefStory, setChefStory] = useState(null)
  const [toast, setToast] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [bottomActive, setBottomActive] = useState('home')
  const { scrollYProgress } = useScroll()
  const ambientY = useTransform(scrollYProgress, [0, 1], [0, -44])
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.76, 1, 0.68])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const heroRotateX = useTransform(mouseY, [0, 900], [8, -8])
  const heroRotateY = useTransform(mouseX, [0, 1400], [-10, 10])
  const heroX = useTransform(mouseX, [0, 1400], [-16, 16])
  const heroY = useTransform(mouseY, [0, 900], [-10, 10])

  const particles = useMemo(() => Array.from({ length: 34 }, (_, index) => ({
    left: `${(index * 29) % 100}%`,
    top: `${(index * 47) % 100}%`,
    delay: (index % 8) * 0.24,
    size: 2 + (index % 4),
  })), [])

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.85 })
    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 850)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.title = 'Cloud Kitchen | Michelin-Inspired Food Delivery'
    const description = document.querySelector('meta[name="description"]')
    if (description) description.content = 'Explore chef-curated signature meals, premium packaging, and precision delivery from Cloud Kitchen.'
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.href = `${window.location.origin}/`
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setActiveReview((current) => (current + 1) % reviews.length), 4200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const update = () => {
      const top = window.scrollY
      setShowBackToTop(top > 500)
    }
    const move = (event) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      document.documentElement.style.setProperty('--spotlight-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--spotlight-y', `${event.clientY}px`)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('pointermove', move)
    }
  }, [mouseX, mouseY])

  const addToCart = (dish) => {
    setCartItems((current) => [...current, dish])
    setDrawerOpen(true)
    setToast(`${dish.name} added to your premium cart.`)
  }

  const addToWishlist = (dish) => {
    setWishlistItems((current) => (current.some((item) => item.name === dish.name) ? current : [...current, dish]))
    setToast(`${dish.name} saved to wishlist.`)
  }

  const showToast = (message) => {
    setToast(message)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setToast('Add a dish first to start premium checkout.')
      return
    }
    setDrawerOpen(false)
    setCartOpen(false)
    setToast('Order confirmed. Your concierge tracker is now live.')
    document.getElementById('tracker')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleStoreClick = (store) => {
    setToast(`${store} preview opened. App download flow is ready for launch.`)
  }

  const handleNewsletter = () => {
    if (!newsletterEmail.trim()) {
      setToast('Enter your email to join the VIP dining list.')
      return
    }
    setToast('You are on the VIP dining list. Watch your inbox.')
    setNewsletterEmail('')
  }

  const handleBottomSelect = (value) => {
    setBottomActive(value)
    if (value === 'search') setSearchOpen(true)
    if (value === 'chat') setChatOpen(true)
    if (value === 'cart') setCartOpen(true)
    if (value === 'menu') document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="site-shell relative min-h-screen overflow-hidden text-white">
      <div className="mesh-bg" />
      <div className="spotlight" />
      <LuxuryParticleField style={{ y: ambientY, opacity: ambientOpacity }} />
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-white/10">
        <motion.div className="h-full origin-left bg-gradient-to-r from-amber-500 via-yellow-200 to-orange-500" style={{ scaleX: scrollYProgress }} />
      </div>

      <AnimatePresence>
        {!loaded && (
        <motion.div key="luxury-loader" initial={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(12px)' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[80] grid place-items-center bg-[#05070d]">
          <motion.div initial={{ scale: 0.78, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 1.12, opacity: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} className="premium-panel grid h-36 w-36 place-items-center rounded-full">
            <motion.img src={logoImg} alt="Cloud Kitchen" className="h-16 w-16" animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} />
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} dishes={dishes} onAddToCart={addToCart} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} onRemove={(index) => setCartItems((items) => items.filter((_, i) => i !== index))} onCheckout={handleCheckout} />
      <WishlistPanel open={wishlistOpen} onClose={() => setWishlistOpen(false)} wishlist={wishlistItems} />
      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <MiniCheckoutDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={cartItems} onCheckout={handleCheckout} />

      <motion.header initial={{ y: -96, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 130, damping: 20, delay: 0.15 }} className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/70 backdrop-blur-2xl">
        <div className="container flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 p-2 shadow-glow">
              <img src={logoImg} alt="Cloud Kitchen logo" className="h-9 w-9" />
            </span>
            <span>
              <span className="block text-base font-semibold">Cloud Kitchen</span>
              <span className="block text-[10px] uppercase tracking-[0.32em] text-amber-100/70">Michelin delivery</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="nav-link text-sm text-slate-300">{link}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="icon-btn hidden md:grid" aria-label="Search"><Search size={18} /></button>
            <button onClick={() => setMegaOpen(!megaOpen)} className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white lg:inline-flex">Explore</button>
            <button onClick={() => setWishlistOpen(true)} className="icon-btn" aria-label="Wishlist"><Heart size={18} /></button>
            <button onClick={() => setCartOpen(true)} className="icon-btn" aria-label="Cart"><ShoppingCart size={18} /></button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="icon-btn lg:hidden" aria-label="Menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
        <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0, filter: 'blur(8px)' }} animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }} exit={{ height: 0, opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-t border-white/10 bg-[#05070d]/95 lg:hidden">
            <div className="container grid gap-4 py-5">
              {navLinks.map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="text-slate-200">{link}</a>)}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.header>
      <MegaMenu open={megaOpen} />

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.75, delay: loaded ? 0.12 : 0 }}>
        <section id="home" className="relative min-h-screen overflow-hidden pb-24 pt-16 lg:pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,182,39,0.18),transparent_34%),linear-gradient(180deg,transparent,rgba(5,7,13,0.94))]" />
          {particles.map((particle) => (
            <motion.span
              key={`${particle.left}-${particle.top}`}
              className="particle"
              style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
              animate={{ y: [0, -34, 0], opacity: [0.15, 0.78, 0.15] }}
              transition={{ duration: 4.5, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          <div className="container relative z-10 grid gap-14 lg:grid-cols-[1fr_0.94fr] lg:items-center">
            <Reveal>
              <p className="premium-pill"><Sparkles size={16} /> Private chef delivery, plated for home</p>
              <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] md:text-7xl">
                Michelin-level dining, delivered with <span className="text-gradient bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">cinematic luxury.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                A premium food ordering experience with chef-curated dishes, sealed luxury packaging, live dispatch, and restaurant-grade presentation.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <MagneticButton onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 px-8 py-4 font-semibold text-slate-950">
                  Reserve Dinner <ArrowRight size={18} />
                </MagneticButton>
                <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl hover:bg-white/15">
                  <Play size={18} /> Explore Signature
                </button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-4">
                {stats.map((stat, index) => (
                  <Reveal key={stat.label} delay={index * 0.06} className="glass-card p-5">
                    <p className="text-2xl font-semibold text-white"><CountUp {...stat} /></p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <motion.div className="relative mx-auto w-full max-w-xl perspective-hero" style={{ x: heroX, y: heroY }}>
              <motion.div className="hero-glow" animate={{ scale: [0.96, 1.05, 0.96], opacity: [0.55, 0.9, 0.55] }} transition={{ duration: 5, repeat: Infinity }} />
              <motion.div className="sizzler-showcase premium-panel relative overflow-hidden rounded-[2rem] p-4" initial={{ opacity: 0, scale: 0.92, rotateY: -8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }} style={{ rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: 'preserve-3d' }}>
                <div className="sizzler-fire-glow" />
                <FallbackImage src={sizzlerImg} alt="Smoky Peri-Peri Sizzler with grilled chicken, steak, vegetables, corn, noodles and rice" loading="eager" className="sizzler-photo h-[520px] w-full rounded-3xl object-cover" />
                <div className="sizzler-cinematic-shade" />
                <div className="sizzler-heat-haze" aria-hidden="true"><span /><span /><span /></div>
                <Suspense fallback={<div className="sizzler-webgl" aria-hidden="true" />}><SizzlerEffects /></Suspense>
                <div className="sizzler-topline">
                  <span className="sizzler-chef-tag"><Sparkles size={14} /> Chef's Signature</span>
                  <span className="sizzler-live-badge"><i /> Live Sizzling</span>
                </div>
                <div className="sizzler-content">
                  <div>
                    <p className="premium-eyebrow">Cast-iron theatre, served live</p>
                    <h3>Smoky Peri-Peri Sizzler</h3>
                    <p><Clock3 size={15} /> 26 min priority hot-table delivery</p>
                  </div>
                  <span className="sizzler-temperature">240°<small>plate heat</small></span>
                </div>
              </motion.div>
              <motion.div className="float-card left-0 top-16" animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity }}>
                <Clock3 size={18} className="text-amber-200" /> 26 min hot-table dispatch
              </motion.div>
              <motion.div className="float-card right-0 top-28" animate={{ y: [8, -10, 8] }} transition={{ duration: 5.6, repeat: Infinity }}>
                <BadgeCheck size={18} className="text-emerald-200" /> Cast-iron heat sealed
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="trust" className="container py-24">
          <SectionTitle label="Performance" title="Premium metrics that move like the product" text="Animated counters, circular progress, glowing borders, and live delivery signals build confidence before the first order." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Reveal key={stat.label} delay={index * 0.07} className="spotlight-card glass-card group p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20"><Icon size={22} /></span>
                    <div className="progress-ring" style={{ '--progress': `${stat.progress * 3.6}deg` }}><span>{stat.progress}%</span></div>
                  </div>
                  <p className="mt-7 text-4xl font-semibold"><CountUp {...stat} /></p>
                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section id="why" className="container py-24">
          <SectionTitle label="Why choose us" title="A bento-grid operating system for premium food delivery" />
          <div className="grid auto-rows-auto gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={index * 0.06} className={`bento-card group ${item.span}`}>
                  <div className="relative z-10">
                    <motion.div whileHover={{ rotate: 8, scale: 1.08 }} className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-amber-200 ring-1 ring-white/15">
                      <Icon size={25} />
                    </motion.div>
                    <h3 className="mt-7 text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{item.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section id="menu" className="container py-24">
          <SectionTitle label="Signature meals" title="A complete marketplace of chef-curated courses" text="Explore twelve signature dishes, each with its own story, gallery, nutrition profile, chef notes, and dedicated ordering experience." />
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {dishes.map((dish, index) => (
              <Reveal key={dish.name} delay={index * 0.05}>
                <motion.article whileHover={{ y: -16, rotateX: 7, rotateY: -7, scale: 1.018 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }} className="dish-card group">
                  <div className="dish-media">
                    <div className="dish-image-clip">
                      <FallbackImage src={dish.image} alt={dish.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="shine" />
                    </div>
                    <FoodSteamLayer visible={dish.hot} />
                    <Link to={`/menu/${dish.slug}`} className="absolute inset-0 z-[6]" aria-label={`View ${dish.name} details`} />
                    <div className="gold-sparkles" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                      <span className="badge-gold">{dish.tag}</span>
                      <span className={dish.type === 'Veg' ? 'badge-veg' : 'badge-nonveg'}>{dish.type}</span>
                    </div>
                    <button onClick={() => addToWishlist(dish)} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/35 text-white backdrop-blur-xl ring-1 ring-white/10 hover:text-rose-300">
                      <Heart size={18} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{dish.name}</h3>
                          <p className="mt-1 text-sm text-slate-300">{dish.description}</p>
                        </div>
                        <p className="text-xl font-semibold text-amber-100">{dish.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1 text-amber-200"><Star size={15} fill="currentColor" /> {dish.rating}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={15} /> {dish.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/menu/${dish.slug}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">View details</Link>
                      <button onClick={() => addToCart(dish)} className="luxury-button rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-2 text-sm font-semibold text-slate-950">Add</button>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="chefs" className="container py-24">
          <SectionTitle label="Chef showcase" title="The people behind the fire" />
          <div className="grid gap-7 md:grid-cols-3">
            {chefs.map((chef, index) => (
              <Reveal key={chef.name} delay={index * 0.08}>
                <article className="chef-card group">
                  <FallbackImage src={chef.image} alt={chef.name} className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm uppercase tracking-[0.26em] text-amber-200">{chef.specialty}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{chef.name}</h3>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
                      <span>{chef.exp} experience</span>
                      <span className="inline-flex items-center gap-1"><Star size={15} fill="currentColor" className="text-amber-200" /> {chef.rating}</span>
                    </div>
                    <button onClick={() => setChefStory(chef)} className="mt-5 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm backdrop-blur-xl opacity-0 transition group-hover:opacity-100">Chef story</button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="reviews" className="container py-24">
          <SectionTitle label="Testimonials" title="A luxury carousel of verified diners" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-10">
            <motion.div key={activeReview} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="glass-card mx-auto max-w-4xl p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-lg font-semibold text-slate-950">{reviews[activeReview].avatar}</div>
                  <div>
                    <p className="text-xl font-semibold">{reviews[activeReview].name}</p>
                    <p className="inline-flex items-center gap-2 text-sm text-emerald-200"><BadgeCheck size={16} /> Verified customer</p>
                  </div>
                </div>
                <div className="flex text-amber-200">{Array.from({ length: reviews[activeReview].rating }).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div>
              </div>
              <p className="mt-8 text-2xl leading-10 text-slate-100">"{reviews[activeReview].text}"</p>
            </motion.div>
          </div>
        </section>

        <section id="tracker" className="container py-24">
          <SectionTitle label="Live delivery tracker" title="A concierge-grade delivery command center" text="Premium live tracking with kitchen telemetry, route intelligence, ETA confidence, and polished progress states." />
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <Reveal className="tracker-panel rounded-[2rem] p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="premium-eyebrow">Live route</p>
                  <h3 className="mt-2 text-2xl font-semibold">Kitchen to your table</h3>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" /> Online
                </span>
              </div>
              <div className="map-visual">
                <motion.div className="route-dot" animate={{ offsetDistance: ['0%', '100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
                <div className="route-pulse route-pulse-one" />
                <div className="route-pulse route-pulse-two" />
                <div className="map-card left-6 top-8"><ChefHat size={17} /> Kitchen</div>
                <div className="map-card bottom-8 right-6"><MapPin size={17} /> Your table</div>
                <div className="map-metric left-6 bottom-8">
                  <span>ETA</span>
                  <strong>24 min</strong>
                </div>
                <div className="map-metric right-6 top-8">
                  <span>Temp lock</span>
                  <strong>92%</strong>
                </div>
              </div>
            </Reveal>
            <div className="delivery-timeline grid gap-4">
              {deliverySteps.map((step, index) => {
                const Icon = step.icon
                return (
                <Reveal key={step.title} delay={index * 0.08} className={`timeline-row ${index <= 1 ? 'is-active' : ''}`}>
                  <span className="timeline-index">
                    <Icon size={20} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <span className="timeline-status">{step.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{step.text}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Update</p>
                    <p className="mt-1 font-semibold text-amber-100">{step.time}</p>
                  </div>
                </Reveal>
              )})}
            </div>
          </div>
        </section>

        <section id="app" className="container py-24">
          <div className="app-showcase grid gap-12 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
            <Reveal className="relative z-10">
              <p className="premium-eyebrow">Mobile app</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">Your private dining concierge, in one cinematic app.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Track every route, reorder signature dishes, unlock secret VIP menus, and chat with a live concierge from a polished app experience.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['4.9', 'App rating'],
                  ['24m', 'Avg delivery'],
                  ['VIP', 'Menus unlocked'],
                ].map(([value, label]) => (
                  <div key={label} className="app-stat">
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => handleStoreClick('App Store')} className="store-btn premium-store"><Apple size={20} /> App Store</button>
                <button onClick={() => handleStoreClick('Google Play')} className="store-btn premium-store"><Play size={20} /> Google Play</button>
              </div>
            </Reveal>
            <Reveal className="app-stage">
              <motion.div className="app-orbit app-orbit-one" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="app-orbit app-orbit-two" animate={{ rotate: -360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} />

              <div className="app-device-grid">
                <motion.div className="phone-mockup phone-main" whileHover={{ y: -10, rotate: 0, scale: 1.02 }}>
                  <div className="phone-screen app-main-screen">
                    <div className="flex items-center justify-between">
                      <p className="premium-eyebrow">VIP order</p>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-100 ring-1 ring-emerald-300/25">Live</span>
                    </div>
                    <h3 className="mt-5 text-3xl font-semibold">Truffle dinner</h3>
                    <div className="mt-6 overflow-hidden rounded-3xl">
                      <FallbackImage src={dishes[0].image} alt="Truffle dinner app preview" className="h-44 w-full object-cover" />
                    </div>
                    <div className="mt-6 space-y-3">
                      {deliverySteps.slice(0, 4).map((step, index) => (
                        <motion.div key={step.title} className="app-step" animate={{ opacity: index === 1 ? [0.72, 1, 0.72] : 1 }} transition={{ duration: 2, repeat: index === 1 ? Infinity : 0 }}>
                          <span>{index + 1}</span>
                          <p>{step.title}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="app-side-stack">
                  <Link to={`/menu/${dishes[1].slug}`}>
                  <motion.div className="app-floating-card app-menu-card text-left" animate={{ y: [-6, 6, -6] }} transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}>
                    <FallbackImage src={dishes[1].image} alt="Chef special" className="h-40 w-full rounded-2xl object-cover" />
                    <p className="mt-4 text-xs uppercase tracking-[0.26em] text-amber-200">Chef Special</p>
                    <h3 className="mt-2 text-2xl font-semibold">{dishes[1].name}</h3>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1 text-amber-200"><Star size={15} fill="currentColor" /> 5.0</span>
                      <span>22 min</span>
                    </div>
                  </motion.div>
                  </Link>

                  <motion.button onClick={() => document.getElementById('tracker')?.scrollIntoView({ behavior: 'smooth' })} className="app-floating-card app-route-card text-left" animate={{ y: [6, -6, 6] }} transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Route</span>
                      <span className="text-sm text-emerald-200">On time</span>
                    </div>
                    <div className="app-route-line mt-6">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span>Kitchen</span>
                      <strong className="text-amber-100">24 min</strong>
                      <span>Table</span>
                    </div>
                  </motion.button>

                  <div className="app-chip-row">
                    <motion.div className="app-chip app-chip-dispatch" animate={{ y: [-4, 4, -4] }} transition={{ duration: 4.5, repeat: Infinity }}>
                      <BadgeCheck size={16} /> Priority dispatch
                    </motion.div>
                    <motion.div className="app-chip app-chip-concierge" animate={{ y: [4, -4, 4] }} transition={{ duration: 4.8, repeat: Infinity }}>
                      <MessageCircle size={16} /> Concierge online
                    </motion.div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="container py-24">
          <Reveal className="cta-panel">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <p className="premium-eyebrow">Tonight only</p>
              <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Unlock 25% off your first Michelin-style delivery.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Use code CLOUD25 before the concierge kitchen closes tonight.</p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <MagneticButton onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-8 py-4 font-semibold text-slate-950">Order premium now</MagneticButton>
                <button onClick={() => setChatOpen(true)} className="rounded-full border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl">Talk to concierge</button>
              </div>
            </div>
          </Reveal>
        </section>
      </motion.main>

      <footer className="relative border-t border-white/10 bg-[#05070d]/80 py-14">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Cloud Kitchen" className="h-11 w-11 rounded-2xl bg-amber-300 p-2" />
              <p className="text-xl font-semibold">Cloud Kitchen</p>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">Premium food delivery with chef-led menus, live dispatch, and luxury presentation.</p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Instagram, label: 'Instagram preview is ready.' },
                { icon: MessageCircle, label: 'Concierge chat opened.', action: () => setChatOpen(true) },
                { icon: MapPin, label: 'Delivery zone highlighted.', action: () => document.getElementById('tracker')?.scrollIntoView({ behavior: 'smooth' }) },
              ].map(({ icon: Icon, label, action }, index) => (
                <button key={index} onClick={() => { action?.(); showToast(label); }} className="icon-btn"><Icon size={17} /></button>
              ))}
            </div>
          </div>
          <div>
            <p className="footer-title">Explore</p>
            {navLinks.slice(1, 5).map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="footer-link">{link}</a>)}
          </div>
          <div>
            <p className="footer-title">Contact</p>
            {['hello@cloudkitchen.com', '123 Cloud Lane', '09:00 - 23:00'].map((item) => <p key={item} className="mt-3 text-sm text-slate-400">{item}</p>)}
          </div>
          <div>
            <p className="footer-title">Newsletter</p>
            <div className="mt-4 flex gap-3">
              <input value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} type="email" placeholder="Email address" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              <button onClick={handleNewsletter} className="luxury-button rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 text-sm font-semibold text-slate-950">Join</button>
            </div>
          </div>
        </div>
      </footer>

      <MobileBottomNav active={bottomActive} onSelect={handleBottomSelect} />

      {chefStory && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-5 backdrop-blur-xl" onClick={() => setChefStory(null)}>
          <motion.div initial={{ opacity: 0, rotateX: -8, y: 24 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} className="chef-story-modal premium-panel max-w-4xl overflow-hidden rounded-[2rem]" onClick={(event) => event.stopPropagation()}>
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <FallbackImage src={chefStory.image} alt={chefStory.name} className="h-full min-h-[420px] w-full object-cover" />
              <div className="p-8 md:p-10">
                <p className="premium-eyebrow">Chef story</p>
                <h3 className="mt-4 text-4xl font-semibold">{chefStory.name}</h3>
                <p className="mt-3 text-amber-200">{chefStory.specialty}</p>
                <p className="mt-6 leading-8 text-slate-300">
                  {chefStory.name.split(' ')[1]} leads the kitchen pass with Michelin-style discipline: precise timing, high-heat finishing, and plating details engineered to survive delivery without losing texture.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="app-stat"><strong>{chefStory.exp}</strong><span>Experience</span></div>
                  <div className="app-stat"><strong>{chefStory.rating}</strong><span>Chef rating</span></div>
                  <div className="app-stat"><strong>Live</strong><span>Kitchen pass</span></div>
                </div>
                <button onClick={() => { setChefStory(null); setChatOpen(true); }} className="luxury-button mt-8 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 font-semibold text-slate-950">
                  Ask this chef
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-amber-200/20 bg-slate-950/85 px-5 py-4 text-sm text-white shadow-glow backdrop-blur-2xl md:bottom-8"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-amber-200" />
            <span>{toast}</span>
          </div>
        </motion.div>
      )}

      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950 shadow-glow">
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  )
}

export default App
