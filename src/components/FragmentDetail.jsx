import { useState, useEffect } from 'react'
import { MEDIA_TYPES, MEDIA_TYPE_LABELS, MEDIA_TYPE_ICONS } from '../utils/storage'
import './FragmentDetail.css'

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220">
    <rect width="400" height="220" fill="#232221"/>
    <g transform="translate(200, 95)">
      <rect x="-30" y="-25" width="60" height="50" rx="6" fill="none" stroke="#3a3836" stroke-width="2"/>
      <line x1="-30" y1="25" x2="30" y2="-25" stroke="#3a3836" stroke-width="2"/>
      <circle cx="-10" cy="-10" r="6" fill="#3a3836"/>
    </g>
    <text x="200" y="170" text-anchor="middle" fill="#9c9590" font-family="sans-serif" font-size="14">图片加载失败</text>
  </svg>`
)

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function FragmentDetail({ 
  fragment, 
  isOpen, 
  onClose, 
  onPrev, 
  onNext, 
  hasPrev, 
  hasNext,
  relatedFragments,
  onRelatedClick 
}) {
  const [imageError, setImageError] = useState(false)
  const [showImageZoom, setShowImageZoom] = useState(false)
  const [copiedColor, setCopiedColor] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setImageError(false)
      setShowImageZoom(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev()
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, hasPrev, hasNext, onPrev, onNext, onClose])

  const handleColorCopy = async (color) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(color)
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const handleImageClick = () => {
    if (fragment.type === MEDIA_TYPES.IMAGE || fragment.type === MEDIA_TYPES.AUDIO_COVER) {
      setShowImageZoom(true)
    }
  }

  if (!isOpen || !fragment) return null

  const { type, title, content, imageUrl, colors, tags = [], createdAt } = fragment
  const hasImage = type === MEDIA_TYPES.IMAGE || type === MEDIA_TYPES.AUDIO_COVER
  const hasColors = type === MEDIA_TYPES.COLOR_PALETTE
  const hasContent = type === MEDIA_TYPES.TEXT || type === MEDIA_TYPES.AUDIO_COVER

  return (
    <>
      <div className="detail-overlay" onClick={onClose} />
      
      <div className="detail-panel">
        <button className="detail-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="detail-navigation">
          <button 
            className={`nav-btn nav-prev ${!hasPrev ? 'disabled' : ''}`}
            onClick={onPrev}
            disabled={!hasPrev}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>上一条</span>
          </button>
          
          <button 
            className={`nav-btn nav-next ${!hasNext ? 'disabled' : ''}`}
            onClick={onNext}
            disabled={!hasNext}
          >
            <span>下一条</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="detail-content">
          <div className="detail-header">
            <div className="detail-type-badge">
              <span className="badge-icon">{MEDIA_TYPE_ICONS[type]}</span>
              <span className="badge-label">{MEDIA_TYPE_LABELS[type]}</span>
            </div>
            <span className="detail-date">{formatDate(createdAt)}</span>
          </div>

          <h1 className="detail-title">{title}</h1>

          {hasImage && (
            <div className="detail-image-container" onClick={handleImageClick}>
              <img
                src={imageError ? PLACEHOLDER_IMAGE : imageUrl}
                alt={title}
                className="detail-image"
                onError={() => setImageError(true)}
              />
              <div className="image-zoom-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M11 8v6M8 11h6" />
                </svg>
              </div>
              {type === MEDIA_TYPES.AUDIO_COVER && (
                <div className="audio-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {hasColors && (
            <div className="detail-colors">
              <h3 className="section-title">色卡</h3>
              <div className="colors-grid">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    className="color-item"
                    onClick={() => handleColorCopy(color)}
                    title={`点击复制 ${color}`}
                  >
                    <div 
                      className="color-preview" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="color-value">{color}</span>
                    {copiedColor === color && (
                      <span className="copy-success">✓ 已复制</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasContent && content && (
            <div className="detail-body">
              <p className="detail-text">{content}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="detail-tags">
              <h3 className="section-title">标签</h3>
              <div className="tags-list">
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {relatedFragments && relatedFragments.length > 0 && (
            <div className="detail-related">
              <h3 className="section-title">相关碎片</h3>
              <div className="related-list">
                {relatedFragments.map((rel) => (
                  <button
                    key={rel.id}
                    className="related-item"
                    onClick={() => onRelatedClick(rel.id)}
                  >
                    {rel.type === MEDIA_TYPES.COLOR_PALETTE && rel.colors && (
                      <div className="related-colors">
                        {rel.colors.slice(0, 3).map((c, i) => (
                          <div key={i} className="mini-color" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    )}
                    {hasImage && rel.imageUrl && (
                      <img src={rel.imageUrl} alt={rel.title} className="related-thumb" />
                    )}
                    <div className="related-info">
                      <span className="related-title">{rel.title}</span>
                      <span className="related-match">
                        {rel.matchScore} 个标签匹配
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showImageZoom && imageUrl && (
        <div className="image-zoom-overlay" onClick={() => setShowImageZoom(false)}>
          <button className="zoom-close" onClick={() => setShowImageZoom(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={imageError ? PLACEHOLDER_IMAGE : imageUrl}
            alt={title}
            className="zoom-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}