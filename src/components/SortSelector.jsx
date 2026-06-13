import { useState, useRef, useEffect } from 'react'
import { SORT_OPTIONS, SORT_LABELS } from '../utils/storage'
import './SortSelector.css'

export default function SortSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="sort-selector">
      <button
        className="sort-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        <span className="sort-label">排序</span>
        <span className="sort-value">{SORT_LABELS[value]}</span>
        <svg
          className={`sort-arrow ${isOpen ? 'rotated' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="sort-dropdown">
          {Object.values(SORT_OPTIONS).map((option) => (
            <button
              key={option}
              className={`sort-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {SORT_LABELS[option]}
              {value === option && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}