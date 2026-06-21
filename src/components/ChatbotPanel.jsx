import { motion } from 'framer-motion'
import { MessageSquare, Send, X } from 'lucide-react'
import { useState } from 'react'

export default function ChatbotPanel({ open, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! Ready for a premium meal recommendation?' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg = { sender: 'user', text: input }
    const botMsg = { sender: 'bot', text: 'Perfect choice! Our chef suggests the Royal Biryani with sides.' }
    setMessages((current) => [...current, userMsg, botMsg])
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : 40 }}
      transition={{ duration: 0.35 }}
      className={`fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-[36px] border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl ${open ? 'block' : 'hidden'}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-darkbg">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="font-semibold text-white">Cloud Assistant</p>
            <p className="text-xs text-slate-400">Ask anything about orders or meals.</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-white hover:bg-white/10">
          <X size={18} />
        </button>
      </div>
      <div className="max-h-72 space-y-4 overflow-y-auto px-5 py-4 text-sm">
        {messages.map((message, index) => (
          <div key={index} className={`rounded-3xl p-4 ${message.sender === 'bot' ? 'bg-white/5 text-slate-200' : 'bg-gradient-to-r from-primary/15 to-secondary/15 text-white self-end'}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
          placeholder="Ask about menu or delivery"
          className="flex-1 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/40"
        />
        <button onClick={send} className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white shadow-soft">
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  )
}
