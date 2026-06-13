import { useState } from 'react'
import { MEDIA_TYPES, MEDIA_TYPE_ICONS, MEDIA_TYPE_LABELS } from '../utils/storage'
import './FragmentCard.css'

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
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString('zh-CN')
}

function ColorPalette({ colors }) {
  if (!colors || colors.length === 0) return null
  return (
    <div className="card-color-palette">
      {colors.map((color, idx) => (
        <div
          key={idx}
          className="color-swatch"
          style={{ backgroundColor: color }}
          title={color}
        >
          <span className="color-hex">{color}</span>
        </div>
      ))}
    </div>
  )
}

export default function FragmentCard({ fragment, onClick, index = 0 }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const {
    type,
    title,
    content,
    imageUrl,
    colors,
    tags = [],
    createdAt,
    isPublished = true
  } = fragment

  const hasImage = type === MEDIA_TYPES.IMAGE || type === MEDIA_TYPES.AUDIO_COVER
  const hasColors = type === MEDIA_TYPES.COLOR_PALETTE
  const hasContent = type === MEDIA_TYPES.TEXT || type === MEDIA_TYPES.AUDIO_COVER

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      className={`fragment-card ${isPublished ? 'published' : 'draft'} ${type}-card`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.6)}s` }}
    >
      <div className="card-pin">
        <div className="pin-dot" />
      </div>

      {hasImage && imageUrl && (
        <div className="card-image-container">
          {!imageLoaded && !imageError && (
            <div className="card-image-skeleton" />
          )}
          <img
            src={imageError ? PLACEHOLDER_IMAGE : imageUrl}
            alt={title}
            className={`card-image ${imageLoaded || imageError ? 'loaded' : ''}`}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          <div className="card-image-overlay" />
          {type === MEDIA_TYPES.AUDIO_COVER && (
            <div className="audio-play-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {hasImage && !imageUrl && (
        <div className="card-image-placeholder">
          <span>{MEDIA_TYPE_ICONS[type]}</span>
        </div>
      )}

      {hasColors && <ColorPalette colors={colors} />}

      <div className="card-content">
        <div className="card-type-badge">
          <span className="badge-icon">{MEDIA_TYPE_ICONS[type]}</span>
          <span className="badge-label">{MEDIA_TYPE_LABELS[type]}</span>
        </div>

        <div className="card-title" title={title}>
          <span className="title-text">{title}</span>
        </div>

        {hasContent && content && (
          <p className="card-text" title={content}>{content}</p>
        )}

        {tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="tag">#{tag}</span>
            ))}
            {tags.length > 3 && (
              <span className="tag tag-more">+{tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <span className="card-date">{formatDate(createdAt)}</span>
          {!isPublished && <span className="draft-badge">草稿</span>}
          {isHovered && isPublished && (
            <span className="card-readonly">只读</span>
          )}
        </div>
      </div>
    </div>
  )
}
