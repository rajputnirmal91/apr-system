import { Col, Container, Row } from 'react-bootstrap'

import { Kra, SubKra } from '@project/Types/goalsAssociationTypes'

type Props = {
  goal: {
    designation_name?: string | null
    owner_name?: string | null
    kra: Kra[]
  }
  designation?: string
  onBack?: () => void
  showBreadcrumbs?: boolean
}

export default function GoalsAssociationComplete({
  goal,
  designation,
  onBack,
  showBreadcrumbs,
}: Props): JSX.Element {
  return (
    <>
      {/* Breadcrumbs + Back + Owner */}
      {showBreadcrumbs && (
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex flex-column align-items-center gap-2 px-3 py-2">
            <button
              type="button"
              onClick={() => (onBack ? onBack() : window.history.back())}
              style={{
                alignSelf: 'flex-start',
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: 'var(--primaryColor)',
                cursor: 'pointer',
              }}
            >
              {'<'} Back
            </button>
            <div className="d-flex gap-2">
              <span>Custom associate</span>
              <span>{'>'}</span>
              <span>{designation || goal.designation_name || ''}</span>
            </div>
          </div>

          {goal?.owner_name && (
            <div
              className="px-3 py-1"
              style={{
                border: '1px solid var(--primary)',
                borderRadius: 6,
                color: 'var(--primary)',
                background: 'var(--lightBlue)',
              }}
            >
              Owner - {goal.owner_name}
            </div>
          )}
        </div>
      )}
      <div className="goal-association-complete">
        {/* Sub Goals / KRA Sections */}
        {goal?.kra?.map((kra: Kra) => (
          <div key={kra.id} className="kra-section pb-2 ">
            {/* KRA Header */}
            <div className="kra-header p-3 rounded mb-2">
              {kra.kra_name} - {kra.kra_weightage}%
            </div>

            {/* Sub-KRAs */}
            <Container fluid>
              <Row className="fw-bold border-bottom py-2">
                <Col xs={8}>
                  <p>
                    <span
                      style={{
                        color: 'var(--textLight)',
                        fontWeight: 'normal',
                      }}
                    >
                      Secondary KRA category description
                    </span>
                  </p>
                </Col>
                <Col xs={4} className="text-end">
                  <p>
                    <span
                      style={{
                        color: 'var(--textLight)',
                        fontWeight: 'normal',
                      }}
                    >
                      Category weightage
                    </span>
                  </p>
                </Col>
              </Row>

              {kra.sub_kra?.map((sub: SubKra) => (
                <Row key={sub.id} className="py-2">
                  <Col xs={8}>
                    <p className="mb-1 small">{sub.sub_kra_name}</p>
                  </Col>
                  <Col xs={4} className="text-end ">
                    {sub.sub_kra_weightage}%
                  </Col>
                </Row>
              ))}
            </Container>
          </div>
        ))}
      </div>
    </>
  )
}
