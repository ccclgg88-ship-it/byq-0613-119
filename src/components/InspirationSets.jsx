import { useState } from 'react'
import './InspirationSets.css'

const SET_ICONS = ['📁', '📚', '🎨', '🎵', '✦', '⭐', '💡', '🌙', '🔥', '🌈']

const PRESET_COLORS = [
  '#D4A574', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'
]

export default function InspirationSets({ 
  sets, 
  favoritesCount, 
  activeView, 
  onViewChange, 
  onCreateSet, 
  onUpdateSet, 
  onDeleteSet 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSet, setEditingSet] = useState(null)
  const [newSetName, setNewSetName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('📁')
  const [selectedColor, setSelectedColor] = useState('#D4A574')

  const handleCreateSet = () => {
    if (!newSetName.trim()) return
    onCreateSet(newSetName.trim(), selectedColor, selectedIcon)
    setNewSetName('')
    setSelectedIcon('📁')
    setSelectedColor('#D4A574')
    setShowCreateForm(false)
  }

  const handleUpdateSet = () => {
    if (!editingSet || !newSetName.trim()) return
    onUpdateSet(editingSet.id, { 
      name: newSetName.trim(), 
      color: selectedColor, 
      icon: selectedIcon 
    })
    setEditingSet(null)
    setNewSetName('')
    setShowCreateForm(false)
  }

  const handleDeleteSet = (setId) => {
    if (confirm('确定要删除这个灵感集吗？碎片本身不会被删除。')) {
      onDeleteSet(setId)
    }
  }

  const startEdit = (set) => {
    setEditingSet(set)
    setNewSetName(set.name)
    setSelectedIcon(set.icon)
    setSelectedColor(set.color)
    setShowCreateForm(true)
  }

  return (
    <>
      <button 
        className={`sets-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="sets-label">灵感集</span>
        {sets.length > 0 && (
          <span className="sets-count">{sets.length}</span>
        )}
      </button>

      <div className={`sets-panel ${isOpen ? 'open' : ''}`}>
        <div className="sets-header">
          <h3 className="sets-title">灵感集</h3>
          <button 
            className="sets-close"
            onClick={() => setIsOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="sets-content">
          <div className="view-section">
            <h4 className="section-label">视图</h4>
            <div className="view-list">
              <button
                className={`view-item ${activeView === 'all' ? 'active' : ''}`}
                onClick={() => {
                  onViewChange('all')
                  setIsOpen(false)
                }}
              >
                <span className="view-icon">✦</span>
                <span className="view-name">全部碎片</span>
              </button>
              <button
                className={`view-item ${activeView === 'favorites' ? 'active' : ''}`}
                onClick={() => {
                  onViewChange('favorites')
                  setIsOpen(false)
                }}
              >
                <span className="view-icon">⭐</span>
                <span className="view-name">我的收藏</span>
                {favoritesCount > 0 && (
                  <span className="view-count">{favoritesCount}</span>
                )}
              </button>
            </div>
          </div>

          <div className="sets-section">
            <div className="sets-section-header">
              <h4 className="section-label">我的灵感集</h4>
              {!showCreateForm && (
                <button 
                  className="add-set-btn"
                  onClick={() => {
                    setEditingSet(null)
                    setNewSetName('')
                    setShowCreateForm(true)
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              )}
            </div>

            {showCreateForm ? (
              <div className="create-set-form">
                <input
                  type="text"
                  className="set-name-input"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="灵感集名称"
                  autoFocus
                />
                <div className="icon-picker">
                  {SET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      className={`icon-option ${selectedIcon === icon ? 'selected' : ''}`}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="color-picker">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <div className="form-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingSet(null)
                      setNewSetName('')
                    }}
                  >
                    取消
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={editingSet ? handleUpdateSet : handleCreateSet}
                    disabled={!newSetName.trim()}
                  >
                    {editingSet ? '保存' : '创建'}
                  </button>
                </div>
              </div>
            ) : sets.length === 0 ? (
              <div className="empty-sets">
                <span className="empty-icon">📁</span>
                <p>还没有灵感集</p>
                <p className="empty-hint">创建一个来收纳你的碎片</p>
              </div>
            ) : (
              <div className="sets-list">
                {sets.map((set) => (
                  <div key={set.id} className="set-item">
                    <button
                      className={`set-main ${activeView === `set:${set.id}` ? 'active' : ''}`}
                      onClick={() => {
                        onViewChange(`set:${set.id}`)
                        setIsOpen(false)
                      }}
                    >
                      <span className="set-icon" style={{ color: set.color }}>{set.icon}</span>
                      <span className="set-name">{set.name}</span>
                      <span className="set-count">{set.fragmentIds.length}</span>
                    </button>
                    <div className="set-actions">
                      <button 
                        className="set-action-btn edit"
                        onClick={() => startEdit(set)}
                        title="编辑"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        className="set-action-btn delete"
                        onClick={() => handleDeleteSet(set.id)}
                        title="删除"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sets-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}