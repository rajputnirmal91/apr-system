import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
 
interface OverlayTextProps {
  text?: string | null
  maxLength?: number
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  fallback?: string
  enableTooltip?: boolean
}
 
function OverlayText({
  text,
  maxLength = 130,
  placement = 'bottom',
  className = '',
  fallback = '--',
  enableTooltip = true,
}: OverlayTextProps) {
  const trimmedText = useMemo(() => text?.trim() || '', [text])
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
 
  const displayText = useMemo(() => {
    if (!trimmedText) return fallback
    if (trimmedText.length > maxLength) {
      return `${trimmedText.substring(0, maxLength)}...`
    }
    return trimmedText
  }, [trimmedText, maxLength, fallback])
 
  const needsTooltip = enableTooltip && !!trimmedText && trimmedText.length > maxLength
 
  const handleShow = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltipPos({ top: rect.top, left: rect.left })
    setShowTooltip(true)
  }
 
  const handleHide = () => {
    setShowTooltip(false)
  }
 
  useLayoutEffect(() => {
    if (!showTooltip || !needsTooltip) return
    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const tooltipRect = tooltipRef.current?.getBoundingClientRect()
    if (!triggerRect || !tooltipRect) return
 
    let { left } = triggerRect
    let top = triggerRect.bottom + 8
 
    const minLeft = 6
    const maxLeft = window.innerWidth - tooltipRect.width - 6
    if (left < minLeft) left = minLeft
    if (left > maxLeft) left = maxLeft
 
    const maxTop = window.innerHeight - tooltipRect.height - 6
    if (top > maxTop) top = maxTop
 
    setTooltipPos({ top, left })
  }, [showTooltip, trimmedText, placement, needsTooltip])
 
  // Early return AFTER all hooks
  if (!needsTooltip) {
    return (
      <p className={`mb-0 font14 font400 fontOnest textDark ${className}`}>
        {displayText}
      </p>
    )
  }
 
  return (
    <>
      <span
        className="overlay-text-trigger"
        ref={triggerRef}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
      >
        <p className={`mb-0 font14 font400 fontOnest textDark ${className}`}>
          {displayText}
        </p>
      </span>
      {showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            className="overlay-tooltip-portal"
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
          >
            {trimmedText}
          </div>,
          document.body
        )}
    </>
  )
}
 
export default memo(OverlayText)