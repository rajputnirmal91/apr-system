import { useEffect, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useDispatch, useSelector } from 'react-redux'

import Danger from '@project/assets/images/Danger.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { RootState } from '@project/Store/store'

/* ================= TYPES ================= */

export type WeightList = {
  id: string | null
  name: string
  weight: number
  kra_name?: string
}

type ManageWeightData =
  | WeightList[]
  | {
    goal_name?: string
    goal_weightage?: number
    items: WeightList[]
  }

type ManageWeightProps = {
  label: string
  showWeightModal?: boolean
  handleWeightModalClose?: () => void
  data: ManageWeightData
  onSave?: (weights: WeightList[]) => void
  className?: string
}

/* ================= COMPONENT ================= */

function SharedManageWeightage({
  label,
  showWeightModal,
  handleWeightModalClose,
  data,
  onSave,
  className,
}: ManageWeightProps) {
  const dispatch = useDispatch()

  const hasUnsavedChanges = useSelector(
    (state: RootState) => state.unsavedChangesGoalsSlice.hasUnsavedChanges
  )

  const [weightList, setWeightList] = useState<WeightList[]>([])
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [showDiscardModal, setShowDiscardModal] = useState(false)

  /* ---------- Normalize data (Backward compatible) ---------- */

  const isGoalData = !Array.isArray(data) && 'items' in data

  const goalName = isGoalData ? data.goal_name : undefined

  const normalizedData: WeightList[] = isGoalData ? data.items : data

  const totalWeight = weightList.reduce((sum, goal) => sum + goal.weight, 0)

  const wrapLongWordStyle: React.CSSProperties = {
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  }

  /* ---------- Effects ---------- */

  useEffect(() => {
    setWeightList(normalizedData)
  }, [normalizedData])

  useEffect(() => {
    const allWeightsFilled = weightList.every((goal) => goal.weight > 0)
    setIsSaveDisabled(!(allWeightsFilled && totalWeight === 100))
  }, [weightList, totalWeight])

  /* ---------- Handlers ---------- */

  const handleGoalWeight = (index: number, value: string) => {
    const updatedList = [...weightList]
    updatedList[index].weight = Math.max(0, Number(value) || 0)
    setWeightList(updatedList)
  }

  const handleSaveOnly = () => {
    if (onSave) onSave(weightList)

    dispatch(setUnsavedChanges(false))

    if (handleWeightModalClose) handleWeightModalClose()
  }

  /* ================= UI ================= */

  return (
    <>
      <Modal
        show={showWeightModal}
        onHide={handleWeightModalClose}
        centered
        backdrop="static"
        keyboard={false}
        size="lg"
        className={`custom-modal ${className ?? ''}`}
      >
        {/* Header */}
        <Row
          className="addNewGoalMain mx-0"
          style={{ backgroundColor: '#fffff' }}
        >
          <Col lg={12} className="addNewGoalHead">
            <div>
              <h3 className="font20 font400 fontOnest">
                Manage {label} Weightage
              </h3>
            </div>
          </Col>
        </Row>

        {/* Table */}
        <div className="userTableMain p-4">
          <TableResponsive maxHeight="50vh">
            {weightList.length > 0 && weightList[0].kra_name && (
              <tr className="custom-row ">
                <td colSpan={2} className="font16 font600 fontOnest pb-3">
                  <span
                    className=" mb-4"
                    style={{
                      color: 'var(--primary)',
                      marginLeft: '8px',
                      ...wrapLongWordStyle,
                    }}
                  >
                    KRA - {weightList[0].kra_name}
                  </span>
                </td>
              </tr>
            )}

            {goalName && (
              <tr className="custom-row ">
                <td colSpan={2} className="font16 font600 fontOnest pb-3">
                  <span
                    className=" mb-4"
                    style={{
                      color: 'var(--primary)',
                      marginLeft: '8px',
                      ...wrapLongWordStyle,
                    }}
                  >
                    Goal: {goalName}
                  </span>
                </td>
              </tr>
            )}

            <table className="table manageWeightageTable ">
              <thead className="custom-thead">
                <tr className="custom-thead-row">
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2 ">
                      <span className="onest-regular-14">{label}</span>
                    </div>
                  </th>
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2 ">
                      <span className="onest-regular-14">Weightage</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {weightList.map((goal, index) => (
                  <tr className="custom-row" key={goal.id ?? index}>
                    <td className="manageWeightage font16 font400">
                      <p
                        className="mb-0 font16 font400 fontOnest textDark text"
                        style={wrapLongWordStyle}
                      >
                        {goal.name}
                      </p>
                    </td>
                    <td
                      className="manageWeightage"
                      style={{ verticalAlign: 'top' }}
                    >
                      <CommonInput
                        placeholder="Please enter goal weightage"
                        width="100%"
                        height="40px"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}
                        value={goal.weight.toString()}
                        onChange={(e) =>
                          handleGoalWeight(index, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableResponsive>
        </div>

        {/* Footer Totals */}
        <Row className="mx-0">
          <Col lg={9}>
            <p className="mt-3 ps-lg-4 totalWeight font14 font400">
              Total {label} Weightage: -{' '}
              <span className="percentage">100%</span>
            </p>
          </Col>
          <Col lg={3}>
            <p className="mt-3 pe-2 totalWeight font14 font400">
              Total Weightage: -{' '}
              <span
                className={totalWeight !== 100 ? 'text-danger' : 'percentage'}
              >
                {totalWeight}%
              </span>
            </p>
          </Col>
        </Row>

        {/* Actions */}
        <Modal.Footer className="justify-content-start">
          <SharedButton
            label="Cancel"
            variant="outline"
            dataIgnoreGuard
            onClick={() => {
              if (hasUnsavedChanges) {
                setShowDiscardModal(true)
                return
              }

              handleWeightModalClose?.()
            }}
          />
          <SharedButton
            label={label === 'Edit weightage' ? 'Update' : 'Save'}
            disabled={isSaveDisabled}
            dataIgnoreGuard
            onClick={handleSaveOnly}
          />
        </Modal.Footer>
      </Modal>

      {/* DISCARD MODAL */}

      <CustomModal
        show={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          dispatch(setUnsavedChanges(false))

          setShowDiscardModal(false)

          handleWeightModalClose?.()
        }}
        image={Danger}
        type="Alert"
        modalHeading="Discard unsaved changes?"
        modalDesc="You have unsaved changes. If you continue, they will be lost."
        mode="confirm"
      />
    </>
  )
}

export default SharedManageWeightage
