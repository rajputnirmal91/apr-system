import { useCallback, useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import InfoBlue from '@project/assets/images/Info.svg'
import InfoIcon from '@project/assets/images/InfoWhite.svg'
import LineIcon from '@project/assets/images/Line.svg'
import RightArrow from '@project/assets/images/RightArrowBlue.svg'
import RightWhiteIcon from '@project/assets/images/RightWhiteIcon.svg'
import SendWhiteIcon from '@project/assets/images/SendWhiteIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useGetUnitHeadRatingAndRemarkQuery,
  usePublishEmpReviewAndRatingMutation,
} from '@project/Store/Api/UnitHead/UnitHeadApi'
import { empReviewAndRatingReq } from '@project/Types/UnitHead/UnitHeadTypes'
import { showErrorToast } from '@project/Utils/notificationPopup'
import { unitHeadRoutes } from '@project/Utils/routeNavigation'

import Certificate from './Certificate/Certificate'
import Pedp from './Pedp/Pedp'
import Project from './Project/Project'
import ReviewRating from './ReviewRating/ReviewRating'

import './DashboardDetail.scss'

/* =======================
   Tabs Configuration
======================= */
const tabs = [
  { key: 'tab1', label: 'PEDP', icon: RightArrow, Component: Pedp },
  { key: 'tab2', label: 'Projects', icon: InfoIcon, Component: Project },
  {
    key: 'tab3',
    label: 'Certifications',
    icon: RightArrow,
    Component: Certificate,
  },
  {
    key: 'tab4',
    label: 'Review & Rating',
    icon: RightArrow,
    Component: ReviewRating,
  },
]

