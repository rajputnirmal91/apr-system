import { Col, Container, Row } from 'react-bootstrap'

import { Kra, SubKra } from '@project/Types/goalsAssociationTypes'

import './CustomGoalsAssociation.scss'

type Goal = {
  id: string
  designation_title?: string | null
  owner_name?: string | null
  goal_name: string
  kra: Kra[]
}

type Props = {
  goals: Goal[]
  designation?: string
  onBack?: () => void
  showBreadcrumbs?: boolean
}

export default function CustomAssociationComplete({
  goals,
  designation,
  onBack,
  showBreadcrumbs = false,
}: Props): JSX.Element {
  /* ================= FILTER VALID GOALS ================= */
  const validGoals = goals?.filter(
    (goal) =>
      goal.kra &&
      goal.kra.length > 0 &&
      goal.kra.some((kra) => kra.sub_kra && kra.sub_kra.length > 0)
  )

  /* ================= NO DATA ================= */
  if (!validGoals || validGoals.length === 0) {
    return <div>No goals found</div>
  }

  /* ================= BREADCRUMB GOAL ================= */
  const firstGoal = validGoals[0]

  return (
    <>
      {/* ===== Breadcrumb + Back + Owner ===== */}
      {showBreadcrumbs && firstGoal && (
        <div
          className="d-flex align-items-center justify-content-between mb-2"
          style={{
            backgroundColor: 'var(--lightBg)',
            position: 'relative',
            marginTop: '-144px',
          }}
        >
          <div className="d-flex flex-column gap-2 pr-3 py-2">
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
              <span>{designation || firstGoal?.designation_title || ''}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== Goal Association Sections ===== */}
      {validGoals.map((goal) => (
        <div key={goal.id} className="goal-association-complete mb-4">
          <div>
            <div
              className="d-flex align-items-center justify-content-between px-3"
              style={{
                backgroundColor: 'var(--lightBlue)',
              }}
            >
              {goal.goal_name}
              <div
                className="px-3 py-1"
                style={{
                  border: '1px solid var(--primary)',
                  borderRadius: 6,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--lightBlue)',
                  maxWidth: '150px',
                  margin: '10px',
                }}
              >
                Owner - {goal.owner_name}
              </div>
            </div>

            {goal.kra
              ?.filter((kra) => kra.sub_kra && kra.sub_kra.length > 0)
              .map((kra: Kra) => (
                <div key={kra.id} className="kra-section pb-2">
                  {/* KRA Header */}
                  <div className="kra-header p-3 rounded mb-2 ">
                    {kra.kra_name} - {kra.kra_weightage}%
                  </div>

                  {/* Secondary KRAs */}
                  <Container fluid>
                    <Row className="fw-bold border-bottom py-2">
                      <Col xs={8}>
                        <span
                          className="fw-normal"
                          style={{ color: 'var(--textLight)' }}
                        >
                          Secondary KRA category description
                        </span>
                      </Col>
                      <Col xs={4} className="text-end">
                        <span
                          className="fw-normal"
                          style={{
                            color: 'var(--textLight)',
                          }}
                        >
                          Category weightage
                        </span>
                      </Col>
                    </Row>

                    {kra.sub_kra?.map((sub: SubKra) => (
                      <Row key={sub.id} className="py-2">
                        <Col xs={8}>
                          <p className="mb-1 small">{sub.sub_kra_name}</p>
                        </Col>
                        <Col xs={4} className="text-end">
                          {sub.sub_kra_weightage}%
                        </Col>
                      </Row>
                    ))}
                  </Container>
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  )
}
