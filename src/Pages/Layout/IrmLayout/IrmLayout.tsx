import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'

import Header from '@project/Pages/Layout/Header'

import './IrmLayout.scss'

const pageTitles: Record<string, string> = {
  '/irm/irm-dashboard': 'Dashboard',
  '/irm/irmDetailsTab': 'Titan Ward',
  '/irm/irmHelp': 'Help',
}

export default function IrmLayout() {
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
