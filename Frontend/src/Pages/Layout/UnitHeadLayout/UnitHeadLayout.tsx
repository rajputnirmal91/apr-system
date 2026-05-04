// /* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'

import Header from '@project/Pages/Layout/Header'

import '@project/Pages/Layout/Layout.scss'

const pageTitles: Record<string, string> = {
  '/unit-head/unit-head-dashboard': 'Dashboard',
}

export default function UnitHeadLayout() {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'Appraisal System'

  return (
    <Container fluid className="layoutMain employeeMain">
      <Row>
        <Col className="p-0">
          <Header title={currentTitle} />
        </Col>
      </Row>

      <Row style={{ height: 'calc(100% - 63px)' }}>
        <Col className="layoutContent px-0">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
