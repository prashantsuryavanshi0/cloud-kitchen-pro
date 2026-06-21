import React from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import App from './App'
import FoodDetailPage from './pages/FoodDetailPage'
import './index.css'
import './styles/fonts.css'
import './styles/theme.css'

function RoutedApp() {
  const location = useLocation()

  React.useEffect(() => {
    if (!location.hash) return
    const timeout = window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 120)
    return () => window.clearTimeout(timeout)
  }, [location])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/menu/:slug" element={<FoodDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  </React.StrictMode>
)
