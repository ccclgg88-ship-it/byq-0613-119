export const MEDIA_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  COLOR_PALETTE: 'color_palette',
  AUDIO_COVER: 'audio_cover'
}

export const MEDIA_TYPE_LABELS = {
  [MEDIA_TYPES.TEXT]: '文字',
  [MEDIA_TYPES.IMAGE]: '图片',
  [MEDIA_TYPES.COLOR_PALETTE]: '色卡',
  [MEDIA_TYPES.AUDIO_COVER]: '音频封面'
}

export const MEDIA_TYPE_ICONS = {
  [MEDIA_TYPES.TEXT]: '📝',
  [MEDIA_TYPES.IMAGE]: '🖼️',
  [MEDIA_TYPES.COLOR_PALETTE]: '🎨',
  [MEDIA_TYPES.AUDIO_COVER]: '🎵'
}

const STORAGE_KEYS = {
  FRAGMENTS: 'inspiration_fragments',
  DRAFT: 'inspiration_draft',
  DRAFT_UPDATED_AT: 'inspiration_draft_updated_at',
  USER_PREFERENCES: 'inspiration_preferences'
}

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE_AZ: 'title_az'
}

export const SORT_LABELS = {
  [SORT_OPTIONS.NEWEST]: '最新优先',
  [SORT_OPTIONS.OLDEST]: '最早优先',
  [SORT_OPTIONS.TITLE_AZ]: '标题 A–Z'
}

export function getUserPreferences() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    return data ? JSON.parse(data) : { sortBy: SORT_OPTIONS.NEWEST, selectedTags: [] }
  } catch {
    return { sortBy: SORT_OPTIONS.NEWEST, selectedTags: [] }
  }
}

export function saveUserPreferences(preferences) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences))
  } catch (e) {
    console.error('保存用户偏好失败:', e)
  }
}

const DRAFT_EXPIRY_DAYS = 7

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function isValidHex(hex) {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export function formatHex(hex) {
  if (!hex) return ''
  let h = hex.trim()
  if (!h.startsWith('#')) {
    h = '#' + h
  }
  return h.toUpperCase()
}

export function getFragments() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FRAGMENTS)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveFragments(fragments) {
  try {
    localStorage.setItem(STORAGE_KEYS.FRAGMENTS, JSON.stringify(fragments))
  } catch (e) {
    console.error('保存碎片失败:', e)
  }
}

export function getDraft() {
  try {
    const updatedAt = localStorage.getItem(STORAGE_KEYS.DRAFT_UPDATED_AT)
    if (updatedAt) {
      const updatedTime = parseInt(updatedAt, 10)
      const now = Date.now()
      const daysDiff = (now - updatedTime) / (1000 * 60 * 60 * 24)
      if (daysDiff > DRAFT_EXPIRY_DAYS) {
        clearDraft()
        return null
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveDraft(draft) {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft))
    localStorage.setItem(STORAGE_KEYS.DRAFT_UPDATED_AT, Date.now().toString())
  } catch (e) {
    console.error('保存草稿失败:', e)
  }
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEYS.DRAFT)
  localStorage.removeItem(STORAGE_KEYS.DRAFT_UPDATED_AT)
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function validateImage(file) {
  const maxSize = 5 * 1024 * 1024
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '仅支持 PNG、JPG、WebP 格式的图片' }
  }
  if (file.size > maxSize) {
    return { valid: false, error: '图片大小不能超过 5MB' }
  }
  return { valid: true, error: null }
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function searchFragments(fragments, query) {
  if (!query || !query.trim()) return fragments
  
  const lowerQuery = query.toLowerCase().trim()
  return fragments.filter(fragment => {
    const titleMatch = fragment.title && fragment.title.toLowerCase().includes(lowerQuery)
    const contentMatch = fragment.content && fragment.content.toLowerCase().includes(lowerQuery)
    const tagsMatch = fragment.tags && fragment.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    return titleMatch || contentMatch || tagsMatch
  })
}

export function filterByTags(fragments, tags) {
  if (!tags || tags.length === 0) return fragments
  
  return fragments.filter(fragment => {
    return tags.every(tag => fragment.tags && fragment.tags.includes(tag))
  })
}

export function filterByType(fragments, type) {
  if (!type || type === 'all') return fragments
  return fragments.filter(fragment => fragment.type === type)
}

export function sortFragments(fragments, sortBy) {
  const sorted = [...fragments]
  
  switch (sortBy) {
    case SORT_OPTIONS.NEWEST:
      return sorted.sort((a, b) => b.createdAt - a.createdAt)
    case SORT_OPTIONS.OLDEST:
      return sorted.sort((a, b) => a.createdAt - b.createdAt)
    case SORT_OPTIONS.TITLE_AZ:
      return sorted.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase()
        const titleB = (b.title || '').toLowerCase()
        return titleA.localeCompare(titleB)
      })
    default:
      return sorted
  }
}

export function getAllTags(fragments) {
  const tagCount = {}
  fragments.forEach(fragment => {
    if (fragment.tags) {
      fragment.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedFragments(currentFragment, allFragments, limit = 4) {
  const currentTags = currentFragment.tags || []
  if (currentTags.length === 0) return []
  
  return allFragments
    .filter(f => f.id !== currentFragment.id && f.isPublished)
    .map(f => {
      const commonTags = (f.tags || []).filter(tag => currentTags.includes(tag))
      return {
        ...f,
        matchScore: commonTags.length
      }
    })
    .filter(f => f.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}
