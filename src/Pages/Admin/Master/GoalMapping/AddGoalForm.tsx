import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AddIcon from '@project/assets/images/AddIcon.png'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CrossIcon from '@project/assets/images/CrossTick.svg'
import DeleteIcon from '@project/assets/images/Delete.svg'
import DeleteConfirmIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import RightTick from '@project/assets/images/RightTick.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import CustomModal from '@project/Components/Modal/Modal'
import ManageWeight from '@project/Pages/Admin/Master/GoalMapping/ManageWeight'
import {
  useCheckDuplicateGoalMutation,
  useGoalListQuery,
  useUpdateGoalMutation,
  useUpsertGoalMasterWeightageMutation,
} from '@project/Store/Api/Admin/Masters/Goals'
import type {
  GoalFormProps,
  GoalList,
  WeightList,
} from '@project/Types/MasterGoals'
import { normalize } from '@project/Utils'
import {
  generateUniqueKey,
  normalizeString,
} from '@project/Utils/commonFunctions'
import useDebounce from '@project/Utils/debounce'
import { showErrorToast } from '@project/Utils/notificationPopup'

import '@project/Pages/Admin/Master/Goals/goal.scss'

const dropdownOption = [
  {
    label: 'Custom goal',
    value: '0',
  },
  {
    label: 'Global goal',
    value: '1',
  },
]

type GoalListItem = GoalList & {
  tempId?: string
}

