import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'

import Header from '@project/Pages/Layout/Header'

// import './ManagerLayout.scss'

const pageTitles: Record<string, string> = {
  '/srm/srm-dashboard': 'Dashboard',
}

export default function ManagerLayout() {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'Appraisal System'

  return (
    <Container fluid className="commonLayoutWithoutSidebar p-0 m-0">
      <div className="headerSticky">
        <div className="headerStickyInner">
          <Row>
            <Col className="p-0">
              <Header title={currentTitle} />
            </Col>
          </Row>
        </div>
      </div>

      <Row style={{ height: 'calc(100% - 63px)' }}>
        <Col xs={12} md={12} className="py-0 commonLayoutContent">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
