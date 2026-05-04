import React, { RefObject } from 'react'

import '@project/Components/TableResponsive/TableResponsive.scss'

type TableResponsiveProps = {
  children: React.ReactNode
  maxHeight?: string
  containerRef?: RefObject<HTMLDivElement>
  className?: string
}

function TableResponsive({
  children,
  maxHeight,
  containerRef,
  className = '',
}: TableResponsiveProps) {
  return (
    <div
      className={`table-responsive ${className}`}
      style={{ maxHeight }}
        ref={containerRef}
    >
      {children}      
        
    </div>    
  )
}

export default TableResponsive
