import { useState } from 'react'

import { Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import InfoBlue from '@project/assets/images/Info.svg'
import InfoIcon from '@project/assets/images/InfoWhite.svg'
import LineIcon from '@project/assets/images/Line.svg'
import RightArrow from '@project/assets/images/RightArrowBlue.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import { useGetTeamMemberCdpDetailsQuery } from '@project/Store/Api/Manager'

import IrmHelp from '../Irm/IrmDetailsTab/IrmHelp/IrmHelp'

import type { PedpSavePayload } from './IrmPedpTab/SrmPedpTab'
import SrmPedpTab from './IrmPedpTab/SrmPedpTab'
import SrmCertificationsTab from './SrmCertificationsTab/SrmCertificationsTab'
import SrmProjectsTab from './SrmProjectsTab/SrmProjectsTab'
import SrmReviewTab from './SrmReviewTab/SrmReviewTab'

import './SrmDetailsTab.scss'

const tabs = [
  { key: 'tab1', label: 'Projects', icon: InfoIcon, Component: SrmProjectsTab },
  {
    key: 'tab2',
    label: 'Certifications',
    icon: RightArrow,
    Component: SrmCertificationsTab,
  },
  { key: 'tab3', label: 'PEDP', icon: RightArrow, Component: SrmPedpTab },
  {
    key: 'tab4',
    label: 'CDP/Review',
    icon: RightArrow,
    Component: SrmReviewTab,
  },
]

export default function IrmDetailsTab() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [showHelp, setShowHelp] = useState(false)
  const { employee_user_id } = useParams<{ employee_user_id: string }>()

  // OPTIONAL: store PEDP payload if needed for next tabs
  const [pedpPayload, setPedpPayload] = useState<PedpSavePayload | null>(null)

  const [isEditing, setIsEditing] = useState(false)

  const navigate = useNavigate()
  const { data: getTeamMemberCdpDetails } = useGetTeamMemberCdpDetailsQuery(
    employee_user_id!,
    {
      skip: !employee_user_id,
      refetchOnMountOrArgChange: true,
    }
  )

  const getFormStatus = getTeamMemberCdpDetails?.form_status

  // -------------------------
  // TAB NAVIGATION HANDLERS
  // -------------------------

  const handleNextTab = (currentTabKey: string) => {
    if (currentTabKey === 'tab1') setActiveTab('tab2')
    else if (currentTabKey === 'tab2') setActiveTab('tab3')
    else if (currentTabKey === 'tab3') setActiveTab('tab4')
  }

  const handlePreview = (currentTabKey: string) => {
    if (currentTabKey === 'tab2') setActiveTab('tab1')
    else if (currentTabKey === 'tab3') setActiveTab('tab2')
    else if (currentTabKey === 'tab4') setActiveTab('tab3')
  }

  // -------------------------
  // OTHER HANDLERS
  // -------------------------

  const handleDashboardNavigation = () => {
    if (activeTab === 'tab1') {
      navigate('/irm/irm-dashboard')
    } else {
      handlePreview(activeTab)
    }
  }

  const handleHelp = () => {
    navigate('/irm/irmHelp')
    setShowHelp(true)
  }

  // -------------------------
  // RENDER
  // -------------------------

  return (
    <Container fluid className="m-0 p-0 irmDetailsTabMain">
      <button
        onClick={handleDashboardNavigation}
        className="transparentButton mb-3 d-flex align-items-center"
      >
        <img src={ArrowLeft} alt="Back" className="me-2" />
        <span className="font14 font400 fontOnest">Back</span>
      </button>

      {showHelp ? (
        <IrmHelp />
      ) : (
        <>
          {/* Tabs Header */}
          <div className="d-flex chain-tabs px-0">
            {tabs.map((tab, idx) => (
              <div
                key={tab.key}
                className={`chain-tab ${idx === 0 ? 'first-tab' : ''} ${
                  activeTab === tab.key ? 'active' : ''
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <div className="tabMain">
                  <p className="mb-0 font14 font400 fontOnest fontPrimary">
                    {tab.label}
                  </p>
                  {tab.icon && <img src={tab.icon} alt={tab.label} />}
                </div>
              </div>
            ))}

            {/* Right section: Help + Draft */}
            <div className="last-tab">
              <div className="d-flex align-items-center justify-content-lg-end mt-4 mt-lg-0 gap-2">
                <div>
                  {' '}
                  {activeTab === 'tab4' && getFormStatus !== 'Reviewed' && (
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <button
                        className="edit-icon transparentButton"
                        data-ignore-guard="true"
                        onClick={() => setIsEditing((prev) => !prev)}
                      >
                        <img src={EditIcon} alt="editIcon" />
                      </button>
                    </div>
                  )}
                </div>
                <img src={LineIcon} alt="line" />
                <div className="d-flex align-items-center gap-2">
                  <img src={InfoBlue} alt="info" />
                  <button
                    onClick={handleHelp}
                    style={{ border: 'none', background: 'none', padding: 0 }}
                  >
                    <h4 className="m-0 font16 font400 fontOnest">Help</h4>
                  </button>
                </div>
                <img src={LineIcon} alt="line" />
                <div className="d-flex align-items-center gap-2 font400">
                  <span className="font16 textDark">
                    {getStatusIcon(getFormStatus)}
                    <span>{getFormStatus}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}

          <div className="tab-content mt-4">
            {tabs.map((tab) => {
              if (activeTab !== tab.key) return null
              const { Component } = tab

              return (
                <Component
                  key={tab.key}
                  onNextTab={() => handleNextTab(tab.key)}
                  onPreview={() => handlePreview(tab.key)}
                  pedpPayload={pedpPayload} // ← pass the payload here
                  onPedpSave={(payload: PedpSavePayload) =>
                    setPedpPayload(payload)
                  } // ← capture payload from PEDP tab
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              )
            })}
          </div>
        </>
      )}
    </Container>
  )
}
