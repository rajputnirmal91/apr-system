import { ReactNode } from 'react'

import DownArrow from '@project/assets/images/DownArrow.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'

import './CardWithContent.scss'

type CardWithContentProps = {
  heading: string | ReactNode
  hasDropdown?: boolean
  toggleDropdown?: boolean
  handleToggleDropdown?: () => void
  className?: string
  children: ReactNode
  status?: string
}

function CardWithContent({
  heading,
  hasDropdown = false,
  toggleDropdown,
  handleToggleDropdown,
  className = '',
  children,
  status,
}: CardWithContentProps) {
  return (
    <div className="cardWithContentWrapper">
      <div className="cardHead mx-0 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center ps-3 justify-content-between w-100">
          <h3 className="font16 font400 fontOnest mb-0 me-2">{heading}</h3>

          {status && (
            <span>
              {getStatusIcon(status)} {status}
            </span>
          )}
        </div>

        {hasDropdown && (
          <button
            className="transparentButton pe-3"
            onClick={handleToggleDropdown}
          >
            <img src={toggleDropdown ? TopArrow : DownArrow} alt="dropdown" />
          </button>
        )}
      </div>

      {!hasDropdown || toggleDropdown ? (
        <div className={`padding24 ${className}`}>{children}</div>
      ) : null}
    </div>
  )
}

export default CardWithContent
