import { useState } from 'react'

import { Container, Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import filterDark from '@project/assets/images/filterDark.svg'
import filterWhite from '@project/assets/images/filterWhite.svg'
import global from '@project/assets/images/global.svg'
import GlobalDark from '@project/assets/images/GlobalDark.svg'
import { GoalsAlertModal } from '@project/Components/Modal/GoalsAlertModal/GoalsAlertModal'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { RootState } from '@project/Store/store'

import './GoalsAssociation.scss'

export default function GoalsAssociation() {
  const [showModal, setShowModal] = useState(false)
  const [pendingTab, setPendingTab] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const activeTab = location.pathname.includes('custom')
    ? 'Custom Goals'
    : 'Global Goals'

  const hasUnsavedChanges = useSelector(
    (state: RootState) => state.unsavedChangesGoalsSlice.hasUnsavedChanges
  )

  const handleTabSelect = (k: string | null) => {
    if (!k) return

    // Same tab — do nothing
    if (
      (k === 'Global Goals' && activeTab === 'Global Goals') ||
      (k === 'Custom Goals' && activeTab === 'Custom Goals')
    )
      return

    if (hasUnsavedChanges) {
      setPendingTab(k)
      setShowModal(true)
      return
    }

    if (k === 'Global Goals') navigate('global')
    if (k === 'Custom Goals') navigate('custom')
  }

  return (
    <Container fluid className="master-container lightBg px-0">
      <div className="top-header-wrapper">
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="bg-white p-2"
        >
          <Nav.Item>
            <Nav.Link
              eventKey="Global Goals"
              className="d-flex align-items-center"
              data-ignore-guard="true"
            >
              {activeTab === 'Global Goals' ? (
                <img src={global} alt="global" style={{ marginRight: '8px' }} />
              ) : (
                <img
                  src={GlobalDark}
                  alt="global"
                  style={{ marginRight: '8px' }}
                />
              )}
              Global Goals
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="Custom Goals"
              className="d-flex align-items-center"
              data-ignore-guard="true"
            >
              {activeTab === 'Custom Goals' ? (
                <img
                  src={filterWhite}
                  alt="custom"
                  style={{ marginRight: '8px' }}
                />
              ) : (
                <img
                  src={filterDark}
                  alt="custom"
                  style={{ marginRight: '8px' }}
                />
              )}
              Custom Goals
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div className="tab-placeholder">
        <Outlet />
      </div>

      <GoalsAlertModal
        show={showModal}
        onConfirm={() => {
          dispatch(setUnsavedChanges(false))
          setShowModal(false)
          if (pendingTab === 'Global Goals') navigate('global')
          if (pendingTab === 'Custom Goals') navigate('custom')
          setPendingTab(null)
        }}
        onCancel={() => {
          setShowModal(false)
          setPendingTab(null)
        }}
      />
    </Container>
  )
}
