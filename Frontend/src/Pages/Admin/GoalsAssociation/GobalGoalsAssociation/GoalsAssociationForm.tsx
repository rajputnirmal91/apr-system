import { useEffect, useMemo, useRef, useState } from 'react'

import { useDispatch } from 'react-redux'

import Danger from '@project/assets/images/Danger.svg'
import deleteDark from '@project/assets/images/deleteDark.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import DownArrow from '@project/assets/images/DownArrow.svg'
import RightWhiteIcon from '@project/assets/images/RightWhiteIcon.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import SharedManageWeightage, {
  WeightList,
} from '@project/Components/SharedManageWeightage/SharedManageWeightage'
import {
  useAddGoalAssociationMutation,
  useKraListNewQuery,
  useUpdateGoalAssociationMutation,
} from '@project/Store/Api/Admin/GoalsAssociation'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import {
  AddGoalAssociationReq,
  AddGoalsRequest,
  Kra,
} from '@project/Types/goalsAssociationTypes'
import { showErrorToast } from '@project/Utils/notificationPopup'
import { useUnsavedChangesGuard } from '@project/Utils/useUnsavedChangesGuard'

import KraDropdown from '../KraDropdown'
import SubKraDropdown from '../SubKraDropdown'

const initialState: AddGoalsRequest = {
  id: null,
  goal_id: '',
  goal_name: '',
  goal_weightage: 0,
  ownerId: null,
  owner_name: '',
  designation_id: null,
  designation_name: null,
  kra: [],
  status: 'Complete',
}

type ManageWeightagePayload = {
  goal_name: string
  goal_weightage: number
  items: WeightList[]
}

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  goal: any
  ownerId: number
  owner_name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editData: any
  onSuccess: () => void
  onCancel: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  designationId?: any
  collapseRequestId?: number | null
  clearCollapseRequest?: () => void
  /** Called whenever the form's unsaved state changes, so parent lists can guard accordion switching */
  onUnsavedStateChange?: (hasUnsaved: boolean) => void
}