function AddGoalForm({
  goalFormLabel,
  closeForm,
  handleDataRefetch,
  show,
  editData,
}: GoalFormProps) {
  const [goalList, setGoalList] = useState<GoalListItem[]>([])
  const { data, refetch } = useGoalListQuery({
    page: 1,
    limit: 10000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })
  const [goalErrors, setGoalErrors] = useState<string[]>(goalList.map(() => ''))
  const [cancelForm, setCancelForm] = useState<boolean>(false)
  const [createGoalMutation, { isLoading: createGoalLoading }] =
    useUpsertGoalMasterWeightageMutation()
  const [updateGoalMutation, { isLoading: updateLoading }] =
    useUpdateGoalMutation()

  const [checkDuplicateGoal] = useCheckDuplicateGoalMutation()
  const [label, setLabel] = useState<string>('Add new Goal')
  const containerRef = useRef<HTMLDivElement>(null)
  const [newGoalName, setNewGoalName] = useState<string>('')
  const [newGoalType, setNewGoalType] = useState<string>('')
  const [newGoalError, setNewGoalError] = useState<string>('')
  const [editableIndex, setEditableIndex] = useState<number | null>(null)
  const [goalRowOriginals, setGoalRowOriginals] = useState<
    Record<number, GoalListItem>
  >({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null
  )
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null)
  const [showCancelGoalEditConfirm, setShowCancelGoalEditConfirm] =
    useState<boolean>(false)
  const [showUnsavedGoalConfirm, setShowUnsavedGoalConfirm] =
    useState<boolean>(false)
  const tempGoalIdCounter = useRef<number>(0)
  const lastCheckedNewGoalRef = useRef<string>('')
  const lastCheckedEditRef = useRef<string>('')
  const debouncedGoalName = useDebounce(
    editData ? goalList[0]?.goalName : newGoalName,
    800
  )
  const editableGoalName =
    editableIndex !== null ? (goalList[editableIndex]?.goalName ?? '') : ''
  const debouncedEditableGoalName = useDebounce(editableGoalName, 800)

  const createTempGoalId = useCallback(() => {
    tempGoalIdCounter.current += 1
    return `temp-goal-${Date.now()}-${tempGoalIdCounter.current}`
  }, [])

  useEffect(() => {
    if (goalFormLabel) {
      setLabel(goalFormLabel)
    }
  }, [goalFormLabel])

  useEffect(() => {
    if (label === 'Edit goal' && editData) {
      const existingId = editData.goal_id ?? null
      setGoalList([
        {
          id: existingId,
          tempId: existingId ? undefined : createTempGoalId(),
          goalName: editData.goalName ?? '',
          goalType:
            dropdownOption.find((opt) => opt.label === editData.goalType)
              ?.value ?? '',
          goalWeight: editData.goalWeight ?? 0,
        },
      ])
      setGoalErrors([''])
      setNewGoalName('')
      setNewGoalType('')
      setNewGoalError('')
      setEditableIndex(null)
      setGoalRowOriginals({})
    }
  }, [label, editData, createTempGoalId])

  useEffect(() => {
    if (!debouncedGoalName?.trim()) return
    const normalizedValue = normalizeString(debouncedGoalName).replace(
      /\s+/g,
      ''
    )
    const newCheckKey = `${normalizedValue}|${editData?.goal_id ?? 'new'}`
    if (lastCheckedNewGoalRef.current === newCheckKey) return
    lastCheckedNewGoalRef.current = newCheckKey

    if (
      editData &&
      debouncedGoalName.trim().toLowerCase() ===
        editData.goalName?.trim().toLowerCase()
    ) {
      setNewGoalError('')
      setGoalErrors((prev) => prev.map((err, i) => (i === 0 ? '' : err)))

      return
    }

    const checkTemplateName = async () => {
      try {
        const res = await checkDuplicateGoal({
          goal_name: normalize(debouncedGoalName),
          goal_id: editData?.goal_id || null,
        }).unwrap()

        if (res?.message === 'Duplicate goal name found.') {
          setNewGoalError('This goal name is already in use')
          if (editData) {
            setGoalErrors((prev) =>
              prev.map((err, i) =>
                i === 0 ? 'This goal name is already in use' : err
              )
            )
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const duplicateError = getDuplicateError(
            debouncedGoalName?.trim(),
            null,
            null
          )
          setNewGoalError(duplicateError)
          if (editData) {
            setGoalErrors((prev) => prev.map((err, i) => (i === 0 ? '' : err)))
          }
        }
      } catch (err) {
        console.error('Goal name check failed', err)
      }
    }

    checkTemplateName()
  }, [debouncedGoalName, checkDuplicateGoal])

  useEffect(() => {
    if (editableIndex === null) return
    const currentGoal = goalList[editableIndex]
    if (!currentGoal) return

    const trimmedValue = debouncedEditableGoalName.trim()
    if (!trimmedValue) {
      setGoalErrors((prev) => {
        const next = [...prev]
        next[editableIndex] = ''
        return next
      })
      return
    }

    // Guard against stale debounced text from a previously edited row.
    if (
      normalizeString(trimmedValue) !== normalizeString(currentGoal.goalName)
    ) {
      return
    }

    const original = goalRowOriginals[editableIndex]
    if (
      original &&
      normalizeString(original.goalName) === normalizeString(trimmedValue)
    ) {
      setGoalErrors((prev) => {
        const next = [...prev]
        next[editableIndex] = ''
        return next
      })
      return
    }

    // Avoid running duplicate-check validation immediately on edit mode entry
    // (prevents a brief flicker of an error message when the value hasn't changed).
    const originalGoalName =
      goalRowOriginals[editableIndex]?.goalName?.trim() ?? ''
    if (trimmedValue === originalGoalName) {
      setGoalErrors((prev) => {
        const next = [...prev]
        next[editableIndex] = ''
        return next
      })
      return
    }

    const normalizedValue = normalizeString(trimmedValue)
    const editCheckKey = `${editableIndex}|${normalizedValue}|${currentGoal.id ?? 'new'}`
    if (lastCheckedEditRef.current === editCheckKey) return
    lastCheckedEditRef.current = editCheckKey

    const checkTemplateName = async () => {
      try {
        const res = await checkDuplicateGoal({
          goal_name: normalize(trimmedValue),
          goal_id: currentGoal.id || null,
        }).unwrap()

        setGoalErrors((prev) => {
          const next = [...prev]
          const normalizedValued = normalizeString(trimmedValue)
          const isDuplicateInList = goalList.some((goal, i) => {
            if (i === editableIndex) return false
            return normalizeString(goal.goalName) === normalizedValued
          })
          if (res?.message === 'Duplicate goal name found.') {
            next[editableIndex] = isDuplicateInList
              ? 'This goal name is already used in this form'
              : 'This goal name is already in use'
            return next
          }
          next[editableIndex] = isDuplicateInList
            ? 'This goal name is already used in this form'
            : ''
          return next
        })
      } catch (err) {
        console.error('Goal name check failed', err)
      }
    }

    checkTemplateName()
  }, [
    debouncedEditableGoalName,
    editableIndex,
    goalList,
    goalRowOriginals,
    checkDuplicateGoal,
  ])

  const [manageWeight, setManageWeight] = useState<WeightList[]>([])

  const getGoalTypeLabel = useCallback(
    (value: string) =>
      dropdownOption.find((option) => option.value === value)?.label || '',
    []
  )

  const getDuplicateError = useCallback(
    (value: string, currentId: string | null, currentIndex: number | null) => {
      const normalizedValue = normalizeString(value)
      if (!normalizedValue) return ''

      const isDuplicateInApi =
        data?.goals?.some(
          (goal) =>
            normalizeString(goal.goal_name) === normalizedValue &&
            goal.id !== currentId
        ) ?? false

      const isDuplicateInList = goalList.some((goal, i) => {
        if (currentIndex !== null && i === currentIndex) return false
        return normalizeString(goal.goalName) === normalizedValue
      })

      if (isDuplicateInApi) return 'This goal name is already in use'
      if (isDuplicateInList)
        return 'This goal name is already used in this form'
      return ''
    },
    [data?.goals, goalList]
  )

  useEffect(() => {
    const trimmedValue = newGoalName.trim()
    if (!trimmedValue) {
      if (newGoalError) setNewGoalError('')
      return
    }

    const duplicateError = getDuplicateError(trimmedValue, null, null)
    if (duplicateError !== newGoalError) {
      setNewGoalError(duplicateError)
    }
  }, [newGoalName, goalList, getDuplicateError, newGoalError])

  const addField = useCallback(() => {
    const trimmedName = newGoalName.trim()
    const trimmedType = String(newGoalType).trim()

    if (!trimmedName || !trimmedType) {
      setNewGoalError('Goal name and type are required')
      return
    }

    const cleanedName = trimmedName.replace(/\s+/g, ' ')

    setGoalList((prev) => [
      ...prev,
      {
        id: null,
        tempId: createTempGoalId(),
        goalName: cleanedName,
        goalType: trimmedType,
        goalWeight: 0,
      },
    ])
    setGoalErrors((prev) => [...prev, ''])
    setNewGoalName('')
    setNewGoalType('')
    setNewGoalError('')
    setEditableIndex(null)

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 100)
  }, [newGoalName, newGoalType, containerRef, createTempGoalId])

  const deleteField = useCallback(
    (index: number) => {
      setGoalList(goalList.filter((_, i) => i !== index))
      setGoalErrors((prev) => prev.filter((_, i) => i !== index))
      setGoalRowOriginals((prev) => {
        const { [index]: _, ...rest } = prev
        return rest
      })
      if (editableIndex === index) {
        setEditableIndex(null)
      }
    },
    [goalList, editableIndex]
  )

  const handleDeleteConfirmOpen = useCallback((index: number) => {
    setPendingDeleteIndex(index)
    setShowDeleteConfirm(true)
  }, [])

  const handleDeleteConfirmClose = useCallback(() => {
    setShowDeleteConfirm(false)
    setPendingDeleteIndex(null)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (pendingDeleteIndex !== null) {
      deleteField(pendingDeleteIndex)
    }
    handleDeleteConfirmClose()
  }, [pendingDeleteIndex, deleteField, handleDeleteConfirmClose])

  const handleGoalName = useCallback(
    (index: number, value: string) => {
      setGoalList((prev) =>
        prev.map((goal, i) =>
          i === index ? { ...goal, goalName: value } : goal
        )
      )
      const normalizedValue = normalizeString(value)
      const isDuplicateInList = goalList.some((goal, i) => {
        if (i === index) return false
        return normalizeString(goal.goalName) === normalizedValue
      })
      setGoalErrors((prev) => {
        const next = [...prev]
        next[index] = isDuplicateInList
          ? 'This goal name is already used in this form'
          : ''
        return next
      })
    },
    [goalList]
  )

  const handleGoalChange = useCallback(
    (index: number, field: 'goalName' | 'goalType', value: string) => {
      setGoalList((prev) =>
        prev.map((goal, i) =>
          i === index ? { ...goal, [field]: value } : goal
        )
      )
    },
    []
  )

  const handleNewGoalName = useCallback(
    (value: string) => {
      if (value.length > 50) {
        setNewGoalError('Maximum 50 characters allowed')
        return
      }

      setNewGoalName(value)

      const trimmedValue = value.trim()

      const duplicateError = getDuplicateError(trimmedValue, null, null)
      setNewGoalError(duplicateError)
      if (!trimmedValue) {
        if (newGoalError) setNewGoalError('')
      }
    },
    [newGoalError, getDuplicateError]
  )

  const handleNewGoalType = useCallback(
    (value: string) => {
      setNewGoalType(value)

      const trimmedName = newGoalName.trim()
      if (!trimmedName) {
        if (newGoalError) setNewGoalError('')
        return
      }

      const duplicateError = getDuplicateError(trimmedName, null, null)
      setNewGoalError(duplicateError)
    },
    [newGoalError, newGoalName, getDuplicateError]
  )

  const startRowEdit = useCallback(
    (index: number) => {
      setGoalRowOriginals((prev) => ({
        ...prev,
        [index]: { ...goalList[index] },
      }))
      // Clear any previous error for this row immediately to avoid flicker when entering edit mode
      setGoalErrors((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      setEditableIndex(index)
      setActiveEditIndex(index)
    },
    [goalList]
  )

  const confirmRowEdit = useCallback(() => {
    if (editableIndex === null) return

    const currentGoal = goalList[editableIndex]
    if (!currentGoal.goalName.trim()) {
      setGoalErrors((prev) => {
        const newErrors = [...prev]
        newErrors[editableIndex] = 'Goal name cannot be empty'
        return newErrors
      })
      return
    }

    if (goalErrors[editableIndex]) {
      return
    }
    setActiveEditIndex(null)
    setEditableIndex(null)
    setGoalRowOriginals((prev) => {
      const { [editableIndex]: _, ...rest } = prev
      return rest
    })
  }, [editableIndex, goalList, goalErrors])

  const cancelRowEdit = useCallback(() => {
    setActiveEditIndex(null)
    if (editableIndex === null) return
    const original = goalRowOriginals[editableIndex]
    if (original) {
      setGoalList((prev) =>
        prev.map((goal, i) => (i === editableIndex ? original : goal))
      )
    }
    setGoalErrors((prev) => {
      const nextErrors = [...prev]
      nextErrors[editableIndex] = ''
      return nextErrors
    })
    setEditableIndex(null)
    setGoalRowOriginals((prev) => {
      const { [editableIndex]: _, ...rest } = prev
      return rest
    })
    setShowCancelGoalEditConfirm(false)
  }, [editableIndex, goalRowOriginals])

  const isRowDirty = useCallback(
    (index: number) => {
      const original = goalRowOriginals[index]
      const current = goalList[index]
      if (!original || !current) return false
      return (
        original.goalName !== current.goalName ||
        String(original.goalType) !== String(current.goalType)
      )
    },
    [goalList, goalRowOriginals]
  )

  const handleCancelRowEditClick = useCallback(() => {
    if (editableIndex === null) return
    if (isRowDirty(editableIndex)) {
      setShowCancelGoalEditConfirm(true)
      return
    }
    cancelRowEdit()
  }, [editableIndex, isRowDirty, cancelRowEdit])

  const isFormValid =
    goalList.length > 0 &&
    goalErrors.every((err) => err === '') &&
    goalList.every(
      (goal) =>
        goal.goalName.trim() !== '' && String(goal.goalType).trim() !== ''
    )

  const getGoalKey = useCallback(
    (goal: WeightList) =>
      generateUniqueKey({
        id: goal.id,
        goalId: goal.goalId,
        goalName: goal.goalName,
        goalType: goal.goalType,
      }),
    []
  )

  const mergeGoals = useCallback(
    (base: WeightList[], extra: WeightList[]) => {
      const merged = new Map<string, WeightList>()
      base.forEach((goal) => merged.set(getGoalKey(goal), goal))
      extra.forEach((goal) => merged.set(getGoalKey(goal), goal))
      return Array.from(merged.values())
    },
    [getGoalKey]
  )

  const handleFormSubmit = useCallback(
    async (overrideGoalList?: GoalListItem[]) => {
      const workingList = overrideGoalList ?? goalList
      const tempGoals: WeightList[] = workingList.map((goal) => ({
        id: goal.id ?? null,
        goalId: goal.id ?? null,
        goalName: goal.goalName.trim(),
        goalType: goal.goalType,
        goalWeight: 0,
      }))

      if (!tempGoals.length) {
        showErrorToast('Please add at least one goal.')
        return
      }

      const refetchResult = await refetch()
      const refreshedGoals =
        ('data' in refetchResult ? refetchResult.data?.goals : data?.goals) ??
        []

      const existingGoals: WeightList[] = refreshedGoals.map((goal) => ({
        id: goal.goal_id ?? null,
        goalId: goal.goal_id ?? null,
        goalName: goal.goal_name,
        goalType: String(goal.goal_type),
        goalWeight: goal.goal_weightage ?? 0,
      }))

      setManageWeight(mergeGoals(existingGoals, tempGoals))
    },
    [goalList, refetch, data?.goals, mergeGoals]
  )

  const handleUpdateGoal = useCallback(async () => {
    const { id, goalName, goalType } = goalList[0]

    if (!id) {
      showErrorToast('Goal ID is required for update')
      return
    }

    const refetchResult = await refetch()
    const freshData = 'data' in refetchResult ? refetchResult.data : data

    // Get all goals from API and update the edited goal's data locally
    const existingGoals: WeightList[] = (freshData?.goals ?? []).map((goal) => {
      // Update the edited goal with new name/type
      if (goal.goal_id === id || goal.id === id) {
        return {
          id: goal.goal_id ?? goal.id,
          goalId: goal.goal_id ?? goal.id,
          goalName: goalName.trim(), // Use edited name
          goalType, // Use edited type
          goalWeight: goal.goal_weightage ?? 0,
          is_associated: goal.is_associated,
        }
      }
      // Keep other goals unchanged
      return {
        id: goal.goal_id ?? goal.id,
        goalId: goal.goal_id ?? goal.id,
        goalName: goal.goal_name,
        goalType: String(goal.goal_type),
        goalWeight: goal.goal_weightage ?? 0,
        is_associated: goal.is_associated,
      }
    })

    setManageWeight(existingGoals)
  }, [goalList, refetch, data])

  const resetForm = useCallback(() => {
    setGoalList([])
    setGoalErrors([])
    setNewGoalName('')
    setNewGoalType('')
    setNewGoalError('')
    setEditableIndex(null)
    setGoalRowOriginals({})
    setManageWeight([])
  }, [])

  useEffect(() => {
    if (show && label === 'Add new Goal') {
      resetForm()
    }
  }, [show, label, resetForm])

  const handleCancelFormOpen = useCallback(() => {
    setCancelForm(true)
  }, [])

  const handleConfirm = useCallback(() => {
    if (label === 'Add new Goal') {
      resetForm()
    }
    setCancelForm(false)
    if (closeForm) closeForm()
  }, [closeForm, label, resetForm])

  const handleCancelFormClose = useCallback(() => {
    setCancelForm(false)
  }, [])

  const handleCancelGoalEditConfirmClose = () => {
    setShowCancelGoalEditConfirm(false)
  }

  const hasUnsavedGoal = useMemo(() => {
    const hasNewInput =
      newGoalName.trim() !== '' || String(newGoalType).trim() !== ''
    const hasDirtyEdit = editableIndex !== null && isRowDirty(editableIndex)
    return hasNewInput || hasDirtyEdit
  }, [newGoalName, newGoalType, editableIndex, isRowDirty])

  const handleUnsavedGoalConfirmClose = useCallback(() => {
    setShowUnsavedGoalConfirm(false)
  }, [])

  const handleUnsavedGoalConfirmProceed = useCallback(() => {
    const hasNewInput =
      newGoalName.trim() !== '' || String(newGoalType).trim() !== ''
    const hasDirtyEdit = editableIndex !== null && isRowDirty(editableIndex)
    let cleanedGoalList = goalList

    if (hasDirtyEdit && editableIndex !== null) {
      const original = goalRowOriginals[editableIndex]
      if (original) {
        cleanedGoalList = goalList.map((goal, i) =>
          i === editableIndex ? original : goal
        )
        setGoalList(cleanedGoalList)
      }
      setGoalErrors((prev) => {
        const next = [...prev]
        next[editableIndex] = ''
        return next
      })
      setEditableIndex(null)
      setActiveEditIndex(null)
      setGoalRowOriginals((prev) => {
        const { [editableIndex]: _, ...rest } = prev
        return rest
      })
    }

    if (hasNewInput) {
      setNewGoalName('')
      setNewGoalType('')
      setNewGoalError('')
    }

    setShowUnsavedGoalConfirm(false)
    handleFormSubmit(cleanedGoalList)
  }, [
    newGoalName,
    newGoalType,
    editableIndex,
    isRowDirty,
    goalList,
    goalRowOriginals,
    handleFormSubmit,
  ])

  const handleNextClick = useCallback(() => {
    if (hasUnsavedGoal) {
      setShowUnsavedGoalConfirm(true)
      return
    }
    handleFormSubmit()
  }, [hasUnsavedGoal, handleFormSubmit])

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
        mode="confirm"
      />
      <CustomModal
        show={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteConfirmClose}
        image={DeleteConfirmIcon}
        modalHeading="Delete Goal"
        modalDesc="Are you sure you want to delete this goal?"
        type="Warning"
        mode="confirm"
      />

      <CustomModal
        show={showCancelGoalEditConfirm}
        onClose={handleCancelGoalEditConfirmClose}
        onConfirm={cancelRowEdit}
        image={CloseWhiteIcon}
        modalHeading="Cancel changes"
        modalDesc="Are you sure you want to cancel the changes? It will lose the data."
        type="Warning"
        mode="confirm"
      />
      <CustomModal
        show={showUnsavedGoalConfirm}
        onClose={handleUnsavedGoalConfirmClose}
        onConfirm={handleUnsavedGoalConfirmProceed}
        image={CloseWhiteIcon}
        modalHeading="Unsaved goal"
        modalDesc="Your goal data will be lost. Are you sure you want to proceed?"
        type="Warning"
        mode="confirm"
      />
      <Modal
        show={show}
        onHide={closeForm}
        centered
        size="lg"
        dialogClassName="goal-mapping-modal"
        backdrop="static"
      >
        {!manageWeight.length ? (
          <Row className="addNewGoalMain">
            <Col lg={12} className="addNewGoalHead">
              <div>
                <h3 className="font16 font400 fontOnest">{label}</h3>
              </div>
            </Col>
            <Col className="whiteBg goalMappingBody">
              {label !== 'Edit goal' && (
                <Row className="goalMappingInputRow">
                  <Col md={5} className="addGoalInputField">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="font14 font400 fontOnest mb-0">
                        Goal name
                      </label>

                      <span className="font12 font400 fontOnest">
                        {newGoalName.length}/{50}
                      </span>
                    </div>
                    <CommonInput
                      placeholder="Please enter goal name"
                      width="100%"
                      value={newGoalName}
                      onChange={(e) => handleNewGoalName(e.target.value)}
                    />
                  </Col>
                  <Col md={5} className="addGoalInputField">
                    <CustomDropdown
                      dropdownLabel="Goal type"
                      id="goalType"
                      options={dropdownOption}
                      value={newGoalType}
                      onChange={(e) =>
                        handleNewGoalType(String(e.target.value))
                      }
                      placeholder="Select goal"
                      append={document.body}
                    />
                  </Col>
                  <Col md={2} className="goalMappingInputAction">
                    <button
                      className="add-btn primaryBgColor textWhite addMore goalMappingAddButton"
                      onClick={addField}
                      disabled={
                        !!newGoalError ||
                        !newGoalName.trim() ||
                        !String(newGoalType).trim()
                      }
                      type="button"
                    >
                      <img src={AddIcon} alt="Add" /> Add More
                    </button>
                  </Col>
                  <Col md={12}>
                    {newGoalError && (
                      <div
                        className="text-danger"
                        style={{ fontSize: '12px', marginTop: '4px' }}
                      >
                        {newGoalError}
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              {goalList.length > 0 && (
                <div className="goalMappingTable">
                  <div className="goalMappingTableHeader">
                    <div className="goalMappingColText">Goal name</div>
                    <div className="goalMappingColType">Goal type</div>
                    <div className="goalMappingColAction">Action</div>
                  </div>
                  <div className="goalMappingTableBody" ref={containerRef}>
                    {goalList.map((item, index) => {
                      const isEditable = editableIndex === index
                      const isAnotherEditing =
                        activeEditIndex !== null && activeEditIndex !== index
                      return (
                        <div
                          key={item.id ?? item.tempId}
                          className="goalMappingRow"
                        >
                          <div className="goalMappingColText">
                            {isEditable ? (
                              <CommonInput
                                label=""
                                placeholder="Please enter goal name"
                                width="100%"
                                value={item.goalName}
                                onChange={(e) =>
                                  handleGoalName(index, e.target.value)
                                }
                                className="goalMappingRowInput"
                              />
                            ) : (
                              <div
                                className="goalMappingRowText"
                                title={item.goalName}
                              >
                                {item.goalName}
                              </div>
                            )}
                          </div>
                          <div className="goalMappingColType">
                            {isEditable ? (
                              <CustomDropdown
                                dropdownLabel=""
                                id={`goalType-${index}`}
                                options={dropdownOption}
                                value={item.goalType}
                                onChange={(e) =>
                                  handleGoalChange(
                                    index,
                                    'goalType',
                                    String(e.target.value)
                                  )
                                }
                                placeholder="Select goal"
                                append={document.body}
                              />
                            ) : (
                              <div className="goalMappingRowText">
                                {getGoalTypeLabel(item.goalType)}
                              </div>
                            )}
                          </div>
                          <div className="goalMappingColAction">
                            <button
                              type="button"
                              className="transparentButton"
                              onClick={() =>
                                isEditable
                                  ? confirmRowEdit()
                                  : startRowEdit(index)
                              }
                              disabled={isAnotherEditing}
                            >
                              <img
                                src={isEditable ? RightTick : EditIcon}
                                alt={isEditable ? 'Save' : 'Edit'}
                              />
                            </button>
                            {isEditable ? (
                              <button
                                type="button"
                                className="transparentButton"
                                onClick={handleCancelRowEditClick}
                              >
                                <img src={CrossIcon} alt="Cancel" />
                              </button>
                            ) : (
                              label !== 'Edit goal' && (
                                <button
                                  type="button"
                                  className="transparentButton"
                                  onClick={() => handleDeleteConfirmOpen(index)}
                                  disabled={isAnotherEditing}
                                >
                                  <img src={DeleteIcon} alt="Delete" />
                                </button>
                              )
                            )}
                          </div>
                          {goalErrors[index] && (
                            <span className="error-text textRed">
                              {goalErrors[index]}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Col>
            <Modal.Footer className="border-0 justify-content-start">
              <SharedButton
                label="Cancel"
                variant="outline"
                onClick={handleCancelFormOpen}
              />
              {label === 'Edit goal' ? (
                <SharedButton
                  label="Update"
                  disabled={!isFormValid}
                  onClick={handleUpdateGoal}
                >
                  {updateLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    ''
                  )}
                </SharedButton>
              ) : (
                <SharedButton
                  label="Next"
                  disabled={!!newGoalError || !isFormValid || createGoalLoading}
                  onClick={handleNextClick}
                >
                  {createGoalLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    ''
                  )}
                </SharedButton>
              )}
            </Modal.Footer>
          </Row>
        ) : (
          <ManageWeight
            mode={label === 'Edit goal' ? 'update' : 'create'}
            label={
              label === 'Edit goal'
                ? 'Update weightage'
                : 'Manage goals weightage'
            }
            manageWeight={manageWeight}
            isSubmitting={
              label === 'Edit goal' ? updateLoading : createGoalLoading
            }
            onSubmit={(payload, mode) =>
              mode === 'create'
                ? createGoalMutation(payload).unwrap()
                : updateGoalMutation({
                    goals: payload.goals
                      .filter(
                        (goal): goal is typeof goal & { goal_id: string } =>
                          typeof goal.goal_id === 'string'
                      )
                      .map((goal) => ({
                        goal_id: goal.goal_id,
                        goal_name: goal.goal_name,
                        goal_type: goal.goal_type,
                        goal_weightage: goal.goal_weightage,
                      })),
                  }).unwrap()
            }
            handleDataRefetch={handleDataRefetch}
            addGoalModalClose={closeForm}
            closeForm={() => {
              setManageWeight([])
            }}
          />
        )}
      </Modal>
    </>
  )
}

export default AddGoalForm
