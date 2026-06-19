import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Bell, ChevronDown, ChevronUp, Heart, Menu, Search, Send, ShoppingCart, Star, SunMoon, Truck, X } from 'lucide-react'
import CartSidebar from './components/CartSidebar'
import ChatbotPanel from './components/ChatbotPanel'
import FloatingBackground from './components/FloatingBackground'
import MegaMenu from './components/MegaMenu'
import MiniCheckoutDrawer from './components/MiniCheckoutDrawer'
import MobileBottomNav from './components/MobileBottomNav'
import SearchOverlay from './components/SearchOverlay'
import WishlistPanel from './components/WishlistPanel'
import logoImg from './assets/logo.svg'
import FallbackImage from './components/FallbackImage'

const heroSlides = [
  'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/128848/pexels-photo-128848.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1600',
]
const heroBackground = heroSlides[0]

const navLinks = ['Home', 'Menu', 'Offers', 'Reviews', 'Contact']

// Use real food photography only for the hero slideshow and dishes

// heroCards removed: single hero image will be used on the right column

const dishes = [
  {
    name: 'Cloud Pizza',
    price: '₹18',
    label: 'Signature',
    description: 'Wood-fired crust, truffle oil, basil.',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Smash Burger',
    price: '₹15',
    label: 'Premium',
    description: 'Double patty, cheddar, secret sauce.',
    image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Royal Biryani',
    price: '₹20',
    label: 'Spiced',
    description: 'Aromatic saffron rice, tender chicken.',
    image: 'https://images.pexels.com/photos/9738983/pexels-photo-9738983.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Velvet Pasta',
    price: '₹16',
    label: 'Creamy',
    description: 'Black truffle, parmesan, basil.',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Chili Momos',
    price: '₹12',
    label: 'Crispy',
    description: 'Steam-baked dumplings with chili.',
    image: 'https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Gold Dessert',
    price: '₹11',
    label: 'Decadent',
    description: 'Salted caramel, berry compote.',
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]
const stats = [
  { value: '1k+', label: 'Orders Delivered' },
  { value: '4.9', label: 'Average Rating' },
  { value: '30 min', label: 'Fast Delivery' },
  { value: '100% Fresh', label: 'Ingredients' },
]
const whyItems = [
  { title: 'Fresh Ingredients', description: 'Sourced daily from premium farms.', icon: Star },
  { title: 'Fast Delivery', description: 'Citywide delivery in under 30 minutes.', icon: Truck },
  { title: 'Hygienic Kitchen', description: 'Sanitized prep with certified chefs.', icon: Heart },
  { title: 'Affordable Prices', description: 'Luxury tastes without the premium markup.', icon: Bell },
]
const steps = ['Choose Food', 'Place Order', 'Fast Delivery', 'Enjoy Meal']
const faqs = [
  { question: 'How soon will my order arrive?', answer: 'Most orders arrive within 30 minutes with live tracking.' },
  { question: 'Do you offer contactless delivery?', answer: 'Yes, all deliveries are contactless and sealed for safety.' },
  { question: 'Can I customize my dish?', answer: 'Absolutely. Choose your add-ons and spice levels from the menu.' },
  { question: 'Is there a subscription for frequent orders?', answer: 'Yes, unlock VIP perks, discounts, and free delivery via subscription.' },
]
const reviews = [
  { name: 'Aarav', text: 'Premium flavors delivered fast. The app feels next-level.', rating: 5 },
  { name: 'Mira', text: 'The cloud kitchen experience is elegant and delicious.', rating: 5 },
  { name: 'Dev', text: 'Loved the packaging and the fast delivery. Total luxury.', rating: 5 },
]
const gallery = dishes.map((dish) => ({ src: dish.image, alt: dish.name }))

function getFallbackForDish() {
  return heroBackground
}

function SectionTitle({ label, title }) {
  return (
    <div className="mb-10 max-w-xl">
      <p className="uppercase tracking-[0.4em] text-sm text-secondary/90">{label}</p>
      <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-white">{title}</h2>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqActive, setFaqActive] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bottomActive, setBottomActive] = useState('home')
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [slideIndex, setSlideIndex] = useState(0)
  const prevSlide = useRef(slideIndex)
  const [galleryParallax, setGalleryParallax] = useState(() => gallery.map(() => ({ x: 0, y: 0 })))
  const galleryFloatOffsets = [-8, -12, -6, -8, -12, -6]
  const galleryFloatDurations = [4.5, 5.5, 4.8, 5.2, 4.6, 5.1]

  const handleGalleryPointerMove = (index) => (event) => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10

    setGalleryParallax((current) => {
      const next = [...current]
      next[index] = { x, y }
      return next
    })
  }

  const handleGalleryPointerLeave = (index) => () => {
    setGalleryParallax((current) => {
      const next = [...current]
      next[index] = { x: 0, y: 0 }
      return next
    })
  }

  const addToCart = (dish) => {
    setCartItems((current) => [...current, dish])
    setCartOpen(true)
    setDrawerOpen(true)
  }

  const handleBottomSelect = (value) => {
    setBottomActive(value)
    if (value === 'search') setSearchOpen(true)
    if (value === 'chat') setChatOpen(true)
    if (value === 'cart') setCartOpen(true)
    if (value === 'menu') {
      const menuSection = document.getElementById('menu')
      menuSection?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addToWishlist = (dish) => {
    setWishlistItems((current) => {
      if (current.some((item) => item.name === dish.name)) return current
      return [...current, dish]
    })
  }

  const removeFromCart = (index) => setCartItems((current) => current.filter((_, idx) => idx !== index))

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 900)
    return () => clearTimeout(timer)
  }, [])

  // Hero slideshow cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((s) => (s + 1) % heroSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Preload next slide for smooth transition
  useEffect(() => {
    const next = (slideIndex + 1) % heroSlides.length
    const img = new Image()
    img.src = heroSlides[next]
    prevSlide.current = slideIndex
  }, [slideIndex])

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0)
      setShowBackToTop(scrollTop > 400)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    if (theme === 'light') {
      document.body.style.background = '#f8fafc'
      document.body.style.color = '#0f172a'
    } else {
      document.body.style.background = 'radial-gradient(circle at top left, rgba(255, 107, 53, 0.12), transparent 20%), radial-gradient(circle at bottom right, rgba(255, 182, 39, 0.14), transparent 18%), #0f172a'
      document.body.style.color = '#ffffff'
    }
  }, [theme])

  return (
    <div className="relative overflow-hidden bg-darkbg text-white">
      <FloatingBackground />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} onRemove={removeFromCart} />
      <WishlistPanel open={wishlistOpen} onClose={() => setWishlistOpen(false)} wishlist={wishlistItems} />
      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <MiniCheckoutDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={cartItems} />
      {!loaded && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-darkbg">
          <motion.div
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary"
          >
            <div className="h-16 w-16 rounded-full bg-[#0f172a] border border-white/10" />
          </motion.div>
        </div>
      )}

      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-white/10">
        <motion.div className="h-full bg-gradient-to-r from-primary via-secondary to-yellow-300" animate={{ width: `${scrollProgress}%` }} />
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-darkbg/70 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-glow">
              <img src={logoImg} alt="Cloud Kitchen logo" className="h-10 w-10" />
            </div>
            <div>
              <p className="font-semibold">Cloud Kitchen</p>
              <p className="text-xs text-slate-400">Premium foodtech</p>
            </div>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-slate-300 hover:text-white">
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/15 md:inline-flex">
              <Search size={16} /> Search
            </button>
            <button onClick={() => setMegaOpen(!megaOpen)} className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10 md:inline-flex">
              Mega Menu
            </button>
            <button className="hidden items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/15 md:inline-flex" onClick={() => setChatOpen(true)}>
              <Send size={16} /> Chat
            </button>
            <button onClick={() => setCartOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15" aria-label="Cart">
              <ShoppingCart size={18} />
            </button>
            <button onClick={() => setWishlistOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15" aria-label="Wishlist">
              <Heart size={18} />
            </button>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              <SunMoon size={18} />
            </button>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/10 bg-darkbg/95 md:hidden">
            <div className="container flex flex-col gap-4 py-5">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-white/90 text-base">{link}</a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      <MegaMenu open={megaOpen} />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-gradient-to-br from-secondary/40 to-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-3xl" />

        <section id="home" className="relative min-h-screen overflow-hidden py-24">
          <div className="absolute inset-0 bg-black/70" />
          {/* Slideshow background layers */}
          <div className="absolute inset-0">
            <motion.div key={slideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSlides[slideIndex]})` }} />
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSlides[prevSlide.current] || heroSlides[0]})` }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/80" />
          <motion.div
            initial={{ opacity: 0.6, scale: 1.02 }}
            animate={{ opacity: [0.6, 0.78, 0.6], scale: [1.02, 1, 1.02] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
          />
          <motion.div
            animate={{ x: [-18, 18, -18], y: [0, -14, 0], opacity: [0.24, 0.44, 0.24] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-10 top-16 h-72 w-72 rounded-full bg-orange-400/15 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 16, 0], y: [0, 10, 0], opacity: [0.18, 0.38, 0.18] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute right-16 top-28 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"
          />
          <motion.div
            animate={{ x: [-10, 10, -10], y: [0, -12, 0], opacity: [0.16, 0.35, 0.16] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -12, 0], y: [0, 8, 0], opacity: [0.18, 0.38, 0.18] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute right-10 top-1/3 h-28 w-28 rounded-full bg-white/10 blur-3xl"
          />
          <div className="container relative z-20 grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }} className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-secondary backdrop-blur-xl">
                New launch — premium gastronomy delivered to your door
              </p>
              <h1 className="mt-8 text-5xl font-semibold leading-tight text-white md:text-6xl">
                Experience Michelin-level <span className="text-gradient bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">restaurant cuisine</span> at home.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Order fine dining favorites, crafted by top chefs and delivered in premium packaging with next-level speed.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-orange-500/20 transition hover:-translate-y-1">
                  Order Now <ArrowRight size={18} />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-4 text-base text-white transition hover:bg-white/15" onClick={() => setDrawerOpen(true)}>
                  Quick Checkout
                </button>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-5">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="mx-auto w-full max-w-2xl">
              <div className="flex items-center justify-center relative">
                <motion.div className="w-full rounded-[28px] overflow-hidden border border-white/10 shadow-soft backdrop-blur-sm relative" animate={{ y: [-6, 6, -6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                  <FallbackImage src={heroBackground} loading="lazy" alt="Hero food" className="w-full h-[520px] min-h-[320px] object-cover" />

                  {/* Floating small food cards placed inside hero image wrapper to avoid overlapping text */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div className="absolute top-6 right-6 h-36 w-36 rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-soft" animate={{ y: [-8, 8, -8] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
                      <FallbackImage src={dishes[0].image} loading="lazy" alt={dishes[0].name} className="h-full w-full object-cover" fallback={getFallbackForDish(dishes[0].name)} />
                    </motion.div>

                    <motion.div className="absolute bottom-6 left-6 h-32 w-32 rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-soft" animate={{ y: [8, -8, 8] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <FallbackImage src={dishes[1].image} loading="lazy" alt={dishes[1].name} className="h-full w-full object-cover" fallback={getFallbackForDish(dishes[1].name)} />
                    </motion.div>

                    <motion.div className="absolute right-8 top-1/2 h-28 w-28 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-soft" animate={{ y: [-6, 6, -6] }} transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <FallbackImage src={dishes[4].image} loading="lazy" alt={dishes[4].name} className="h-full w-full object-cover" fallback={getFallbackForDish(dishes[4].name)} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="container py-24">
          <SectionTitle label="Trust" title="Why thousands choose our kitchen" />
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -8 }} className="glass-card p-8 text-center shadow-md shadow-black/20">
                <p className="text-4xl font-semibold text-white">{stat.value}</p>
                <p className="mt-3 text-sm text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="menu" className="container py-24">
          <SectionTitle label="Popular Dishes" title="Our premium signature menu" />
          <div className="grid gap-8 lg:grid-cols-3">
              {dishes.map((dish, index) => (
              <motion.article
                key={dish.name}
                whileHover={{ y: -16, rotateX: 4, rotateY: 5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/80 shadow-soft backdrop-blur-xl"
              >
                <div className="relative overflow-hidden">
                  <FallbackImage
                    src={dish.image}
                    loading="lazy"
                    alt={dish.name}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    fallback={
                      dish.name === 'Royal Biryani'
                        ? 'https://images.pexels.com/photos/9738983/pexels-photo-9738983.jpeg?auto=compress&cs=tinysrgb&w=900'
                        : dish.name === 'Chili Momos'
                        ? 'https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&w=900'
                        : getFallbackForDish(dish.name)
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-6 top-6 rounded-full bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200">{dish.label}</div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-200">{dish.name}</p>
                      <p className="text-xs text-slate-400">{dish.description}</p>
                    </div>
                    <p className="text-2xl font-semibold text-white">{dish.price}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <button onClick={() => addToWishlist(dish)} className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10">
                      Wishlist
                    </button>
                    <button onClick={() => addToCart(dish)} className="rounded-full bg-gradient-to-r from-orange-400 to-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-soft transition hover:scale-[1.02]">
                      Add
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="why" className="container py-24">
          <SectionTitle label="Why Choose Us" title="Perfect reasons to order from us" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.title} whileHover={{ y: -8 }} className="glass-card p-8 shadow-soft">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-secondary">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section id="process" className="container py-24">
          <SectionTitle label="How It Works" title="Order in four simple steps" />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div key={step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-8 text-center shadow-soft">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-darkbg text-2xl">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{step}</h3>
                <p className="mt-3 text-sm text-slate-300">{index === 0 ? 'Browse our curated menu and choose top dishes.' : index === 1 ? 'Secure checkout with instant order confirmation.' : index === 2 ? 'Live delivery tracking ships food hot and fast.' : 'Enjoy every bite of your restaurant-quality meal.'}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="offers" className="container py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <SectionTitle label="Special Offers" title="Limited time premium deals" />
              <div className="grid gap-6 sm:grid-cols-2">
                <motion.div whileHover={{ y: -8 }} className="glass-card rounded-[32px] p-8 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.3em] text-secondary">Exclusive</p>
                  <h3 className="mt-4 text-3xl font-semibold text-white">25% off</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Use code CLOUD25 on your first premium order.</p>
                </motion.div>
                <motion.div whileHover={{ y: -8 }} className="glass-card rounded-[32px] p-8 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.3em] text-secondary">Flash Sale</p>
                  <h3 className="mt-4 text-3xl font-semibold text-white">Free delivery</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">On all orders above $30 today only.</p>
                </motion.div>
              </div>
            </div>
            <div className="glass-card rounded-[40px] border border-white/10 p-10 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Countdown</p>
              <h3 className="mt-4 text-3xl font-semibold text-white">Limited time offer</h3>
              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                {['12h', '45m', '32s', 'Left'].map((label) => (
                  <div key={label} className="rounded-3xl bg-white/5 px-4 py-5 text-center">
                    <p className="text-2xl font-semibold text-white">{label}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.23em] text-slate-400">{label === 'Left' ? 'Hurry' : label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <input type="text" placeholder="Enter coupon code" className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-secondary focus:outline-none" />
                <button className="rounded-3xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-sm font-semibold text-darkbg">Apply</button>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="container py-24">
          <SectionTitle label="Customer Reviews" title="What our diners say" />
          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div key={review.name} whileHover={{ y: -10 }} className="glass-card p-8 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-3xl bg-secondary/20 text-2xl">{review.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-white">{review.name}</p>
                    <p className="text-sm text-slate-400">Customer</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-slate-300">“{review.text}”</p>
                <div className="mt-6 flex items-center gap-2 text-secondary">
                  {[...Array(review.rating)].map((_, idx) => (<Star key={idx} size={16} />))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="gallery" className="container py-24">
          <SectionTitle label="Gallery" title="A glimpse of our gourmet food" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.1, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-[32px] bg-white/5 shadow-soft"
                onPointerMove={handleGalleryPointerMove(index)}
                onPointerLeave={handleGalleryPointerLeave(index)}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -left-10 top-1/3 h-40 w-40 rounded-full bg-orange-400/15 blur-3xl" />
                </div>

                <motion.div
                  animate={{
                    y: [0, galleryFloatOffsets[index % galleryFloatOffsets.length], 0],
                    x: [0, 2, 0],
                  }}
                  transition={{ duration: galleryFloatDurations[index % galleryFloatDurations.length], repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="relative overflow-hidden"
                >
                  <FallbackImage
                    src={image.src}
                    loading="lazy"
                    alt={image.alt}
                    className="h-72 w-full object-cover transition-transform duration-500 ease-in-out"
                    fallback={getFallbackForDish(image.alt)}
                    style={{
                      transform: `translate3d(${galleryParallax[index]?.x ?? 0}px, ${galleryParallax[index]?.y ?? 0}px, 0)`,
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-[-100%] top-0 h-full w-24 bg-white/10 opacity-0 blur-xl transition duration-500 group-hover:translate-x-full group-hover:opacity-60" />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="app" className="container py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionTitle label="Mobile App" title="Order faster with our app" />
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                Track orders, claim rewards and unlock VIP offers with our custom mobile experience. Designed for food lovers who want premium convenience.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15">
                  App Store
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-sm font-semibold text-darkbg">
                  Google Play
                </button>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="relative mx-auto max-w-md rounded-[48px] border border-white/10 bg-slate-950/60 p-8 shadow-soft">
              <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-secondary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[36px] bg-[#0f172a] p-6">
                <div className="mb-6 h-80 rounded-[28px] bg-gradient-to-br from-[#1f2937] to-[#111827] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-400">App preview</span>
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-300">Online</div>
                  </div>
                  <div className="mt-12 space-y-4">
                    <div className="rounded-3xl bg-white/5 p-4 text-sm">Track your order in real time with a live route view.</div>
                    <div className="rounded-3xl bg-white/5 p-4 text-sm">Save favorite dishes and reorder in one tap.</div>
                    <div className="rounded-3xl bg-white/5 p-4 text-sm">Unlock exclusive offers and VIP discounts instantly.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="faq" className="container py-24">
          <SectionTitle label="FAQ" title="Frequently asked questions" />
          <div className="grid gap-4">
            {faqs.map((item, index) => (
              <motion.div key={item.question} className="glass-card overflow-hidden rounded-[32px] border border-white/10">
                <button onClick={() => setFaqActive(index === faqActive ? -1 : index)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                  <span className="text-base font-semibold text-white">{item.question}</span>
                  <ChevronDown className={`transition ${faqActive === index ? 'rotate-180' : ''}`} />
                </button>
                {faqActive === index && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-6 pb-6 text-sm leading-7 text-slate-300">
                    {item.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="container py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionTitle label="Contact" title="Reserve your next gourmet order" />
              <p className="max-w-xl text-lg leading-8 text-slate-300">Send a message for special catering requests, partnerships, or premium order support.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['hello@cloudkitchen.com', 'Mon-Fri 09:00 - 22:00', '123 Cloud Lane', 'Live Chat Support'].map((text) => (
                  <div key={text} className="glass-card rounded-[32px] p-6 text-sm text-slate-300">{text}</div>
                ))}
              </div>
            </div>
            <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[40px] p-8 shadow-soft">
              <div className="grid gap-4">
                <input className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-white placeholder:text-slate-500" type="text" placeholder="Your name" />
                <input className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-white placeholder:text-slate-500" type="email" placeholder="Email address" />
                <textarea className="min-h-[160px] rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-white placeholder:text-slate-500" placeholder="Tell us about your order" />
                <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-sm font-semibold text-darkbg">Send Message</button>
              </div>
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-darkbg/80 py-12">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-xl font-semibold">Cloud Kitchen</p>
            <p className="mt-4 text-sm text-slate-400">Luxury food delivery with premium presentation and fast service.</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300">
            <a href="#menu">Menu</a>
            <a href="#offers">Offers</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-secondary">Newsletter</p>
            <div className="mt-4 flex gap-3">
              <input type="email" placeholder="Email address" className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              <button className="rounded-3xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-darkbg">Join</button>
            </div>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-darkbg shadow-glow transition hover:scale-105">
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  )
}

export default App
