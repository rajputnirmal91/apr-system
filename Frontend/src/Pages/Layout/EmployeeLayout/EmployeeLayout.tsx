// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable unused-imports/no-unused-vars */
// // import { Outlet } from 'react-router-dom'

import { useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'

import SharedSidebar from '@project/Components/SharedSidebar/SharedSidebar'
import Header from '@project/Pages/Layout/Header'

import '@project/Pages/Layout/Layout.scss'

const pageTitles: Record<string, string> = {
  '/employee/employee-dashboard': 'Dashboard',
  '/employee/pedp': 'PEDP',
  '/employee/projectdetails': 'Project Details',
  '/employee/certification': 'Certification',
}

export default function EmployeeLayout() {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'Appraisal System'
  const [sidebarBtn, setSidebarBtn] = useState(false)

  const handleSidebarBtn = () => {
    setSidebarBtn(!sidebarBtn)
  }

  return (
    <Container fluid className="layoutMain layoutWithSideMain employeeMain">
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
          className="bg-light layoutResponsive layoutSidebar p-0"
        >
          <SharedSidebar sidebar={sidebarBtn} />
        </Col>

        <Col xs={12} md={sidebarBtn ? 11 : 10} className="p-4 layoutContent">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
