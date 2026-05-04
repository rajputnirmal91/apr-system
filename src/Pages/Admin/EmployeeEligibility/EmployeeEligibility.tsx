// 1. React & libraries
import { useCallback, useState } from 'react'

import { Container } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import PendingIcon from '@project/assets/images/AlertIcon.svg'
// 6. Assets / Images
import CancelIcon from '@project/assets/images/Cancel.svg'
import CorrectIcon from '@project/assets/images/Correct.svg'
import CrossIcon from '@project/assets/images/Cross.svg'
import UnpublishedIcon from '@project/assets/images/crossRed.svg'
import Danger from '@project/assets/images/Danger.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'
import MultipleUserIcon from '@project/assets/images/MultipleUser.svg'
import SaveIcon from '@project/assets/images/Save.svg'
// 5. Components
import CommonInput from '@project/Common/CommonInput/CommonInput'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import GenericTable from '@project/Components/GenericTable/GenericTable'
import CustomModal from '@project/Components/Modal/Modal'
import OverlayText from '@project/Components/OverlayText/OverlayText'
import CustomPagination from '@project/Components/Pagination/Pagination'
import StatusLegend from '@project/Components/StatusLegend/StatusLegend'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useEditEmployeeEligibilityMutation,
  useGetEmployeeListingQuery,
} from '@project/Store/Api/Admin/EmployeeEligibility/EmployeeEligibilityApi'
// 2. Store / Redux / API
import { setUnsavedChanges } from '@project/Store/Feature/UnSavedChangesSlice/UnSavedChangesSlice'
// 3. Types
import { Reports } from '@project/Types/employeeEligibility'
// 4. Utils / Hooks
import useDebounce from '@project/Utils/debounce'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'
import { useUnsavedChangesGuard } from '@project/Utils/useUnsavedChangesGuard'

// 7. Styles
import '@project/Pages/Admin/EmployeeEligibility/EmployeeEligibility.scss'

interface EmployeeEligibilityCard {
  count: number
  label: string
  icon: string
}

const EligibilityOption = [
  {
    label: 'Eligible',
    value: '0',
  },
  {
    label: 'Not Eligible',
    value: '1',
  },
]

const icons: Record<string, string> = {
  Eligible: PublishedIcon,
  'Not Eligible': UnpublishedIcon,
  Unknown: PendingIcon,
  Published: PublishedIcon,
  Unpublished: UnpublishedIcon,
  Pending: PendingIcon,
}

const getIcon = (status: string) => {
  const icon = icons[status]
  return icon ? <img src={icon} alt={`${status}Icon`} className="me-2" /> : null
}

