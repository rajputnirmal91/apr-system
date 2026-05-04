import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import RightWhiteIcon from '@project/assets/images/RightWhiteIcon.svg'
import SendWhiteIcon from '@project/assets/images/SendWhiteIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import CardWithContent from '@project/Components/Card/CardWithContent/CardWithContent'
import CustomModal from '@project/Components/Modal/Modal'
import { useGetUnitHeadRatingAndRemarkQuery } from '@project/Store/Api/UnitHead/UnitHeadApi'
import { unitHeadRoutes } from '@project/Utils/routeNavigation'

import './ReviewRating.scss'

type ReviewRatingProps = {
  rating: string
  setRating: React.Dispatch<React.SetStateAction<string>>
  remarks: string
  setRemarks: React.Dispatch<React.SetStateAction<string>>
  errors?: {
    rating?: string
    remarks?: string
  }
}

function ReviewRating({
  rating,
  setRating,
  remarks,
  setRemarks,
  errors,
}: ReviewRatingProps) {
  const [saveInfoModal, setSaveInfoModal] = useState<boolean>(false)
  const [publishInfoModal, setPublishInfoModal] = useState<boolean>(false)
  const { employeeUserId } = useParams<{ employeeUserId: string }>()

  const { data: getRatingAndRemark } = useGetUnitHeadRatingAndRemarkQuery(
    employeeUserId!,
    {
      skip: !employeeUserId,
      refetchOnMountOrArgChange: true,
    }
  )

  const navigate = useNavigate()

  const handleClose = () => {
    navigate(`/${unitHeadRoutes.root}/${unitHeadRoutes.dashboard}`)
  }

  useEffect(() => {
    if (getRatingAndRemark) {
      setRating(getRatingAndRemark.rating_by_unit_head ?? '')
      setRemarks(getRatingAndRemark.remarks_by_unit_head ?? '')
    }
  }, [getRatingAndRemark, setRating, setRemarks])

  return (
    <>
      <CardWithContent
        heading="Review by Unit head"
        status={getRatingAndRemark?.form_status}
      >
        <div>
          <Row>
            <Col lg={6}>
              <p className="mb-1 font14 font400 fontOnest">Rating</p>
              <CommonInput
                className="goalPlaceholder"
                placeholder="Please Enter Rating"
                width="100%"
                value={rating}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRating(e.target.value)
                }
                disabled={getRatingAndRemark?.form_status === 'Reviewed'}
              />
              {errors?.rating && (
                <p className="errorText mt-2">{errors.rating}</p>
              )}
            </Col>

            <Col lg={12} className="mt-3">
              <p className="mb-1 font14 font400 fontOnest">Remarks</p>
              <InputTextarea
                autoResize
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={11}
                disabled={getRatingAndRemark?.form_status === 'Reviewed'}
                className="textArea font14 font400 fontOnest textDark p-3"
                style={{ width: '100%' }}
              />
              {errors?.remarks && <p className="errorText">{errors.remarks}</p>}
            </Col>
          </Row>
        </div>
      </CardWithContent>

      <CustomModal
        show={saveInfoModal}
        onClose={() => {
          setSaveInfoModal(false)
          handleClose()
        }}
        image={RightWhiteIcon}
        type="Success"
        modalHeading="Successfully"
        modalDesc="Yeah, you're review form save successfully"
        mode="info"
      />
      <CustomModal
        show={publishInfoModal}
        onClose={() => {
          setPublishInfoModal(false)
          handleClose()
        }}
        image={SendWhiteIcon}
        type="Success"
        modalHeading="Successfully"
        modalDesc="Yeah, you're review form Publish successfully"
        mode="info"
      />
    </>
  )
}

export default ReviewRating