function GoalsAssociationForm({
  goal,
  ownerId,
  owner_name,
  editData,
  onSuccess,
  onCancel,
  designationId,
  collapseRequestId,
  clearCollapseRequest,
  onUnsavedStateChange,
}: Props) {
  const isEditMode = Boolean(editData?.id)
  const [formData, setFormData] = useState<AddGoalsRequest>(initialState)
  const [expandedKraId, setExpandedKraId] = useState<string | null>(null)
  const [openWeightModal, setOpenWeightModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deleteKra, setDeleteKra] = useState<any>(null)
  const [isLastKraDelete, setIsLastKraDelete] = useState(false)

  // Track whether KRA or any SubKRA selection panel is open (in-progress = unsaved)
  const [isKraDropdownOpen, setIsKraDropdownOpen] = useState(false)
  const [openSubKraIds, setOpenSubKraIds] = useState<Set<string>>(new Set())

  const originalDataRef = useRef<AddGoalsRequest | null>(null)
  // Track whether the form has been initialised (so we only set originalDataRef once)
  const initialisedRef = useRef(false)
  const dispatch = useDispatch()

  const { data: kraData } = useKraListNewQuery(
    {
      goal_type: editData.designation_id || designationId ? 0 : 1,
      designation_id: editData ? editData.designation_id : designationId,
      goal_association_id: editData?.id,
    },
    { refetchOnMountOrArgChange: true }
  )

  const [addGoalAssociation] = useAddGoalAssociationMutation()
  const [updateGoalAssociation] = useUpdateGoalAssociationMutation()

  // Initialise ONCE on mount — never reset originalDataRef from API refetches
  useEffect(() => {
    if (!initialisedRef.current && editData) {
      initialisedRef.current = true
      setFormData(editData)
      originalDataRef.current = editData
      dispatch(setUnsavedChanges(false))
    }
  }, [editData])

  useEffect(() => {
    if (!originalDataRef.current) return
    const isChanged =
      JSON.stringify(formData) !== JSON.stringify(originalDataRef.current)
    const hasUnsaved = isChanged || isKraDropdownOpen || openSubKraIds.size > 0
    dispatch(setUnsavedChanges(hasUnsaved))
    onUnsavedStateChange?.(hasUnsaved)
  }, [formData, isKraDropdownOpen, openSubKraIds])

  // ─── Unsaved changes detection ───────────────────────────────────────────────
  // Returns true if formData changed OR a dropdown panel is currently open
  const hasLocalUnsavedChanges = () => {
    if (isKraDropdownOpen) return true
    if (openSubKraIds.size > 0) return true
    if (!originalDataRef.current) return false
    return JSON.stringify(formData) !== JSON.stringify(originalDataRef.current)
  }

  const resetForm = () => {
    if (originalDataRef.current) setFormData(originalDataRef.current)
    setExpandedKraId(null)
    setOpenWeightModal(false)
    setIsKraDropdownOpen(false)
    setOpenSubKraIds(new Set())
    dispatch(setUnsavedChanges(false))
    onUnsavedStateChange?.(false)
    onCancel()
  }

  // ─── useUnsavedChangesGuard ───────────────────────────────────────────────────
  // Global click interceptor — catches ALL navigation (sidebar, tabs, accordions,
  // search, etc.) while this form has unsaved changes.
  const { showModal, handleConfirm, handleClose, triggerModal } =
    useUnsavedChangesGuard({
      hasUnsavedChanges: hasLocalUnsavedChanges,
      onConfirmDiscard: resetForm,
    })

  const handleCancel = () => {
    if (hasLocalUnsavedChanges()) {
      triggerModal()
    } else {
      onCancel()
    }
  }

  // Parent requests collapse (e.g. switching accordion from list)
  useEffect(() => {
    if (!collapseRequestId || !editData?.goal_id) return
    if (collapseRequestId === editData.goal_id) {
      clearCollapseRequest?.()
      // The guard's global listener will intercept the triggering click and
      // show the modal automatically — no manual dispatch needed here.
    }
  }, [collapseRequestId])

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const isSubKraComplete = formData.kra.every(
    (kra) => Array.isArray(kra.sub_kra) && kra.sub_kra.length > 0
  )

  const handleSubmit = (
    data: AddGoalsRequest,
    goalData: AddGoalAssociationReq
  ) => {
    const payload = {
      ...data,
      goal_id: goalData.goal_id,
      goal_weightage: goalData.goal_weightage,
      goal_name: goalData.goal_name,
      owner_id: ownerId,
      owner_name,
      status: 'Complete',
    }

    const api = goalData.id
      ? updateGoalAssociation({
        ...payload,
        status: 'Complete',
        id: goalData.id,
      })
      : addGoalAssociation({ ...payload })

    api
      .unwrap()
      .then(() => {
        dispatch(setUnsavedChanges(false))
        setShowSuccessModal(true)
      })
      .catch((e) => showErrorToast(e))
  }

  const buildKraWeights = (
    goalName: string,
    goalWeightage: number,
    items: Kra[]
  ): ManageWeightagePayload => {
    if (!items.length) {
      return { goal_name: goalName, goal_weightage: goalWeightage, items: [] }
    }

    const hasDbData = items.some(
      (item) =>
        item.kra_weightage !== undefined &&
        item.kra_weightage !== null &&
        item.kra_weightage > 0
    )

    if (!hasDbData) {
      const count = items.length
      const base = Math.floor(100 / count)
      let remainder = 100 - base * count
      const autoWeights = items.map((item) => {
        const extra = remainder > 0 ? 1 : 0
        if (remainder > 0) remainder -= 1
        return { id: item.id, name: item.kra_name, weight: base + extra }
      })
      return {
        goal_name: goalName,
        goal_weightage: goalWeightage,
        items: autoWeights,
      }
    }

    return {
      goal_name: goalName,
      goal_weightage: goalWeightage,
      items: items.map((item) => ({
        id: item.id,
        name: item.kra_name,
        weight: item.kra_weightage ?? 0,
      })),
    }
  }

  const kraWeightData = useMemo(
    () => buildKraWeights(goal.goal_name, goal.goal_weightage, formData.kra),
    [goal.goal_name, goal.goal_weightage, formData.kra]
  )

  const handleConfirmDelete = () => {
    if (isLastKraDelete) {
      setShowDeleteModal(false)
      return
    }
    if (!deleteKra) return
    setFormData((prev) => ({
      ...prev,
      kra: prev.kra.filter((k) => k.id !== deleteKra.id),
    }))
    setShowDeleteModal(false)
    setDeleteKra(null)
    setExpandedKraId(null)
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="goal-details" data-ignore-guard="true">
      <div className="section-title">KRA</div>

      {/* KRA Dropdown — notifies us when its panel opens/closes */}
      <KraDropdown
        value={formData.kra}
        options={kraData?.kras || []}
        onOpenChange={setIsKraDropdownOpen}
        onDiscard={resetForm}
        onSelect={(kra) => {
          const newKra = kra.find(
            (k) => !formData.kra.find((existing) => existing.id === k.id)
          )
          setFormData((prev) => ({ ...prev, kra }))
          if (newKra) {
            setExpandedKraId(newKra.id)
          }
        }}
      />

      {/* Applied KRAs */}
      {formData.kra.length > 0 && (
        <div className="applied-kras mt-2">
          <div className="kra-accordion-list">
            {formData.kra.map((kra, index) => (
              <div
                key={`associatedKra${kra.id}`}
                className="kra-accordion-item mb-3 mt-3"
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'var(--lightBlue' }}
                >
                  <div className="kra-header-left">
                    {kra.kra_name}
                    {Array.isArray(kra.sub_kra) && kra.sub_kra?.length > 0 && (
                      <span className="primaryColor font14 ms-2">
                        (Secondary KRA - {kra.sub_kra?.length})
                      </span>
                    )}
                  </div>
                  <div className="kra-header-right">
                    <button
                      className="icon-button"
                      title="Remove KRA"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (formData.kra.length === 1) {
                          setIsLastKraDelete(true)
                        } else {
                          setIsLastKraDelete(false)
                          setDeleteKra(kra)
                        }
                        setShowDeleteModal(true)
                      }}
                    >
                      <img src={deleteDark} alt="deleteDark" />
                    </button>
                    <div className="vr" />
                    <button
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        // If there are unsaved changes and switching to a different KRA row,
                        // show modal — on confirm, discard changes and open the target KRA
                        if (
                          hasLocalUnsavedChanges() &&
                          expandedKraId !== null &&
                          expandedKraId !== kra.id
                        ) {
                          const targetKraId = kra.id
                          triggerModal(() => {
                            // Only discard in-progress panel state (open SubKRA/KRA panels)
                            // Do NOT reset formData — committed KRA list changes must be preserved
                            setIsKraDropdownOpen(false)
                            setOpenSubKraIds(new Set())
                            setExpandedKraId(targetKraId)
                          })
                          return
                        }
                        setExpandedKraId((prev) =>
                          prev === kra.id ? null : kra.id
                        )
                      }}
                    >
                      <img
                        src={kra.id === expandedKraId ? TopArrow : DownArrow}
                        alt="toggle"
                      />
                    </button>
                  </div>
                </div>

                {kra.id === expandedKraId && (
                  <SubKraDropdown
                    value={kra.sub_kra}
                    options={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      kraData?.kras.find((v: any) => v.id === kra.id)
                        ?.sub_kras || []
                    }
                    onSelect={(sub_kra) => {
                      setFormData((prev) => {
                        const newKra = [...prev.kra]
                        newKra[index] = { ...newKra[index], sub_kra }
                        return { ...prev, kra: newKra }
                      })
                    }}
                    kras={kraData?.kras || []}
                    isEditMode={isEditMode}
                    onOpenChange={(open) => {
                      setOpenSubKraIds((prev) => {
                        const next = new Set(prev)
                        if (open) next.add(kra.id)
                        else next.delete(kra.id)
                        return next
                      })
                    }}
                    onSaveComplete={() => setExpandedKraId(null)}
                  />
                )}
              </div>
            ))}
          </div>

          <hr className="mt-1 mb-2 hrw-100" />

          <div className="d-flex gap-2 mt-40 mb-3">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={handleCancel}
            />
            <SharedButton
              label={isEditMode ? 'Update' : 'Save'}
              dataIgnoreGuard
              onClick={() => setOpenWeightModal(true)}
              disabled={!isSubKraComplete}
            />{' '}
          </div>

          <SharedManageWeightage
            className="goalsAssociationWeightage"
            label="KRA"
            showWeightModal={openWeightModal}
            data={kraWeightData}
            onSave={(updatedWeights: WeightList[]) => {
              const newKra = formData.kra.map((kra) => {
                const found = updatedWeights.find((w) => w.id === kra.id)
                return found ? { ...kra, kra_weightage: found.weight } : kra
              })
              const newFormData = { ...formData, kra: newKra }
              setFormData(newFormData)
              // Sync baseline so the form is no longer "dirty" after save
              originalDataRef.current = newFormData
              setOpenWeightModal(false)
              handleSubmit(newFormData, goal)
            }}
            handleWeightModalClose={() => setOpenWeightModal(false)}
          />
        </div>
      )}

      {/* KRA Delete / Last-KRA-info Modal */}
      <CustomModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteKra(null)
          setIsLastKraDelete(false)
        }}
        image={DeleteWhiteIcon}
        onConfirm={!isLastKraDelete ? handleConfirmDelete : undefined}
        type="Warning"
        modalHeading={
          isLastKraDelete
            ? 'At least one KRA is required'
            : 'Are you sure you want to delete this KRA?'
        }
        modalDesc={
          isLastKraDelete
            ? 'A goal must have at least one KRA. The last KRA cannot be deleted.'
            : 'Deleting this KRA will also remove all associated Secondary-KRAs. Do you want to proceed?'
        }
        mode={isLastKraDelete ? 'info' : 'confirm'}
      />

      {/* Success Modal */}
      <CustomModal
        show={showSuccessModal}
        onClose={() => {
          dispatch(setUnsavedChanges(false))
          setShowSuccessModal(false)
          setExpandedKraId(null)
          onSuccess()
        }}
        image={RightWhiteIcon}
        type="Success"
        modalHeading="Success"
        modalDesc={
          isEditMode
            ? 'Goal association updated successfully.'
            : 'Goal association saved successfully.'
        }
        mode="info"
      />

      {/* Unsaved Changes Modal — controlled by useUnsavedChangesGuard */}
      <CustomModal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        image={Danger}
        type="Alert"
        modalHeading="Discard unsaved changes?"
        modalDesc="You have unsaved changes. If you continue, they will be lost."
        mode="confirm"
      />
    </div>
  )
}

export default GoalsAssociationForm
