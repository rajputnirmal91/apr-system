import { Image, Modal } from 'react-bootstrap'
import CloseButton from 'react-bootstrap/CloseButton'

import RatePoint from '@project/assets/images/ratePoint.svg'
import { useGetRatingByIdQuery } from '@project/Store/Api/Admin/Ratings'
import { RatingPoints } from '@project/Types/rating'

import './RatingViewDetails.scss'

interface Props {
  show: boolean
  onClose: () => void
  ratingId: string | null
}

function RatingViewDetails({ show, onClose, ratingId }: Props) {
  const { data: ratingData } = useGetRatingByIdQuery(ratingId!, {
    skip: !ratingId,
    refetchOnMountOrArgChange: true,
  })

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      dialogClassName="ratingViewModal"
    >
      <div className="viewRatingDetailsWrapper">
        <Modal.Header className="border-0">
          <Modal.Title className="ratingViewTitle">
            <span className="ratingViewText">
              <span className="ratingViewScore">
                {ratingData?.rating_score} -{' '}
              </span>
              {ratingData?.rating_title}
            </span>
          </Modal.Title>
          <CloseButton onClick={onClose} />
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <p className="mb-1">{ratingData?.rating_description}</p>
          </div>

          <hr style={{ color: 'var(--border)', opacity: 1 }} />

          {/* Rating bullet items */}
          <ul className="list-unstyled mt-3">
            {ratingData?.rating_points?.map((item: RatingPoints) => (
              <li key={item.id} className="d-flex align-items-start mb-2">
                <Image src={RatePoint} width={18} className="me-2 mt-1" />
                {item.rating_points}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default RatingViewDetails
