// eslint-disable-next-line @typescript-eslint/naming-convention
import { useEffect, useRef, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AddIcon from '@project/assets/images/AddIcon.png'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import DeleteIcon from '@project/assets/images/Delete.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import { GoalsAlertModal } from '@project/Components/Modal/GoalsAlertModal/GoalsAlertModal'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useAddGoalMutation,
  useGoalListQuery,
  useUpdateGoalMutation,
} from '@project/Store/Api/Admin/Masters/Goals'
import { GoalData } from '@project/Types/MasterGoals'
import { DropdownOption } from '@project/Utils/dummyApiData'

import '@project/Pages/Admin/Master/Goals/goal.scss'

type GoalFormProps = {
  goalFormLabel?: string
  closeForm?: () => void
  handleDataRefetch?: () => void
  show: boolean
  handleGoalFormOpen: (label: string) => void
  editData?: GoalData
}

function AddGoalForm({
  goalFormLabel,
  closeForm,
  handleDataRefetch,
  show,
  handleGoalFormOpen,
  editData,
}: GoalFormProps) {
  const [goalList, setGoalList] = useState<GoalData[]>([])
  const { data, refetch } = useGoalListQuery({
    page: 1,
    limit: 1000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })
  const [goalErrors, setGoalErrors] = useState<string[]>(goalList.map(() => ''))
  const [cancelForm, setCancelForm] = useState<boolean>(false)
  const [showUnsavedAlert, setShowUnsavedAlert] = useState<boolean>(false)
  const [createGoal, { isLoading: createGoalLoading }] = useAddGoalMutation()
  const [updateGoal, { isLoading: updateLoading }] = useUpdateGoalMutation()
  const [label, setLabel] = useState<string>('Add new Goal')
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    const formData = { goals: goalList }

    createGoal(formData)
      .unwrap()
      .then(() => {
        if (handleDataRefetch) handleDataRefetch()
        if (closeForm) closeForm()
      })
  }

  useEffect(() => {
    if (goalFormLabel) {
      setLabel(goalFormLabel)
    }
  }, [goalFormLabel])

  useEffect(() => {
    if (label === 'Edit goal' && editData) {
      setGoalList([editData])
    }
  }, [label, editData])

  const addField = () => {
    setGoalList((prev) => [...prev, { id: null, goal_name: '', goal_type: 0 }])

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 100)
  }

  const deleteField = (index: number) => {
    setGoalList(goalList.filter((_, i) => i !== index))
    setGoalErrors((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGoalName = (index: number, value: string) => {
    setGoalList((prev) =>
      prev.map((goal, i) =>
        i === index ? { ...goal, goal_name: value } : goal
      )
    )

    const normalize = (str: string = '') => str.trim().toLowerCase()

    const isDuplicateInApi = data?.goals?.some(
      (goal) => normalize(goal.goal_name) === normalize(value)
    )

    const isDuplicateInList = goalList.some(
      (goal, i) => i !== index && normalize(goal.goal_name) === normalize(value)
    )

    let errorMsg = ''
    if (isDuplicateInApi) {
      errorMsg = 'This goal name already exists'
    } else if (isDuplicateInList) {
      errorMsg = 'This goal name is already used in this form'
    }

    setGoalErrors((prev) => {
      const newErrors = [...prev]
      newErrors[index] = errorMsg
      return newErrors
    })
  }

  const handleGoalChange = (
    index: number,
    field: 'goal_name' | 'goal_type',
    value: number
  ) => {
    setGoalList((prev) =>
      prev.map((goal, i) => (i === index ? { ...goal, [field]: value } : goal))
    )
  }

  const isFormValid =
    goalErrors.every((err) => err === '') &&
    goalList.every(
      (goal) =>
        goal.goal_name.trim() !== '' && String(goal.goal_type).trim() !== ''
    )

  const handleUpdateGoal = () => {
    const { id, goal_name, goal_type } = goalList[0]

    // Find the existing goal to get its current weightage
    const existingGoal = data?.goals?.find(
      (g) => g.goal_id === id || g.id === id
    )

    const updateGoalData = {
      goals: [
        {
          goal_id: id as string,
          goal_name,
          goal_type: Number(goal_type),
          goal_weightage: existingGoal?.goal_weightage ?? 0,
        },
      ],
    }

    updateGoal(updateGoalData)
      .unwrap()
      .then(() => {
        if (handleDataRefetch) handleDataRefetch()
        if (closeForm) closeForm()
        refetch()
      })
  }

  const lastGoal = goalList[goalList.length - 1]

  const isLastGoalValid =
    lastGoal &&
    lastGoal.goal_name.trim() !== '' &&
    String(lastGoal.goal_type).trim() !== '' &&
    goalErrors[goalList.length - 1] === ''

  const resetForm = () => {
    setGoalList([{ id: null, goal_name: '', goal_type: 0 }])
    setGoalErrors([''])
  }

  useEffect(() => {
    if (show && label === 'Add new Goal') {
      resetForm()
    }
  }, [show, label])

  const isFormDirty = () =>
    goalList.some(
      (goal) => goal.goal_name.trim() !== '' || Number(goal.goal_type) !== 0
    )

  const handleCancelFormOpen = () => {
    if (isFormDirty()) {
      setShowUnsavedAlert(true)
      return
    }
    if (closeForm) closeForm()
    setGoalErrors([''])
    if (label === 'Add new Goal') {
      resetForm()
    }
  }

  const handleUnsavedConfirm = () => {
    setShowUnsavedAlert(false)
    resetForm()
    if (closeForm) closeForm()
  }

  const handleConfirm = () => {
    resetForm()
    setCancelForm(false)
  }

  const handleCancelFormClose = () => {
    setCancelForm(false)
    if (handleGoalFormOpen) handleGoalFormOpen('Add new Goal')
  }

  return (
    <>
      <CustomModal
        show={cancelForm}
        onConfirm={handleConfirm}
        onClose={handleCancelFormClose}
        image={CloseWhiteIcon}
        modalHeading={
          label === 'Edit goal' ? 'Cancel edit Goal’s' : 'Cancel Goal’s'
        }
        modalDesc="Are you sure you want to cancel the goal’s"
        type="Warning"
      />
      <GoalsAlertModal
        show={showUnsavedAlert}
        onConfirm={handleUnsavedConfirm}
        onCancel={() => setShowUnsavedAlert(false)}
        description="You have unsaved changes. Are you sure you want to close? Your data will be lost."
      />
      <Modal
        show={show}
        onHide={handleCancelFormOpen}
        centered
        size="lg"
        dialogClassName="custom-modal"
        backdrop="static"
      >
        <Row className="addNewGoalMain">
          <Col lg={12} className="addNewGoalHead">
            <div>
              <h3 className="font16 font400 fontOnest">{label}</h3>
            </div>
          </Col>
          <Col
            ref={containerRef}
            className={`whiteBg ${label === 'Edit goal' ? 'editGoal' : 'addGoal'}`}
          >
            {goalList.map((item, index) => (
              <Row className="py-3">
                <Col
                  lg={label === 'Edit goal' ? 6 : 5}
                  className="goalNameLabel mb-3 mb-lg-0"
                >
                  <CommonInput
                    className="goalPlaceholder"
                    label="Goal name"
                    placeholder="Please enter goal name"
                    width="100%"
                    value={item.goal_name}
                    onChange={(e) => handleGoalName(index, e.target.value)}
                  />
                  {goalErrors[index] && (
                    <span className="error-text textRed">
                      {goalErrors[index]}
                    </span>
                  )}
                </Col>
                <Col
                  lg={label === 'Edit goal' ? 6 : 5}
                  className={`goalNameLabel ${
                    !item.goal_type ? 'is-placeholder' : 'is-selected'
                  }`}
                >
                  <CustomDropdown
                    dropdownLabel="Goal type"
                    id="Goal type"
                    options={DropdownOption}
                    value={item.goal_type ?? ''}
                    onChange={(e) =>
                      handleGoalChange(
                        index,
                        'goal_type',
                        Number(e.target.value)
                      )
                    }
                    placeholder="Select goal"
                    append={document.body}
                  />
                </Col>
                {label !== 'Edit goal' && (
                  <Col lg={2} style={{ padding: '0px 10px' }}>
                    <div className="btnMargin">
                      {index === goalList.length - 1 &&
                      label !== 'Edit KRA form' ? (
                        <button
                          style={{ height: '52px' }}
                          className="add-btn primaryBgColor textWhite addMore"
                          onClick={addField}
                          disabled={!isLastGoalValid}
                        >
                          <img src={AddIcon} alt="Add" /> Add More
                        </button>
                      ) : (
                        <button
                          className="add-btn whiteBg textRed deleteBtn"
                          onClick={() => deleteField(index)}
                        >
                          <img src={DeleteIcon} alt="Delete" /> Delete
                        </button>
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            ))}
          </Col>
          <Modal.Footer className="border-0 justify-content-start">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={handleCancelFormOpen}
            />
            <SharedButton
              label={editData ? 'Update' : 'Publish'}
              loading={editData ? updateLoading : createGoalLoading}
              disabled={!isFormValid}
              onClick={editData ? handleUpdateGoal : handleSubmit}
            />
          </Modal.Footer>
        </Row>
      </Modal>
    </>
  )
}

export default AddGoalForm
