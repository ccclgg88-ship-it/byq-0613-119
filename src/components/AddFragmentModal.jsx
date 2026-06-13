import { useState, useEffect, useRef, useMemo } from 'react'
import FragmentCard from './FragmentCard'
import {
  MEDIA_TYPES,
  MEDIA_TYPE_LABELS,
  MEDIA_TYPE_ICONS,
  isValidHex,
  formatHex,
  validateImage,
  fileToDataURL,
  generateId,
  debounce
} from '../utils/storage'
import './AddFragmentModal.css'

const MAX_TAGS = 5
const MAX_COLORS = 5

export default function AddFragmentModal({ isOpen, onClose, onSubmit, initialDraft, onDraftSave }) {
  const [type, setType] = useState(MEDIA_TYPES.TEXT)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [tags, setTags] = useState([])
  const [colors, setColors] = useState([''])
  const [imageUrl, setImageUrl] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (initialDraft && isOpen) {
      setType(initialDraft.type || MEDIA_TYPES.TEXT)
      setTitle(initialDraft.title || '')
      setContent(initialDraft.content || '')
      setTags(initialDraft.tags || [])
      setColors(initialDraft.colors && initialDraft.colors.length > 0 ? initialDraft.colors : [''])
      setImageUrl(initialDraft.imageUrl || '')
    } else if (isOpen) {
      setType(MEDIA_TYPES.TEXT)
      setTitle('')
      setContent('')
      setTags([])
      setTagsInput('')
      setColors([''])
      setImageUrl('')
      setError('')
      setShowPreview(false)
    }
  }, [initialDraft, isOpen])

  const currentDraft = useMemo(() => ({
    type,
    title,
    content,
    tags,
    colors,
    imageUrl
  }), [type, title, content, tags, colors, imageUrl])

  const debouncedSaveDraft = useMemo(
    () =>
      debounce((draft) => {
        if (onDraftSave && (draft.title || draft.content || draft.tags.length > 0 || draft.imageUrl || draft.colors.some(c => c.trim()))) {
          onDraftSave(draft)
        }
      }, 500),
    [onDraftSave]
  )

  useEffect(() => {
    if (isOpen) {
      debouncedSaveDraft(currentDraft)
    }
  }, [currentDraft, isOpen, debouncedSaveDraft])

  const handleAddTag = (e) => {
    e.preventDefault()
    const tag = tagsInput.trim()
    if (!tag) return
    if (tags.length >= MAX_TAGS) {
      setError(`最多添加 ${MAX_TAGS} 个标签`)
      return
    }
    if (tags.includes(tag)) {
      setError('标签已存在')
      return
    }
    setTags([...tags, tag])
    setTagsInput('')
    setError('')
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleColorChange = (index, value) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  const handleAddColor = () => {
    if (colors.length >= MAX_COLORS) {
      setError(`最多添加 ${MAX_COLORS} 个色值`)
      return
    }
    setColors([...colors, ''])
    setError('')
  }

  const handleRemoveColor = (index) => {
    if (colors.length <= 1) {
      setError('至少保留 1 个色值')
      return
    }
    setColors(colors.filter((_, i) => i !== index))
    setError('')
  }

  const handleFileSelect = async (file) => {
    const validation = validateImage(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    try {
      const dataUrl = await fileToDataURL(file)
      setImageUrl(dataUrl)
      setError('')
    } catch (e) {
      setError('图片处理失败')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    setImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    if (!title.trim()) {
      setError('请输入标题')
      return false
    }

    if (type === MEDIA_TYPES.COLOR_PALETTE) {
      const validColors = colors.filter((c) => c.trim())
      if (validColors.length === 0) {
        setError('请至少输入 1 个色值')
        return false
      }
      for (const c of validColors) {
        if (!isValidHex(c)) {
          setError(`色值 ${c} 不是有效的 HEX 格式`)
          return false
        }
      }
    }

    if ((type === MEDIA_TYPES.IMAGE || type === MEDIA_TYPES.AUDIO_COVER) && !imageUrl) {
      setError('请上传图片')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const validColors = colors
      .filter((c) => c.trim())
      .map((c) => formatHex(c))

    const fragment = {
      id: generateId(),
      type,
      title: title.trim(),
      content: content.trim(),
      tags,
      colors: type === MEDIA_TYPES.COLOR_PALETTE ? validColors : [],
      imageUrl: imageUrl || '',
      createdAt: Date.now(),
      isPublished: true
    }

    onSubmit(fragment)
  }

  const getPreviewFragment = () => {
    const validColors = colors
      .filter((c) => c.trim() && isValidHex(c))
      .map((c) => formatHex(c))

    return {
      id: 'preview',
      type,
      title: title || '碎片标题',
      content: content || '碎片内容预览...',
      tags,
      colors: validColors,
      imageUrl: imageUrl || '',
      createdAt: Date.now(),
      isPublished: true
    }
  }

  const canPreview = title || content || imageUrl || colors.some(c => c.trim())

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <h2>添加灵感碎片</h2>
            <span className="modal-draft-tag">自动保存草稿</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <div className="modal-body">
          <div className="form-section">
            <div className="form-label">媒介类型</div>
            <div className="type-selector">
              {Object.values(MEDIA_TYPES).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`type-option ${type === t ? 'active' : ''}`}
                  onClick={() => setType(t)}
                >
                  <span className="type-icon">{MEDIA_TYPE_ICONS[t]}</span>
                  <span className="type-name">{MEDIA_TYPE_LABELS[t]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label" htmlFor="title">
              标题 <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的灵感起个名字"
              maxLength={100}
            />
          </div>

          {(type === MEDIA_TYPES.TEXT || type === MEDIA_TYPES.AUDIO_COVER) && (
            <div className="form-section">
              <label className="form-label" htmlFor="content">
                内容
              </label>
              <textarea
                id="content"
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="记录下你的灵感..."
                rows={4}
                maxLength={500}
              />
            </div>
          )}

          <div className="form-section">
            <label className="form-label">
              标签 <span className="hint">（最多 {MAX_TAGS} 个）</span>
            </label>
            <div className="tags-input-wrapper">
              <div className="tags-list">
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-item">
                    #{tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {tags.length < MAX_TAGS && (
                <form onSubmit={handleAddTag} className="tag-input-form">
                  <input
                    type="text"
                    className="tag-input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="输入标签后按回车"
                    maxLength={20}
                  />
                </form>
              )}
            </div>
          </div>

          {type === MEDIA_TYPES.COLOR_PALETTE && (
            <div className="form-section">
              <label className="form-label">
                色卡 HEX 色值 <span className="hint">（1–5 个）</span>
              </label>
              <div className="colors-list">
                {colors.map((color, idx) => (
                  <div key={idx} className="color-input-row">
                    <div
                      className="color-preview-dot"
                      style={{ backgroundColor: isValidHex(color) ? formatHex(color) : 'var(--bg-elevated)' }}
                    />
                    <input
                      type="text"
                      className="form-input color-input"
                      value={color}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      placeholder="#FFFFFF"
                      maxLength={7}
                    />
                    <button
                      type="button"
                      className="remove-color-btn"
                      onClick={() => handleRemoveColor(idx)}
                      disabled={colors.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {colors.length < MAX_COLORS && (
                  <button
                    type="button"
                    className="add-color-btn"
                    onClick={handleAddColor}
                  >
                    + 添加色值
                  </button>
                )}
              </div>
            </div>
          )}

          {(type === MEDIA_TYPES.IMAGE || type === MEDIA_TYPES.AUDIO_COVER) && (
            <div className="form-section">
              <label className="form-label">
                图片上传 <span className="required">*</span>
              </label>
              <p className="form-hint">支持 PNG、JPG、WebP 格式，单张不超过 5MB</p>
              {!imageUrl ? (
                <div
                  className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="drop-zone-content">
                    <div className="drop-icon">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 20V6M16 6l-5 5M16 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 20v4a2 2 0 002 2h16a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p>拖拽图片到此处，或点击选择文件</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="image-preview-wrapper">
                  <img src={imageUrl} alt="预览" className="image-preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    移除
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            {canPreview && (
              <button
                type="button"
                className="btn btn-ghost preview-toggle"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? '隐藏预览' : '预览效果'}
              </button>
            )}
          </div>
          <div className="footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              发布碎片
            </button>
          </div>
        </div>

        {showPreview && canPreview && (
          <div className="preview-section">
            <div className="preview-divider" />
            <div className="preview-header">
              <span className="preview-label">实时预览</span>
              <span className="preview-hint">发布后效果预览</span>
            </div>
            <div className="preview-card-wrapper">
              <FragmentCard fragment={getPreviewFragment()} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
