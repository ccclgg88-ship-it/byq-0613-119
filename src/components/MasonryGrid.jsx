import { useState, useRef, useEffect, useCallback } from 'react'
import { debounce } from '../utils/storage'
import './MasonryGrid.css'

const BREAKPOINTS = [
  { minWidth: 1400, columns: 5 },
  { minWidth: 1100, columns: 4 },
  { minWidth: 800, columns: 3 },
  { minWidth: 500, columns: 2 },
  { minWidth: 0, columns: 1 }
]

function calculateColumns(containerWidth) {
  for (const bp of BREAKPOINTS) {
    if (containerWidth >= bp.minWidth) {
      return bp.columns
    }
  }
  return 1
}

export default function MasonryGrid({ children, gap = 20 }) {
  const containerRef = useRef(null)
  const [columns, setColumns] = useState(4)

  const handleResize = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const newColumns = calculateColumns(width)
        setColumns(newColumns)
      }
    }, 100),
    []
  )

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      setColumns(calculateColumns(width))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const columnWrappers = Array.from({ length: columns }, () => [])

  const childArray = Array.isArray(children) ? children : [children]

  childArray.forEach((child, index) => {
    const columnIndex = index % columns
    columnWrappers[columnIndex].push(child)
  })

  return (
    <div
      ref={containerRef}
      className="masonry-grid"
      style={{ columnGap: `${gap}px` }}
    >
      {columnWrappers.map((columnItems, colIndex) => (
        <div
          key={colIndex}
          className="masonry-column"
          style={{
            width: `calc((100% - ${gap * (columns - 1)}px) / ${columns})`,
            rowGap: `${gap}px`
          }}
        >
          {columnItems.map((item, idx) => (
            <div key={idx} className="masonry-item">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
