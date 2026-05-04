import { useEffect, useState } from 'react'

import { Col, Modal, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import SharedButton from '@project/Components/Button/SharedButton'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { showErrorToast } from '@project/Utils/notificationPopup'

import 'react-datepicker/dist/react-datepicker.css'
import './EditDeadlinesModal.scss'

// -----------------------------
// TYPES
// -----------------------------

type Deadline = {
  event: string
  date: Date
  status?: string
}

type EditDeadlinesModalProps = {
  show: boolean
  handleClose: () => void
  title: string
  deadlines: Deadline[]
  onUpdate: (updated: Deadline[]) => Promise<boolean>
  employeeSubmissionStatus?: string
}

// -----------------------------
// COMPONENT
// -----------------------------

export default function EditDeadlinesModal({
  show,
  handleClose,
  title,
  deadlines,
  onUpdate,
  employeeSubmissionStatus,
}: EditDeadlinesModalProps) {
  const [localDeadlines, setLocalDeadlines] = useState<Deadline[]>(deadlines)

  const getInvalidSequenceIndex = (items: Deadline[]) => {
    for (let i = 1; i < items.length; i += 1) {
      if (items[i].date < items[i - 1].date) {
        return i
      }
    }

    return -1
  }

  // 🔹 Sync local state whenever modal opens or deadlines change
  useEffect(() => {
    if (show) {
      setLocalDeadlines(deadlines)
    }
  }, [show, deadlines])

  // 🔹 Handle individual date change
  const handleDateChange = (date: Date | null, index: number) => {
    if (!date) return

    const previousDate = index > 0 ? localDeadlines[index - 1].date : null
    const nextDate =
      index < localDeadlines.length - 1 ? localDeadlines[index + 1].date : null

    if (previousDate && date <= previousDate) {
      const previousEvent = localDeadlines[index - 1].event
      showErrorToast(`Date should be after ${previousEvent}`)
      return
    }

    if (nextDate && date >= nextDate) {
      const nextEvent = localDeadlines[index + 1].event
      showErrorToast(`Date should be before ${nextEvent}`)
      return
    }

    const updated = [...localDeadlines]
    updated[index].date = date
    setLocalDeadlines(updated)
  }

  // 🔹 Save changes to parent
  const handleSave = async () => {
    const invalidIndex = getInvalidSequenceIndex(localDeadlines)

    if (invalidIndex !== -1) {
      const currentEvent = localDeadlines[invalidIndex].event
      const previousEvent = localDeadlines[invalidIndex - 1].event
      showErrorToast(
        `${currentEvent} date should be same or after ${previousEvent} date`
      )
      return
    }

    const didUpdate = await onUpdate(localDeadlines)

    if (didUpdate) {
      handleClose()
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
      className="customEditDateModal"
    >
      {/* ---------- HEADER ---------- */}
      <h3 className="font20 font400 fontOnest p-4 modalHeading">{title}</h3>

      {/* ---------- BODY ---------- */}
      <div className="p-4">
        <TableResponsive maxHeight="60vh">
          <table className="table table-borderless align-middle">
            <thead className="table-header">
              <tr
                style={{
                  background: '#E8F3F9',
                  borderRadius: '8px',
                }}
              >
                <th
                  className="font14 font500 fontOnest ps-3"
                  style={{
                    width: '50%',
                    backgroundColor: 'var(--secondaryLight)',
                  }}
                >
                  Event name
                </th>
                <th
                  className="font14 font500 fontOnest"
                  style={{
                    width: '30%',
                    backgroundColor: 'var(--secondaryLight)',
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {localDeadlines.map((item, index) => {
                const eventName =
                  item.event === 'Publish appraisal form'
                    ? 'Publish appraisal form'
                    : `Last date for submission by ${item.event}`

                return (
                  <tr key={item.event} className="border-bottom">
                    <td
                      className="font16 font400 fontOnest py-2 ps-3"
                      style={{ backgroundColor: 'var(--lightBlue)' }}
                    >
                      {eventName}
                    </td>

                    <td
                      className="py-2"
                      style={{ backgroundColor: 'var(--lightBlue)' }}
                    >
                      <div className="d-flex align-items-center">
                        <DatePicker
                          selected={item.date}
                          onChange={(date) => handleDateChange(date, index)}
                          minDate={
                            index > 0
                              ? new Date(
                                localDeadlines[index - 1].date.getTime() +
                                86400000
                              )
                              : undefined
                          }
                          maxDate={
                            index < localDeadlines.length - 1
                              ? new Date(
                                localDeadlines[index + 1].date.getTime() -
                                86400000
                              )
                              : undefined
                          }
                          dateFormat="MMM dd, yyyy"
                          className="form-control"
                          calendarClassName="custom-calendar"
                          disabled={
                            item.status === 'Completed' ||
                            index === 0 ||
                            (eventName ===
                              'Last date for submission by Employee submission' &&
                              employeeSubmissionStatus === 'Reviewed')
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableResponsive>

        {/* ---------- FOOTER BUTTONS ---------- */}
        <Row className="pt-4">
          <Col className="d-flex gap-3 justify-content-start">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={handleClose}
            />
            <SharedButton label="Update" onClick={handleSave} />
          </Col>
        </Row>
      </div>
    </Modal>
  )
}