export default function EmployeeEligibility() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const [editData, setEditData] = useState<Reports | null>(null)
  const [eligibility, setEligibility] = useState<string>('')
  const [formStatus, setFormStatus] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [errors, setErrors] = useState<{
    reason?: string
    eligibility?: string
  }>({})

  // Redux
  const dispatch = useDispatch()

  // 3. API / Queries
  const { data, refetch } = useGetEmployeeListingQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  })
  const [updateEligibility] = useEditEmployeeEligibilityMutation()

  // Division cards data
  const counters = data?.counters
  const EmployeeEligibilityData: EmployeeEligibilityCard[] = [
    {
      count: counters?.total_employees ?? 0,
      label: 'Total employees',
      icon: MultipleUserIcon,
    },
    {
      count: counters?.eligible_employees ?? 0,
      label: 'Eligible for appraisal',
      icon: CorrectIcon,
    },
    {
      count: counters?.not_eligible_employees ?? 0,
      label: 'Not eligible for appraisal',
      icon: CrossIcon,
    },
    {
      count: counters?.unpublished_forms ?? 0,
      label: 'Eligible but form unpublished yet',
      icon: CrossIcon,
    },
  ]

  // Handlers
  const mapEligibilityToValue = (empEligibility: string): string => {
    if (empEligibility === 'Eligible') return '0'
    if (empEligibility === 'Not Eligible') return '1'
    return ''
  }

  const mapFormStatusToValue = (status: string): string => {
    if (status === 'Published') return '0'
    if (status === 'Unpublished') return '1'
    return ''
  }

  const handleEditData = (item: Reports) => {
    setEditData(item)

    // Prefill reason
    setReason(item.reason || '')

    // Prefill eligibility
    setEligibility(mapEligibilityToValue(item.employee_eligibility))

    // Prefill form status
    setFormStatus(mapFormStatusToValue(item.form_status))

    setErrors({})
  }

  const hasLocalUnsavedChanges = () => {
    if (!editData) return false

    const originalEligibility =
      editData.employee_eligibility === 'Eligible' ? '0' : '1'

    const originalReason = editData.reason || ''

    const originalFormStatus = editData.form_status === 'Published' ? '0' : '1'

    return (
      eligibility !== originalEligibility ||
      reason !== originalReason ||
      formStatus !== originalFormStatus
    )
  }

  const resetForm = () => {
    dispatch(setUnsavedChanges(false))
    setEditData(null)
    setReason('')
    setEligibility('')
    setFormStatus('')
    setErrors({})
  }

  // Unsaved changes
  const { showModal, handleConfirm, handleClose } = useUnsavedChangesGuard({
    hasUnsavedChanges: hasLocalUnsavedChanges,
    onConfirmDiscard: resetForm,
  })

  const handleCancel = () => {
    if (hasLocalUnsavedChanges()) {
      handleClose() // or do nothing, global guard will handle it
    } else {
      resetForm()
    }
  }

  // Validation
  const validateForm = () => {
    const validationErrors: {
      reason?: string
      eligibility?: string
    } = {}

    if (!eligibility) {
      validationErrors.eligibility = 'Eligibility is required'
    }

    if (!reason || reason.trim() === '') {
      validationErrors.reason = 'Reason is required'
    }

    setErrors(validationErrors)

    return Object.keys(validationErrors).length === 0
  }

  // Main actions
  const handleEdit = useCallback(async () => {
    const isValid = validateForm()
    if (!isValid) return

    const eligibilityData = {
      id: editData?.id,
      user_id: editData?.user_id,
      employee_id: editData?.employee_id,
      employee_eligibility: eligibility === '0' ? 'Eligible' : 'Not Eligible',
      reason,
      form_status: formStatus === '0' ? 'Published' : 'Unpublished',
      designation_id: editData?.designation_id,
      irm_id: editData?.irm_id,
    }

    try {
      const res = await updateEligibility(eligibilityData).unwrap()
      dispatch(setUnsavedChanges(false))
      showSuccessToast(res?.message || 'Updated successfully')
      resetForm()
      refetch()
    } catch (error) {
      const apiError = error as { data?: { detail?: string } }
      showErrorToast(apiError?.data?.detail || 'Something went wrong')
    }
  }, [
    editData,
    eligibility,
    reason,
    formStatus,
    updateEligibility,
    dispatch,
    refetch,
    resetForm,
  ])

  return (
    <Container fluid className="EmployeeEligibilityAdminContainer">
      <div className="row">
        {EmployeeEligibilityData.map((employeeInfo) => (
          <div key={employeeInfo?.label} className="col commanStyle mx-2 py-3">
            <div className="d-flex gap-3">
              <div className="cardImage customCardWrapper d-flex align-items-center justify-content-center">
                <img
                  src={employeeInfo.icon}
                  alt="MultipleUserIcon"
                  className="Image position-absolute top-50 start-50 translate-middle"
                />
              </div>
              <div>
                <h4 className="font40 font600 fontOnest mb-0">
                  {employeeInfo.count}
                </h4>
                <h4 className="font14 font400 fontOnest mb-0">
                  {employeeInfo.label}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TopSearch
        title="Employee Eligibility"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setCurrentPage(1)
        }}
        showButton={false}
        searchPlaceholder="Search Employee"
        disabled={hasLocalUnsavedChanges()}
      />
      <div className="commonTable">
        <StatusLegend
          groups={[
            {
              label: 'Eligibility status',
              items: [
                { label: 'Eligible', status: 'Published' },
                { label: 'Not Eligible', status: 'Unpublished' },
              ],
            },
            {
              label: 'Form Status',
              items: [
                { label: 'Published', status: 'Published' },
                { label: 'Unpublished', status: 'Unpublished' },
              ],
            },
          ]}
        />
        <GenericTable<Reports>
          columns={[
            {
              key: 'employee_id',
              header: 'Emp ID',
              headerClassName: 'th-emp-id',
            },
            {
              key: 'employee_name',
              header: 'Employee name',
              headerClassName: 'th-emp-name',
            },
            {
              key: 'designation_name',
              header: 'Designation',
              headerClassName: 'th-designation',
            },
            {
              key: 'employee_eligibility',
              header: 'Eligibility status',
              headerClassName: 'th-eligibility text-center',
            },
            { key: 'reason', header: 'Reason', headerClassName: 'th-reason' },
            {
              key: 'form_status',
              header: 'Form status',
              headerClassName: 'th-form-status text-center',
            },
            { key: 'action', header: 'Action', headerClassName: 'th-action' },
          ]}
          data={data?.reports ?? []}
          keyExtractor={(item) => item.employee_id ?? ''}
          emptyState={{
            heading: 'No Employee Found',
            description: 'Currently, no Employee list Found.',
          }}
          renderRow={(item) => {
            const isEditing = editData && editData.user_id === item.user_id
            return (
              <tr key={item.employee_id} className="custom-row">
                <td
                  className={`custom-td td-emp-id ${isEditing ? 'editing-cell' : ''}`}
                >
                  {item.employee_id}
                </td>
                <td className="custom-td td-emp-name">
                  <OverlayText text={item.employee_name} maxLength={20} />
                </td>
                <td className="custom-td td-designation">
                  <OverlayText text={item.designation_name} maxLength={20} />
                </td>
                <td className="custom-td td-eligibility">
                  {isEditing ? (
                    <div
                      className={`field-with-error${errors.eligibility ? ' has-error' : ''}`}
                    >
                      <CustomDropdown
                        id="Employee eligibility"
                        options={EligibilityOption}
                        placeholder="Select eligibility"
                        append={document.body}
                        value={String(eligibility)}
                        onChange={(e: {
                          target: { value: string | number }
                        }) => {
                          const value = String(e.target.value)
                          setEligibility(value)
                          if (value !== '')
                            setErrors((prev) => ({ ...prev, eligibility: '' }))
                        }}
                      />
                      {errors.eligibility && (
                        <p className="field-error">{errors.eligibility}</p>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      {getIcon(item.employee_eligibility)}
                    </div>
                  )}
                </td>
                <td className="custom-td td-reason">
                  {isEditing ? (
                    <div
                      className={`field-with-error${errors.reason ? ' has-error' : ''}`}
                    >
                      <CommonInput
                        placeholder="Enter reason"
                        width="100%"
                        value={reason}
                        maxLength={250}
                        onChange={(e) => {
                          const { value } = e.target
                          setReason(value)
                          if (value.length > 250) {
                            setErrors((prev) => ({
                              ...prev,
                              reason: 'Reason should not exceed 250 characters',
                            }))
                          } else if (value.trim() === '') {
                            setErrors((prev) => ({
                              ...prev,
                              reason: 'Reason is required',
                            }))
                          } else {
                            setErrors((prev) => ({ ...prev, reason: '' }))
                          }
                        }}
                      />
                      {errors.reason && (
                        <p className="field-error">{errors.reason}</p>
                      )}
                    </div>
                  ) : (
                    <OverlayText
                      text={item.reason}
                      maxLength={130}
                      className="reason-text"
                    />
                  )}
                </td>
                <td
                  className={`custom-td td-form-status ${isEditing ? 'editing-cell' : ''}`}
                >
                  <div className="d-flex justify-content-center">
                    {getIcon(item.form_status)}
                  </div>
                </td>
                <td
                  className={`custom-td td-action ${isEditing ? 'editing-cell' : ''}`}
                >
                  {isEditing ? (
                    <div className="d-flex gap-3">
                      <button
                        className="transparentButton"
                        data-ignore-guard="true"
                        onClick={handleEdit}
                      >
                        <img src={SaveIcon} alt="Save" />
                      </button>
                      <button
                        className="transparentButton"
                        onClick={handleCancel}
                      >
                        <img src={CancelIcon} alt="Cancel" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="transparentButton"
                      onClick={() => handleEditData(item)}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </button>
                  )}
                </td>
              </tr>
            )
          }}
        />
        {data?.reports && data.reports.length > 0 && (
          <CustomPagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalRows={data?.total_count || 0}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

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
    </Container>
  )
}
