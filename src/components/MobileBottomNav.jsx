import { Home, List, MessagesSquare, Search, ShoppingBag } from 'lucide-react'

export default function MobileBottomNav({ active, onSelect }) {
  const buttons = [
    { label: 'Home', icon: Home, value: 'home' },
    { label: 'Menu', icon: List, value: 'menu' },
    { label: 'Search', icon: Search, value: 'search' },
    { label: 'Chat', icon: MessagesSquare, value: 'chat' },
    { label: 'Cart', icon: ShoppingBag, value: 'cart' },
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-full border border-white/10 bg-slate-950/95 px-4 py-3 shadow-soft backdrop-blur-xl md:hidden">
      {buttons.map((button) => {
        const Icon = button.icon
        const selected = active === button.value
        return (
          <button key={button.value} onClick={() => onSelect(button.value)} className={`flex flex-col items-center gap-1 rounded-3xl px-3 py-2 text-xs transition ${selected ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Icon size={20} />
            {button.label}
          </button>
        )
      })}
    </div>
  )
}
