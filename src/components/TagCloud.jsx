import './TagCloud.css'

export default function TagCloud({ tags, selectedTags, onTagClick }) {
  const handleTagClick = (tag) => {
    onTagClick(tag)
  }

  const isSelected = (tag) => selectedTags.includes(tag)

  return (
    <div className="tag-cloud">
      <div className="tag-cloud-header">
        <span className="tag-cloud-label">标签筛选</span>
        {selectedTags.length > 0 && (
          <button
            className="clear-all-tags"
            onClick={() => onTagClick(null)}
          >
            清除全部
          </button>
        )}
      </div>
      
      <div className="selected-tags">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="selected-tag"
            onClick={() => onTagClick(tag)}
          >
            <span className="tag-text">#{tag}</span>
            <span className="tag-remove">×</span>
          </span>
        ))}
      </div>

      <div className="tags-list">
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            className={`tag-item ${isSelected(tag) ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            <span className="tag-name">{tag}</span>
            <span className="tag-count">{count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}