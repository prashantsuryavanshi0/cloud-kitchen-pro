import React from 'react'
export default function FallbackImage({ src, alt, className, loading = 'lazy', fallback, ...rest }) {
  const handleError = (e) => {
    const img = e.currentTarget
    if (img.dataset.failed) return
    if (fallback && img.src !== fallback) {
      img.dataset.failed = 'true'
      img.src = fallback
    } else {
      img.dataset.failed = 'true'
    }
  }

  return <img src={src} alt={alt} className={className} loading={loading} onError={handleError} {...rest} />
}
