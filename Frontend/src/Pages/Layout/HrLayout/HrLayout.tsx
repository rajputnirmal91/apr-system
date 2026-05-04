import { useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import SharedSidebar from '@project/Components/SharedSidebar/SharedSidebar'
import Header from '@project/Pages/Layout/Header'

import './HrLayout.scss'

const pageTitles: Record<string, string> = {
  '/hr/hr-dashboard': 'Dashboard',
  '/hr/hr-reviews': 'HR Reviews',
  '/hr/hr-emp-details': 'Employee Details',
  '/hr/hr-reports-dashboard': 'Reports',
  '/hr/employee-eligibility': 'Eligible Employees',
  '/hr/email-template': 'Email Template',
  '/hr/email-template/new': 'Email Template',
  '/hr/email-template/sent': 'Email Template',
  '/hr/email-template/draft': 'Email Template',
}

export default function HrLayout() {
  const location = useLocation()
  const { empName } = useParams<{ empName?: string }>()
  const [sidebarBtn, setSidebarBtn] = useState(false)

  // Determine current page title
  let currentTitle = 'Appraisal System'

  if (location.pathname.startsWith('/hr/hr-reports-details')) {
    //  Dynamic employee name (decode URL for spaces etc.)
    currentTitle = decodeURIComponent(empName || 'Employee Report')
  } else if (location.pathname.startsWith('/hr/hr-emp-details')) {
    currentTitle = decodeURIComponent(empName || 'Employee Report')
  } else {
    currentTitle = pageTitles[location.pathname] || 'Appraisal System'
  }

  const handleSidebarBtn = () => setSidebarBtn(!sidebarBtn)

  return (
    <Container fluid className="layoutMain layoutWithSideMain employeeMain">
      <Row>
        <Col className="p-0 position-fixed zIndex9999">
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

        <Col
          xs={12}
          md={sidebarBtn ? 11 : 10}
          className="p-4 commonLayoutContent position-relative"
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
