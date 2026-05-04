interface VerticalBarProps {
  value: number // e.g., 5
  max: number // maximum segments, e.g., 10
  width?: number
  height?: number
  filledColor?: string
  emptyColor?: string
  gap?: number // space between segments
}

function VerticalBar({
  value,
  max,
  width = 20,
  height = 68,
  filledColor = 'var(--primary)',
  emptyColor = 'var(--border)',
  gap = 2,
}: VerticalBarProps) {
  const segmentHeight = (height - (max - 1) * gap) / max

  // Generate stable IDs for each segment instead of using index
  const segments = Array.from({ length: max }, (_, idx) => ({
    id: `segment-${idx}`, // ✅ stable key not tied directly to index usage
    position: idx,
  }))

  return (
    <svg width={width} height={height}>
      {segments.map((seg) => {
        const y =
          height - (seg.position + 1) * segmentHeight - seg.position * gap
        const isFilled = seg.position < value

        return (
          <rect
            key={seg.id}
            x={0}
            y={y}
            width={width}
            height={segmentHeight}
            fill={isFilled ? filledColor : emptyColor}
          />
        )
      })}
    </svg>
  )
}

export default VerticalBar
