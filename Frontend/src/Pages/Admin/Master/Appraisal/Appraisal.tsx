import { useState } from 'react'

import { Col, Form, Modal, Row } from 'react-bootstrap'

import copyWhite from '@project/assets/images/copyWhite.svg'
import DropDownArrow from '@project/assets/images/DropDownArrow.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import {
  useCreateSessionDataMutation,
  useGetSessionsQuery,
} from '@project/Store/Api/Common/commonApi'
import { showErrorToast } from '@project/Utils/notificationPopup'

import './Appraisal.scss'

// Type-safe helpers to extract message fields from unknown API responses
const isRecord = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null

const extractMessage = (val: unknown): string | undefined => {
  if (!isRecord(val)) return undefined
  const maybeMessage = val.message
  if (typeof maybeMessage === 'string') return maybeMessage

  const maybeData = val.data
  if (isRecord(maybeData) && typeof maybeData.message === 'string') {
    return maybeData.message
  }

  if (typeof val.detail === 'string') return val.detail
  if (typeof val.msg === 'string') return val.msg
  return undefined
}

type backendMessageType = { status: string; message: string } | null

function Appraisal() {
  const [selectedSessionId, setSelectedSessionId] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [backendMessage, setBackendMessage] = useState<backendMessageType>(null)

  const [copyOptions, setCopyOptions] = useState({
    goalsMapping: false,
    KRA: false,
    goalsAssociation: false,
    rating: false,
  })

  const { data: sessionsRes } = useGetSessionsQuery()
  const [createSessionData, { isLoading: isCreating }] =
    useCreateSessionDataMutation()

  const currentSessionId = localStorage.getItem('appraiselSessionId')

  const normalize = (v?: string | null) =>
    v
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') ?? ''

  const sessions = sessionsRes?.appraisal_sessions || []

  const currentSession = sessions.find(
    (item) =>
      normalize(item.appraisal_session_id) === normalize(currentSessionId)
  )

  const currentEndDate = currentSession
    ? new Date(currentSession.session_end_date)
    : null

  const sessionOptions = (sessionsRes?.appraisal_sessions || [])
    .filter((item) => {
      const itemEndDate = new Date(item.session_end_date)

      return (
        normalize(item.appraisal_session_id) !== normalize(currentSessionId) &&
        currentEndDate !== null &&
        itemEndDate < currentEndDate
      )
    })
    .map((s) => ({
      label: s.session,
      value: s.appraisal_session_id,
    }))

  const handleProceed = async () => {
    if (!selectedSessionId) {
      showErrorToast('Please select a session year')
      return
    }

    if (copyOptions.goalsAssociation && !copyOptions.goalsMapping) {
      showErrorToast(
        'Goals Mapping is required when Goals Association is selected.'
      )
      return
    }

    try {
      const res = await createSessionData({
        copy_from_appraisal_session_id: selectedSessionId,
        copy_ratings: copyOptions.rating,
        copy_goal_mappings: copyOptions.goalsMapping,
        copy_goal_associations: copyOptions.goalsAssociation,
        copy_kra_master: copyOptions.KRA,
      }).unwrap()

      const maybeMsg = extractMessage(res)
      if (res.status_code === 409) {
        setBackendMessage({
          status: 'Duplicate creation is not allowed',
          message:
            maybeMsg ||
            'Replicate the data from last year successfully, you will do further action.',
        })
      } else if (res.status_code === 404) {
        setBackendMessage({
          status: 'Data is not available',
          message:
            maybeMsg ||
            'Replicate the data from last year successfully, you will do further action.',
        })
      } else {
        setBackendMessage({
          status: 'Successfully',
          message: maybeMsg || 'Data replicated successfully.',
        })
      }

      setShowModal(true)
    } catch (err: unknown) {
      const errData =
        isRecord(err) && 'data' in err ? (err as { data?: unknown }).data : err

      const msg = extractMessage(errData)
      showErrorToast(msg || 'Something went wrong while replicating data')
    }
  }
  const resetForm = () => {
    setSelectedSessionId('')
    setCopyOptions({
      goalsMapping: false,
      KRA: false,
      goalsAssociation: false,
      rating: false,
    })
  }

  const handleClose = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <div className="mt-4 rounded" style={{ background: '#f4fbfd' }}>
      <div className="p-4 d-flex justify-content-between align-items-center">
        <p className="mb-0">Replicate Appraisal Data</p>
      </div>

      <div className="bg-white p-4">
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <SharedDropDown
                dropdownLabel="Select Year"
                options={sessionOptions}
                icon={DropDownArrow}
                value={selectedSessionId}
                placeHolder="Select  Year"
                onChange={(e) => {
                  const value = e.target.value as string
                  setSelectedSessionId(value)
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="d-flex flex-wrap mb-3 mt-3 gap-3">
              <Form.Check
                type="checkbox"
                id="goals-mapping"
                label="Goals"
                checked={copyOptions.goalsMapping}
                disabled={copyOptions.goalsAssociation}
                onChange={(e) =>
                  setCopyOptions((prev) => ({
                    ...prev,
                    goalsMapping: e.target.checked,
                  }))
                }
              />

              <Form.Check
                type="checkbox"
                id="kra"
                label="KRA's"
                checked={copyOptions.KRA}
                disabled={copyOptions.goalsAssociation}
                onChange={(e) =>
                  setCopyOptions((prev) => ({
                    ...prev,
                    KRA: e.target.checked,
                  }))
                }
              />

              <Form.Check
                type="checkbox"
                id="goals-association"
                label="Goals Association"
                checked={copyOptions.goalsAssociation}
                onChange={(e) =>
                  setCopyOptions((prev) => ({
                    ...prev,
                    goalsAssociation: e.target.checked,
                    goalsMapping: e.target.checked ? true : prev.goalsMapping,
                    KRA: e.target.checked ? true : prev.KRA,
                  }))
                }
              />

              <Form.Check
                type="checkbox"
                id="rating"
                label="Rating Scales"
                checked={copyOptions.rating}
                onChange={(e) =>
                  setCopyOptions((prev) => ({
                    ...prev,
                    rating: e.target.checked,
                  }))
                }
              />
            </div>
          </Col>
        </Row>
        <SharedButton
          label={isCreating ? 'Processing...' : 'Proceed'}
          onClick={handleProceed}
          disabled={
            !selectedSessionId ||
            isCreating ||
            (!copyOptions.rating &&
              !copyOptions.goalsMapping &&
              !copyOptions.KRA &&
              !copyOptions.goalsAssociation)
          }
        />
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        className="custom-success-modal"
      >
        <Modal.Body className="text-center d-flex flex-column justify-content-center">
          <div className="success-icon">
            <span className="icon">
              <img src={copyWhite} alt="" />
            </span>
          </div>
          <h5 className="mt-3 primaryColor">{backendMessage?.status}</h5>
          <p>{backendMessage?.message}</p>
          <SharedButton
            label="Ok"
            onClick={handleClose}
            classname="ModalBtn mt-4"
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Appraisal
