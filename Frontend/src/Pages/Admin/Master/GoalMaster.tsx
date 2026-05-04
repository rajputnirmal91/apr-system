import { useEffect } from 'react'

import { Nav, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

import filterDark from '@project/assets/images/filterDark.svg'
import filterWhite from '@project/assets/images/filterWhite.svg'
import global from '@project/assets/images/global.svg'
import GlobalDark from '@project/assets/images/GlobalDark.svg'
import Goals from '@project/Pages/Admin/Master/Goals/Goals'
import { adminRoutes } from '@project/Utils/routeNavigation'

import MappedGoals from './GoalMapping/MappedGoals'

export default function GoalMaster() {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab based on current route path
  const activeTab = location.pathname.includes(adminRoutes.goals)
    ? 'Mapped Goals'
    : 'Goals'

  // Auto navigate to Goals if user opens `/admin/goal`
  useEffect(() => {
    if (location.pathname === adminRoutes.goal) {
      navigate(adminRoutes.goal) // stay on goals route
    }
  }, [location.pathname, navigate])

  return (
    // <Container fluid className="">
    <>
      {/* Tabs */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(selectedTab) => {
          if (selectedTab === 'Goals') navigate(adminRoutes.goal)
          if (selectedTab === 'Mapped Goals') navigate(adminRoutes.goals)
        }}
        className="bg-white p-2"
      >
        {/* Goals Tab */}
        <Nav.Item>
          <Nav.Link
            eventKey="Goals"
            className="d-flex align-items-center"
            style={{
              backgroundColor:
                activeTab === 'Goals' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'Goals' ? 'white' : 'black',
            }}
          >
            <img
              src={activeTab === 'Goals' ? global : GlobalDark}
              alt="goals"
              style={{ marginRight: 8 }}
            />
            Goals
          </Nav.Link>
        </Nav.Item>

        {/* Mapped Goals Tab */}
        <Nav.Item>
          <Nav.Link
            eventKey="Mapped Goals"
            className="d-flex align-items-center"
            style={{
              backgroundColor:
                activeTab === 'Mapped Goals' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'Mapped Goals' ? 'white' : 'black',
            }}
          >
            <img
              src={activeTab === 'Mapped Goals' ? filterWhite : filterDark}
              alt="mapped goals"
              style={{ marginRight: 8 }}
            />
            Mapped Goals
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Render content directly (NO OUTLET) */}
      <Row className="">
        {activeTab === 'Goals' ? <Goals /> : <MappedGoals />}
      </Row>
    </>
    // </Container>
  )
}
