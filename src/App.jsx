import { useState, useEffect, useMemo, useCallback } from 'react'
import AddFragmentModal from './components/AddFragmentModal'
import FragmentCard from './components/FragmentCard'
import FragmentDetail from './components/FragmentDetail'
import MasonryGrid from './components/MasonryGrid'
import SearchBar from './components/SearchBar'
import TagCloud from './components/TagCloud'
import SortSelector from './components/SortSelector'
import {
  MEDIA_TYPES,
  MEDIA_TYPE_LABELS,
  MEDIA_TYPE_ICONS,
  getFragments,
  saveFragments,
  getDraft,
  saveDraft,
  clearDraft,
  getUserPreferences,
  saveUserPreferences,
  SORT_OPTIONS,
  searchFragments,
  filterByTags,
  filterByType,
  sortFragments,
  getAllTags,
  getRelatedFragments
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [initialDraft, setInitialDraft] = useState(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [selectedFragment, setSelectedFragment] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

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

    const prefs = getUserPreferences()
    if (prefs) {
      if (prefs.sortBy) setSortBy(prefs.sortBy)
      if (prefs.selectedTags && prefs.selectedTags.length > 0) {
        setSelectedTags(prefs.selectedTags)
      }
    }

    requestAnimationFrame(() => {
      setLoaded(true)
    })
  }, [])

  const publishedFragments = useMemo(() =>
    fragments.filter(f => f.isPublished),
    [fragments]
  )

  const allTags = useMemo(() =>
    getAllTags(publishedFragments),
    [publishedFragments]
  )

  const filteredAndSortedFragments = useMemo(() => {
    let result = [...publishedFragments]
    result = filterByType(result, activeFilter)
    result = searchFragments(result, searchQuery)
    result = filterByTags(result, selectedTags)
    result = sortFragments(result, sortBy)
    return result
  }, [publishedFragments, activeFilter, searchQuery, selectedTags, sortBy])

  const hasActiveFilters = activeFilter !== 'all' || searchQuery.trim() || selectedTags.length > 0

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

  const handleTagToggle = useCallback((tag) => {
    if (!tag) {
      setSelectedTags([])
      saveUserPreferences({ sortBy, selectedTags: [] })
      return
    }

    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
      saveUserPreferences({ sortBy, selectedTags: newTags })
      return newTags
    })
  }, [sortBy])

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort)
    saveUserPreferences({ sortBy: newSort, selectedTags })
  }, [selectedTags])

  const handleClearFilters = () => {
    setActiveFilter('all')
    setSearchQuery('')
    setSelectedTags([])
    saveUserPreferences({ sortBy, selectedTags: [] })
  }

  const handleCardClick = useCallback((fragment) => {
    setSelectedFragment(fragment)
    setShowDetail(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setTimeout(() => setSelectedFragment(null), 300)
  }, [])

  const handlePrevFragment = useCallback(() => {
    if (!selectedFragment) return
    const currentIndex = filteredAndSortedFragments.findIndex(f => f.id === selectedFragment.id)
    if (currentIndex === -1) return
    const newIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : filteredAndSortedFragments.length - 1
    setSelectedFragment(filteredAndSortedFragments[newIndex])
  }, [selectedFragment, filteredAndSortedFragments])

  const handleNextFragment = useCallback(() => {
    if (!selectedFragment) return
    const currentIndex = filteredAndSortedFragments.findIndex(f => f.id === selectedFragment.id)
    if (currentIndex === -1) return
    const newIndex = currentIndex + 1 < filteredAndSortedFragments.length ? currentIndex + 1 : 0
    setSelectedFragment(filteredAndSortedFragments[newIndex])
  }, [selectedFragment, filteredAndSortedFragments])

  const handleRelatedClick = useCallback((fragmentId) => {
    const fragment = publishedFragments.find(f => f.id === fragmentId)
    if (fragment) {
      setSelectedFragment(fragment)
    }
  }, [publishedFragments])

  const relatedFragments = useMemo(() => {
    if (!selectedFragment) return []
    return getRelatedFragments(selectedFragment, publishedFragments)
  }, [selectedFragment, publishedFragments])

  const currentFragmentIndex = useMemo(() => {
    if (!selectedFragment) return -1
    return filteredAndSortedFragments.findIndex(f => f.id === selectedFragment.id)
  }, [selectedFragment, filteredAndSortedFragments])

  const publishedCount = fragments.filter(f => f.isPublished).length
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
        <div className="search-and-sort">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <SortSelector
            value={sortBy}
            onChange={handleSortChange}
          />
        </div>

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

        <TagCloud
          tags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagToggle}
        />

        {hasActiveFilters && (
          <div className="active-filters-info">
            <span>找到 {filteredAndSortedFragments.length} 个碎片</span>
            <button onClick={handleClearFilters}>清除筛选</button>
          </div>
        )}

        <div className="fragments-container">
          {filteredAndSortedFragments.length > 0 ? (
            <MasonryGrid gap={20}>
              {filteredAndSortedFragments.map((fragment, index) => (
                <FragmentCard
                  key={fragment.id}
                  fragment={fragment}
                  index={index}
                  onClick={() => handleCardClick(fragment)}
                />
              ))}
            </MasonryGrid>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p className="empty-title">没有找到匹配的碎片</p>
              <p className="empty-desc">试试调整筛选条件，或者清除筛选看看全部碎片</p>
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                清除筛选
              </button>
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

      {selectedFragment && (
        <FragmentDetail
          fragment={selectedFragment}
          isOpen={showDetail}
          onClose={handleCloseDetail}
          onPrev={handlePrevFragment}
          onNext={handleNextFragment}
          hasPrev={currentFragmentIndex > 0}
          hasNext={currentFragmentIndex < filteredAndSortedFragments.length - 1}
          relatedFragments={relatedFragments}
          onRelatedClick={handleRelatedClick}
        />
      )}
    </div>
  )
}