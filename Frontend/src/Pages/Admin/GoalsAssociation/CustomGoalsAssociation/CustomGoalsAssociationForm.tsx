/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import LeftArrow from '@project/assets/images/leftArrow.svg'
import { GoalsAlertModal } from '@project/Components/Modal/GoalsAlertModal/GoalsAlertModal'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import { useLazyGetDesignationListQuery } from '@project/Store/Api/Admin/GoalsAssociation'
import { useGoalListQuery } from '@project/Store/Api/Admin/Masters/Goals'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { RootState } from '@project/Store/store'

type Props = {
  selectedDesignation: string
  setSelectedDesignation: (val: string) => void
  goalsData: any
  selectedDesignationLabel?: string
  isAssociate: boolean
  setIsAssociate: (val: boolean) => void
  onSearch: (value: string) => void
  onDesignationConfirm?: () => void
  formHasUnsaved?: boolean
  /** True when any goal accordion is expanded — treat as unsaved to guard designation change */
  accordionOpen?: boolean
}

export default function CustomGoalsAssociationForm({
  selectedDesignation,
  setSelectedDesignation,
  goalsData,
  selectedDesignationLabel,
  isAssociate,
  setIsAssociate,
  onSearch,
  onDesignationConfirm,
  formHasUnsaved = false,
  accordionOpen = false,
}: Props): JSX.Element {
  const [, setFormData] = useState({})
  const [showBackModal, setShowBackModal] = useState<boolean>(false)
  const [showDesignationModal, setShowDesignationModal] = useState(false)
  const [pendingDesignation, setPendingDesignation] = useState<string | null>(
    null
  )
  const [searchValue, setSearchValue] = useState('')

  const [fetchDesignations, { data: designationData }] =
    useLazyGetDesignationListQuery()

  // Fetch fresh designation data on mount and every time the associate view opens
  useEffect(() => {
    fetchDesignations()
  }, [isAssociate])

  const { data: goalsList } = useGoalListQuery({
    page: 1,
    limit: 1000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })

  const dispatch = useDispatch()

  const typeZeroGoalsLength = useMemo(() => {
    return (
      goalsList?.goals?.filter((goal: any) => goal.goal_type === 0)?.length ?? 0
    )
  }, [goalsList])

  const hasNoRecords = (goalsData?.Goals?.length ?? 0) === 0

  const hasUnsavedChanges = useSelector(
    (state: RootState) => state.unsavedChangesGoalsSlice.hasUnsavedChanges
  )

  const designationOptions = useMemo(() => {
    return (
      designationData?.designations?.map(
        (d: { designation_id: string; designation_title: string }) => ({
          label: d.designation_title,
          value: d.designation_id,
        })
      ) ?? []
    )
  }, [designationData])

  const finalDesignationOptions =
    selectedDesignation &&
      !designationOptions.some((d) => d.value === String(selectedDesignation))
      ? [
        ...designationOptions,
        {
          label: selectedDesignationLabel || selectedDesignation,
          value: String(selectedDesignation),
        },
      ]
      : designationOptions

  //  Handle designation change (FORCE REFRESH)

  const handleDesignationChange = useCallback(
    (e: any) => {
      const newDesignation = String(e.target.value)

      if (hasUnsavedChanges || formHasUnsaved || accordionOpen) {
        setPendingDesignation(newDesignation)
        setShowDesignationModal(true)
        return
      }

      setSelectedDesignation(newDesignation)
      setFormData((prev: any) => ({ ...prev, designation: newDesignation }))
      onSearch('')
    },
    [
      setSelectedDesignation,
      onSearch,
      hasUnsavedChanges,
      formHasUnsaved,
      accordionOpen,
    ]
  )

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      designation: selectedDesignation,
      goals: goalsData?.Goals || [],
    }))
  }, [selectedDesignation, goalsData?.Goals])

  return (
    <Container fluid className="p-0 customGoalsAssociationTopBox">
      <TopSearch
        title="Custom Goals"
        searchPlaceholder="Search Custom Goals"
        searchValue={searchValue}
        isToggled={isAssociate}
        buttonToggledLabel="Back"
        buttonToggledIconSrc={LeftArrow}
        onToggle={(next) => {
          if (!next && hasUnsavedChanges) {
            setShowBackModal(true)
          } else {
            setIsAssociate(next)
          }
        }}
        onSearchChange={(value: string) => {
          setSearchValue(value)
          onSearch(value)
        }}
        disabled={
          hasUnsavedChanges ||
          accordionOpen ||
          (hasNoRecords && searchValue.trim() === '')
        }
        buttonDisabled={typeZeroGoalsLength === 0}
      />

      {isAssociate && (
        <Container fluid className="designationBox p-2">
          <Row className="align-items-center">
            <Col lg={7}>
              <SharedDropDown
                className="customGoalsDropdown"
                icon={dropDownArrow}
                value={selectedDesignation}
                onChange={handleDesignationChange}
                placeHolder="Select Designation"
                options={finalDesignationOptions}
                enableSearch
              />
            </Col>
          </Row>
        </Container>
      )}

      <GoalsAlertModal
        show={showBackModal}
        onConfirm={() => {
          setShowBackModal(false)
          setIsAssociate(false)
          dispatch(setUnsavedChanges(false))
        }}
        onCancel={() => {
          setShowBackModal(false)
        }}
      />

      <GoalsAlertModal
        show={showDesignationModal}
        description="You have unsaved changes. If you continue, they will be lost."
        onConfirm={() => {
          setShowDesignationModal(false)
          if (pendingDesignation) {
            setSelectedDesignation(pendingDesignation)
            setFormData((prev: any) => ({
              ...prev,
              designation: pendingDesignation,
            }))
            onSearch('')
            dispatch(setUnsavedChanges(false))
            setPendingDesignation(null)
            onDesignationConfirm?.()
          }
        }}
        onCancel={() => {
          setShowDesignationModal(false)
          setPendingDesignation(null)
        }}
      />
    </Container>
  )
}
