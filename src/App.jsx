import { useState, useEffect } from 'react'
import AddFragmentModal from './components/AddFragmentModal'
import FragmentCard from './components/FragmentCard'
import MasonryGrid from './components/MasonryGrid'
import {
  MEDIA_TYPES,
  MEDIA_TYPE_LABELS,
  MEDIA_TYPE_ICONS,
  getFragments,
  saveFragments,
  getDraft,
  saveDraft,
  clearDraft
} from './utils/storage'
import { mockFragments } from './data/mockData'
import './App.css'

const FILTER_OPTIONS = [
  { value: 'all', label: '全部', icon: '✦' },
  { value: MEDIA_TYPES.TEXT, label: MEDIA_TYPE_LABELS[MEDIA_TYPES.TEXT], icon: MEDIA_TYPE_ICONS[MEDIA_TYPES.TEXT] },
  { value: MEDIA_TYPES.IMAGE, label: MEDIA_TYPE_LABELS[MEDIA_TYPES.IMAGE], icon: MEDIA_TYPE_ICONS[MEDIA_TYPES.IMAGE] },
  { value: MEDIA_TYPES.COLOR_PALETTE, label: MEDIA_TYPE_LABELS[MEDIA_TYPES.COLOR_PALETTE], icon: MEDIA_TYPE_ICONS[MEDIA_TYPES.COLOR_PALETTE] },
  { value: MEDIA_TYPES.AUDIO_COVER, label: MEDIA_TYPE_LABELS[MEDIA_TYPES.AUDIO_COVER], icon: MEDIA_TYPE_ICONS[MEDIA_TYPES.AUDIO_COVER] }
]

export default function App() {
  const [fragments, setFragments] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [initialDraft, setInitialDraft] = useState(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = getFragments()
    if (stored && stored.length > 0) {
      setFragments(stored)
    } else {
      setFragments(mockFragments)
      saveFragments(mockFragments)
    }

    const draft = getDraft()
    if (draft) {
      setHasDraft(true)
    }

    requestAnimationFrame(() => {
      setLoaded(true)
    })
  }, [])

  const filteredFragments = fragments.filter((f) => {
    if (activeFilter === 'all') return true
    return f.type === activeFilter
  })

  const handleAddClick = () => {
    const draft = getDraft()
    setInitialDraft(draft)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setInitialDraft(null)
  }

  const handleSubmitFragment = (newFragment) => {
    const updatedFragments = [newFragment, ...fragments]
    setFragments(updatedFragments)
    saveFragments(updatedFragments)
    clearDraft()
    setHasDraft(false)
    setIsModalOpen(false)
    setInitialDraft(null)
  }

  const handleDraftSaved = (draft) => {
    saveDraft(draft)
    setHasDraft(true)
  }

  const handleClearDraft = () => {
    clearDraft()
    setHasDraft(false)
    if (isModalOpen) {
      setInitialDraft(null)
    }
  }

  const publishedCount = fragments.length
  const draftCount = hasDraft ? 1 : 0

  return (
    <div className={`app ${loaded ? 'app-loaded' : ''}`}>
      <header className="app-header">
        <div className="header-glow" />
        <div className="header-content">
          <div className="header-left">
            <div className="header-brand">
              <span className="brand-mark">◈</span>
              <div className="header-title">
                <h1>灵感碎片墙</h1>
                <p className="header-subtitle">深夜的灵光 · 俱乐部的拼贴画</p>
              </div>
            </div>
            <div className="header-stats">
              <span className="stat-chip">
                <span className="stat-num">{publishedCount}</span>
                <span className="stat-label">碎片</span>
              </span>
              {draftCount > 0 && (
                <span className="stat-chip stat-draft-chip">
                  <span className="stat-dot" />
                  <span className="stat-num">{draftCount}</span>
                  <span className="stat-label">草稿</span>
                  <button className="stat-clear-btn" onClick={handleClearDraft}>清除</button>
                </span>
              )}
            </div>
          </div>
          <div className="header-actions">
            {hasDraft && (
              <button className="btn btn-draft" onClick={handleAddClick}>
                <span className="draft-pulse" />
                继续编辑
              </button>
            )}
            <button className="btn btn-add" onClick={handleAddClick}>
              <span className="add-plus">+</span>
              添加碎片
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="filter-bar">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${activeFilter === option.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              <span className="filter-icon">{option.icon}</span>
              <span className="filter-label">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="fragments-container">
          {filteredFragments.length > 0 ? (
            <MasonryGrid gap={20}>
              {filteredFragments.map((fragment, index) => (
                <FragmentCard key={fragment.id} fragment={fragment} index={index} />
              ))}
            </MasonryGrid>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p className="empty-title">还没有这类碎片</p>
              <p className="empty-desc">点击「添加碎片」来记录你的灵感</p>
            </div>
          )}
        </div>
      </main>

      <AddFragmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFragment}
        initialDraft={initialDraft}
        onDraftSave={handleDraftSaved}
      />
    </div>
  )
}
