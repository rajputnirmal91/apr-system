import React from 'react'

import NoRecordImage from '@project/assets/images/NoRecordImage.svg'

import './NoRecordFound.scss'

interface CommonCardProps {
  heading: string // mandatory
  description: React.ReactNode | string // mandatory
  className?: string
}

function NoRecordFound({
  heading,
  description,
  className = '',
}: CommonCardProps) {
  return (
    <div className={`noRecordImageWrapper ${className}`}>
      <div className="noRecordContainer">
        <img src={NoRecordImage} alt="NoRecordImage" />
        <h3 className="title">{heading}</h3>
        <p className="description">{description}</p>
      </div>
    </div>
  )
}

export default NoRecordFound
