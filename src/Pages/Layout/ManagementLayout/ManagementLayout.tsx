// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable unused-imports/no-unused-vars */
// // import { Outlet } from 'react-router-dom'

import { useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'

import SharedSidebar from '@project/Components/SharedSidebar/SharedSidebar'
import Header from '@project/Pages/Layout/Header'

import '@project/Pages/Layout/Layout.scss'
import './ManagementLayout.scss'

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/goals-association': 'Goals Association',
  '/admin/goals-association/custom': 'Custom Goals Association',
  '/admin/employee-eligibility': 'Employee Eligibility',
  '/admin/reports': 'Reports',
  '/admin/master': 'Master',
  '/admin/rating': 'Rating',
}

export default function ManagementLayout() {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'Appraisal System'
  const [sidebarBtn, setSidebarBtn] = useState(false)

  const handleSidebarBtn = () => {
    setSidebarBtn(!sidebarBtn)
  }

  return (
    <Container fluid className="layoutMain layoutWithSideMain employeeMain">
      <Row>
        <Col className="p-0 position-fixed z-1">
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

        <Col xs={12} md={sidebarBtn ? 11 : 10} className="layoutContent px-0">
          <div className="padding24">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  )
}
