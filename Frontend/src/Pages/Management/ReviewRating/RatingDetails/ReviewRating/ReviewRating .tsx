import { InputTextarea } from 'primereact/inputtextarea'
import { useState } from 'react'

import { Col, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import CloseBlackIcon from '@project/assets/images/closeBlackIcon.svg'
import Plus from '@project/assets/images/Plus.svg'
import RightWhiteIcon from '@project/assets/images/RightWhiteIcon.svg'
import SendWhiteIcon from '@project/assets/images/SendWhiteIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import getStatusIcon from '@project/Common/GetStatusIcon'
import SharedButton from '@project/Components/Button/SharedButton'
import CardWithContent from '@project/Components/Card/CardWithContent/CardWithContent'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import CustomModal from '@project/Components/Modal/Modal'
import { useGetReviewRatingQuery } from '@project/Store/Api/Management'
import { managementRoutes } from '@project/Utils/routeNavigation'

import './ReviewRating.scss'

const displayInfo = (name: string, value: string, width: string) => {
  return (
    <div style={{ width }} className="pb-lg-none pb-2">
      <p className="m-0 textLight font14 font400 fontOnest pb-lg-2">{name}</p>
      <div className="d-flex gap-2">
        <p className="m-0">{value}</p>
      </div>
    </div>
  )
}

const EligibilityOption = [
  {
    label: 'Eligible',
    value: '0',
  },
  {
    label: 'Non Eligible',
    value: '1',
  },
]

type ReviewRatingProps = {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

function ReviewRating({ setActiveTab }: ReviewRatingProps) {
  const [remark, setRemark] = useState<string>('')
  const [comment, setComment] = useState<boolean>(false)
  const [eligibility, setEligibility] = useState<string>('')
  const [coreCompetency, setCoreCompetency] = useState<string>('')
  const [saveInfoModal, setSaveInfoModal] = useState<boolean>(false)
  const [publishInfoModal, setPublishInfoModal] = useState<boolean>(false)

  const navigate = useNavigate()

  const { employee_user_id } = useParams<{ employee_user_id: string }>()

  const {
    data: ratingRemarkData,

    isLoading,
  } = useGetReviewRatingQuery(employee_user_id!, {
    skip: !employee_user_id,
    refetchOnMountOrArgChange: true,
  })

  const handleClose = () => {
    navigate(`/${managementRoutes.root}/${managementRoutes.reviewRating}`)
  }

  if (isLoading) {
    return <div>....loading</div>
  }

  return (
    <div>
      {/* <Container> */}
      <CardWithContent heading="Review by Unit head">
        <Row>
          {displayInfo('Rating', ratingRemarkData?.rating_by_unit_head, '30%')}
          {displayInfo('Remark', ratingRemarkData?.remarks_by_unit_head, '60%')}
        </Row>
        <div className="kraWrapper">
          <div className="kraList mx-0 d-flex justify-content-between align-items-center">
            <h3 className="font16 font400 fontOnest mb-0 ps-3">
              <span className="primaryColor">Add comment</span>
            </h3>
            <button
              className="transparentButton pe-3"
              onClick={() => setComment(!comment)}
            >
              <img src={comment ? CloseBlackIcon : Plus} alt="plus" />
            </button>
          </div>
          {comment && (
            <div className="padding24">
              <CommonInput
                className="goalPlaceholder"
                label="Remarks"
                placeholder="Please Remarks"
                width="100%"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
              <div className="pedpButton mt-3">
                <SharedButton
                  label="Close"
                  variant="outline"
                  onClick={() => setComment(false)}
                />
                <SharedButton label="Save" />
              </div>
            </div>
          )}
        </div>
      </CardWithContent>
      <div className="kraWrapper">
        <div className="kraList mx-0 d-flex justify-content-between ">
          <h3 className="font16 font400 fontOnest mb-0 ps-3 primaryColor">
            Competency description
          </h3>
          <div>
            <p className="m-0">
              {getStatusIcon(ratingRemarkData?.status)}
              {ratingRemarkData?.status}
            </p>
          </div>
        </div>

        <div className="padding24">
          <Row>
            <Col lg={6}>
              <p className="mb-0 font14 font400 fontOnest">Select Rating</p>
              <CustomDropdown
                id="Employee eligibility"
                options={EligibilityOption}
                placeholder="Select eligibility"
                append={document.body}
                value={String(eligibility)}
                onChange={(e: { target: { value: string | number } }) =>
                  setEligibility(String(e.target.value))
                }
              />
            </Col>

            <Col lg={12} className="mt-3">
              <p className="mb-0 font14 font400 fontOnest">Remarks</p>
              <InputTextarea
                autoResize
                id="coreCompetency"
                value={coreCompetency}
                onChange={(e) => setCoreCompetency(e.target.value)}
                rows={3}
                className="textArea font14 font400 fontOnest textDark p-3"
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="pedpButton pb-4">
        <SharedButton variant="outline" label="Close" onClick={handleClose} />
        <SharedButton
          variant="outline"
          label="Previous"
          onClick={() => setActiveTab('tab3')}
        />
        <SharedButton label="Save" onClick={() => setSaveInfoModal(true)} />
        <SharedButton
          label="Publish"
          onClick={() => setPublishInfoModal(true)}
        />
      </div>
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
      {/* </Container> */}
    </div>
  )
}

export default ReviewRating
