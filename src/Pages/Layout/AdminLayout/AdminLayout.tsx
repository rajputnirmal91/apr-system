// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable unused-imports/no-unused-vars */
// // import { Outlet } from 'react-router-dom'

import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'

import Spinner from '@project/Common/Spinner'
import SharedSidebar from '@project/Components/SharedSidebar/SharedSidebar'
import Header from '@project/Pages/Layout/Header'

import '@project/Pages/Layout/Layout.scss'

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/goals-association/custom': 'Custom Goals Association',
  '/admin/reports': 'Report',
  '/admin/goal': 'Master',
  '/admin/kra': 'Configuration',
  '/admin/master': 'Master',
  '/admin/mappedGoals': 'Configuration',
  '/admin/rating': 'Configuration',
  '/admin/goals-association': 'Configuration',
  '/admin/date': 'Configuration',
  '/admin/employee-eligibility': 'Configuration',
  '/admin/appraisal': 'Configuration',
}

export default function AdminLayout() {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'Appraisal System'
  const [sidebarBtn, setSidebarBtn] = useState(false)
  const [navigating, setNavigating] = useState(false)

  // Show spinner on every route change, hide after the new page has painted
  useEffect(() => {
    setNavigating(true)
    const timer = setTimeout(() => setNavigating(false), 400)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const handleSidebarBtn = () => {
    setSidebarBtn(!sidebarBtn)
  }

  return (
    <Container fluid className="layoutMain layoutWithSideMain employeeMain">
      {navigating && <Spinner />}
      <Row>
        <Col className="p-0 position-fixed zIndex1000">
          <Header
            title={currentTitle}
            sidebarBtn={handleSidebarBtn}
            sidebar={sidebarBtn}
          />
        </Col>
      </Row>

      <Row className="responsiveNavigation">
        <Col
          xs={12}
          md={sidebarBtn ? 1 : 2}
          className="bg-light layoutResponsive p-0"
        >
          <SharedSidebar sidebar={sidebarBtn} />
        </Col>

        <Col xs={12} md={sidebarBtn ? 11 : 10} className="layoutContent  p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
 