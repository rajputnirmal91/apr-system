import './Card.scss'

type CardProps = {
  variant: string
  icon: string
  heading: string
  description: string
}

function Card({ variant, icon, heading, description }: CardProps) {
  return (
    <div className="commanStyle px-3 py-3 cardMainBox">
      <div className="d-flex gap-3">
        {variant === 'small' ? (
          <div className="cardIcon">
            <img src={icon} alt="MultipleUserIcon" className="innerIconSmall" />
          </div>
        ) : (
          <div className="cardIcon">
            <img src={icon} alt="MultipleUserIcon" className="innerIconLarge" />
          </div>
        )}
        <div>
          <h4 className="font32 font600 fontOnest mb-0">{heading}</h4>
          <h4 className="font14 font400 fontOnest mb-0">{description}</h4>
        </div>
      </div>
    </div>
  )
}

export default Card