/* =======================
   Component
======================= */
export default function DashboardDetail() {
  /* ---------- State ---------- */
  const [activeTab, setActiveTab] = useState('tab1')
  const [rating, setRating] = useState('')
  const [remarks, setRemarks] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const [errors, setErrors] = useState<{
    rating?: string
    remarks?: string
  }>({})

  /* ---------- Router ---------- */
  const navigate = useNavigate()
  const { employeeUserId } = useParams<{ employeeUserId: string }>()

  /* ---------- API Calls ---------- */
  const { data: getRatingAndRemark } = useGetUnitHeadRatingAndRemarkQuery(
    employeeUserId!,
    {
      skip: !employeeUserId,
      refetchOnMountOrArgChange: true,
    }
  )

  const [publishEmpRatingAndRemark] = usePublishEmpReviewAndRatingMutation()

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (getRatingAndRemark) {
      setRating(getRatingAndRemark.rating_by_unit_head ?? '')
      setRemarks(getRatingAndRemark.remarks_by_unit_head ?? '')
    }
  }, [getRatingAndRemark])

  /* ---------- Handlers ---------- */
  const handleBackButton = () => {
    if (activeTab === 'tab1') {
      navigate(-1)
    } else {
      const currentTab = Number(activeTab.replace('tab', ''))
      setActiveTab(`tab${currentTab - 1}`)
    }
  }

  const handleNext = () => {
    const currentTab = Number(activeTab.replace('tab', ''))
    const nextTab = `tab${currentTab + 1}`
    if (tabs.some((tab) => tab.key === nextTab)) {
      setActiveTab(nextTab)
    }
  }

  const handlePrevious = () => {
    const currentTab = Number(activeTab.replace('tab', ''))
    const prevTab = `tab${currentTab - 1}`
    if (tabs.some((tab) => tab.key === prevTab)) {
      setActiveTab(prevTab)
    }
  }

  const handlePublish = useCallback(
    async (status: 'Draft' | 'Reviewed') => {
      const validationErrors: typeof errors = {}

      if (!rating.trim()) validationErrors.rating = 'Rating is required'
      if (!remarks.trim()) validationErrors.remarks = 'Remarks are required'

      setErrors(validationErrors)
      if (Object.keys(validationErrors).length) return

      const payload: empReviewAndRatingReq = {
        employee_user_id: employeeUserId ?? '',
        rating_by_unit_head: rating,
        remarks_by_unit_head: remarks,
        form_status: status,
      }

      try {
        const response = await publishEmpRatingAndRemark(payload).unwrap()
        if (response) {
          if (status === 'Draft') {
            setShowModal(true)
          } else {
            setShowPublishModal(true)
          }
        }
      } catch {
        showErrorToast(`${status} Failed`)
      }
    },
    [rating, remarks, employeeUserId, publishEmpRatingAndRemark]
  )

  const ActiveTabComponent = tabs.find(
    (tab) => tab.key === activeTab
  )?.Component

  /* ---------- JSX ---------- */
  return (
    <div className="padding2480 dashboardDetailWrapper unitHeadDetailsPageWrapper">
      {/* ===== Sticky Header ===== */}
      <div className="dashboardStickyHeader">
        <button
          onClick={handleBackButton}
          className="transparentButton mb-3 d-flex align-items-center"
        >
          <img src={ArrowLeft} alt="Back" className="me-2" />
          <span className="font14 font400 fontOnest">Back</span>
        </button>
      </div>

      {/* ===== Tabs ===== */}
      <div className="d-flex chain-tabs">
        {tabs.map((tab, idx) => (
          <div
            key={tab.key}
            className={`chain-tab ${idx === 0 ? 'first-tab' : ''} ${
              activeTab === tab.key ? 'active' : ''
            }`}
          >
            <div className="tabMain">
              <p className="mb-0 font14 font400 fontOnest fontPrimary">
                {tab.label}
              </p>
            </div>
          </div>
        ))}

        <div className="last-tab">
          <div className="d-flex align-items-center justify-content-lg-end gap-2">
            <button
              className="transparentButton d-flex align-items-center"
              onClick={() =>
                navigate(`/${unitHeadRoutes.root}/${unitHeadRoutes.help}`)
              }
            >
              <img src={InfoBlue} alt="Help" className="me-2" />
              <h4 className="m-0 font16 font400 fontOnest">Help</h4>
            </button>
            <img src={LineIcon} alt="line" />
            <div className="d-flex align-items-center gap-2  fw-normal">
              <span className="me-0" style={{ maxWidth: '18px' }}>
                {getStatusIcon(getRatingAndRemark?.form_status)}{' '}
              </span>
              <span>{getRatingAndRemark?.form_status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="dashboardScrollableContent">
        {ActiveTabComponent && (
          <ActiveTabComponent
            rating={rating}
            setRating={setRating}
            remarks={remarks}
            setRemarks={setRemarks}
            errors={errors}
          />
        )}
      </div>

      {/* ===== Footer ===== */}
      <div className="pedpButton dashboardStickyFooter">
        <SharedButton
          label="Close"
          variant="outline"
          onClick={() => navigate(-1)}
        />

        {activeTab !== 'tab1' && (
          <SharedButton
            label="Previous"
            variant="outline"
            onClick={handlePrevious}
          />
        )}

        {activeTab !== tabs[tabs.length - 1].key && (
          <SharedButton label="Next" onClick={handleNext} />
        )}

        {activeTab === 'tab4' &&
          getRatingAndRemark?.form_status !== 'Reviewed' && (
            <>
              <SharedButton
                label="Save as Draft"
                disabled={!rating || !remarks}
                onClick={() => handlePublish('Draft')}
              />
              <SharedButton
                label="Publish"
                disabled={!rating || !remarks}
                onClick={() => handlePublish('Reviewed')}
              />
            </>
          )}
      </div>

      {/* ===== Modal ===== */}
      <CustomModal
        show={showModal || showPublishModal}
        onClose={() => {
          setShowModal(false)
          setShowPublishModal(false)
          navigate(`/${unitHeadRoutes.root}/${unitHeadRoutes.dashboard}`)
        }}
        image={showModal ? RightWhiteIcon : SendWhiteIcon}
        modalHeading="Successfully"
        modalDesc={
          showModal
            ? 'Yeah, your review form saved successfully'
            : 'Yeah, your review form published successfully'
        }
        type="Success"
        mode="info"
      />
    </div>
  )
}
