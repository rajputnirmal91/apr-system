import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import DraftIcon from '@project/assets/images/draft.svg'
import InfoBlue from '@project/assets/images/Info.svg'
import InfoIcon from '@project/assets/images/InfoWhite.svg'
import LineIcon from '@project/assets/images/Line.svg'
import RightArrow from '@project/assets/images/RightArrowBlue.svg'
import { managementRoutes } from '@project/Utils/routeNavigation'

import Certificate from './Certification/Certification'
import Pedp from './Pedp/Pedp'
import Project from './Project/Project'
import ReviewRating from './ReviewRating/ReviewRating '

import './RatingDetails.scss'

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

export default function ReviewDetails() {
  const [activeTab, setActiveTab] = useState('tab1')
  const navigate = useNavigate()

  const handleBackButton = () => {
    if (activeTab === 'tab1') {
      navigate(-1)
    } else {
      const currentTabNum = parseInt(activeTab.replace('tab', ''), 10)
      const previousTab = `tab${currentTabNum - 1}`
      setActiveTab(previousTab)
    }
  }

  return (
    // <Container fluid className="my-3">
    <div>
      <button
        onClick={handleBackButton}
        className="transparentButton mb-3 d-flex align-items-center"
      >
        <img src={ArrowLeft} alt="Back" className="me-2" />
        <span className="font14 font400 fontOnest">Back</span>
      </button>

      <div className="d-flex chain-tabs px-0">
        {tabs.map((tab, idx) => (
          <div
            key={tab.key}
            className={`chain-tab ${idx === 0 ? 'first-tab' : ''} ${activeTab === tab.key ? 'active' : ''}`}
          >
            <div className="tabMain">
              <p className="mb-0 font14 font400 fontOnest fontPrimary">
                {tab.label}
              </p>
            </div>
          </div>
        ))}
        <div className="last-tab">
          <div className="d-flex align-items-center justify-content-lg-end mt-lg-0 gap-2">
            <button
              className="transparentButton"
              onClick={() => {
                navigate(`/${managementRoutes.root}/${managementRoutes.help}`)
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <img src={InfoBlue} alt="darkBlueBox" />
                <h4 className="m-0 font16 font400 fontOnest">Help</h4>
              </div>
            </button>
            <div>
              <img src={LineIcon} alt="line" />
            </div>
            <div className="d-flex align-items-center gap-2">
              <img src={DraftIcon} alt="lightBlueBox" />
              <h4 className="m-0 font16 font400 fontOnest">Draft</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content mt-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.key && (
              <tab.Component key={tab.key} setActiveTab={setActiveTab} />
            )
        )}
      </div>
    </div>
    // </Container>
  )
}
