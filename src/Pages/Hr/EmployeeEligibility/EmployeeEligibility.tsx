import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Container } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import PendingIcon from '@project/assets/images/AlertIcon.svg'
import CorrectIcon from '@project/assets/images/Correct.svg'
import CrossIcon from '@project/assets/images/Cross.svg'
import UnpublishedIcon from '@project/assets/images/crossRed.svg'
import Danger from '@project/assets/images/Danger.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'
import MultipleUserIcon from '@project/assets/images/MultipleUser.svg'
import Spinner from '@project/Common/Spinner'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import CustomModal from '@project/Components/Modal/Modal'
import OverlayText from '@project/Components/OverlayText/OverlayText'
import CustomPagination from '@project/Components/Pagination/Pagination'
import StatusLegend from '@project/Components/StatusLegend/StatusLegend'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import { useGetDesignationQuery } from '@project/Store/Api/Common/commonApi'
import {
  useGetHrEmployeeEligibilityListQuery,
  usePublishPedpMutation,
} from '@project/Store/Api/Hr/HrEmployeeEligibilityApi'
import { setUnsavedChanges } from '@project/Store/Feature/UnSavedChangesSlice/UnSavedChangesSlice'
import { HrEmployeeReport } from '@project/Types/Hr/HrEmployeeEligibilityTypes'
import useDebounce from '@project/Utils/debounce'
import { useUnsavedChangesGuard } from '@project/Utils/useUnsavedChangesGuard'

import './EmployeeEligibility.scss'

interface EmployeeEligibilityCard {
  count: number
  label: string
  icon: string
}

const ICONS: Record<string, string> = {
  Eligible: PublishedIcon,
  'Not Eligible': UnpublishedIcon,
  Unknown: PendingIcon,
  Published: PublishedIcon,
  Unpublished: UnpublishedIcon,
  Pending: PendingIcon,
}

const getIcon = (status: string) => {
  const icon = ICONS[status]
  return icon ? <img src={icon} alt={`${status}Icon`} className="me-2" /> : null
}

// Memoized Card Component — matches CommonDashboard summary card design
const StatsCard = memo(
  ({ employeeInfo }: { employeeInfo: EmployeeEligibilityCard }) => (
    <div
      className="summary-card"
      style={{
        minHeight: '117px',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--white)',
        padding: '16px',
        flex: 1,
      }}
    >
      <div
        className="d-flex align-items-center"
        style={{ gap: '18px', height: '100%' }}
      >
        <div className="iconWrapper d-flex justify-content-center align-items-center">
          <img src={employeeInfo.icon} alt={employeeInfo.label} />
        </div>
        <div className="d-flex flex-column align-items-start">
          <h4 className="mb-0 font40" style={{ fontWeight: 600 }}>
            {employeeInfo.count}
          </h4>
          <p className="mb-0 font14 text-start">{employeeInfo.label}</p>
        </div>
      </div>
    </div>
  )
)

StatsCard.displayName = 'StatsCard'

// Memoized Table Row Component
const EmployeeRow = memo(
  ({
    item,
    isSelected,
    onSelectEmployee,
  }: {
    item: HrEmployeeReport
    isSelected: boolean
    onSelectEmployee: (id: string) => void
  }) => (
    <tr className="custom-row">
      <td className="custom-td td-checkbox">
        <label
          htmlFor={`checkbox-${item.employee_id}`}
          className="visually-hidden"
        >
          Select {item.employee_name}
        </label>
        <input
          id={`checkbox-${item.employee_id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectEmployee(item.employee_id || '')}
          style={{ cursor: 'pointer' }}
        />
      </td>
      <td className="custom-td td-emp-id">
        <p className="mb-0 font14 font400 fontOnest textDark">
          {item.employee_id}
        </p>
      </td>
      <td className="custom-td td-emp-name">
        <OverlayText text={item.employee_name} maxLength={20} />
      </td>
      <td className="custom-td td-designation">
        <OverlayText text={item.designation_name} maxLength={20} />
      </td>
      <td className="custom-td td-eligibility">
        <div className="d-flex justify-content-center">
          {getIcon(item.employee_eligibility)}
        </div>
      </td>
      <td className="custom-td td-reason">
        <OverlayText
          text={item.reason}
          maxLength={130}
          className="reason-text"
        />
      </td>
      <td className="custom-td td-form-status">
        <div className="d-flex justify-content-center">
          {getIcon(item.form_status)}
        </div>
      </td>
    </tr>
  )
)

EmployeeRow.displayName = 'EmployeeRow'

function EmployeeEligibility() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedDesignation, setSelectedDesignation] = useState('all')
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  )

  const selectAllCheckboxRef = useRef<HTMLInputElement>(null)
  const debouncedSearch = useDebounce(search, 500)
  const debouncedDesignation = useDebounce(selectedDesignation, 500)
  const dispatch = useDispatch()

  // Fetch designations for the dropdown
  const { data: designationData } = useGetDesignationQuery() as {
    data?: {
      designations: { designation_id: string; designation_title: string }[]
    }
  }

  const { data, isLoading, isFetching } = useGetHrEmployeeEligibilityListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      order_by: 'asc',
      ...(debouncedDesignation && debouncedDesignation !== 'all'
        ? { filter_by: debouncedDesignation }
        : {}),
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [publishPedp, { isLoading: isPublishing }] = usePublishPedpMutation()

  // Stats cards data
  const statsCards = useMemo<EmployeeEligibilityCard[]>(() => {
    const counters = data?.counters
    return [
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
  }, [data?.counters])

  // Checkbox selection logic
  const handleSelectAll = useCallback(() => {
    if (!data?.reports) return

    setSelectedEmployees((prev) => {
      if (prev.size === data.reports.length) {
        return new Set()
      }
      return new Set(data.reports.map((item) => item.employee_id || ''))
    })
  }, [data?.reports])

  const handleSelectEmployee = useCallback((employeeId: string) => {
    setSelectedEmployees((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId)
      } else {
        newSet.add(employeeId)
      }
      return newSet
    })
  }, [])

  const isAllSelected = useMemo(
    () =>
      data?.reports &&
      data.reports.length > 0 &&
      selectedEmployees.size === data.reports.length,
    [data?.reports, selectedEmployees.size]
  )

  const isIndeterminate = useMemo(
    () =>
      selectedEmployees.size > 0 &&
      data?.reports &&
      selectedEmployees.size < data.reports.length,
    [data?.reports, selectedEmployees.size]
  )

  const resetForm = useCallback(() => {
    dispatch(setUnsavedChanges(false))
  }, [dispatch])

  const { showModal, handleConfirm, handleClose } = useUnsavedChangesGuard({
    hasUnsavedChanges: () => false,
    onConfirmDiscard: resetForm,
  })

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }, [])

  const designationDropdown = useMemo(
    () => [
      {
        id: 'designation',
        placeholder: 'Select Designation',
        options: [
          { label: 'All Designations', value: 'all' },
          ...(designationData?.designations?.map((d) => ({
            label: d.designation_title,
            value: d.designation_id,
          })) ?? []),
        ],
        value: selectedDesignation,
        onChange: (e: { target: { value: string | number } }) => {
          const id = String(e.target.value)
          setSelectedDesignation(id)
          setCurrentPage(1)
          // Clear search when "All Designations" is selected
          if (id === 'all') setSearch('')
        },
        filter: true,
        filterPlaceholder: 'Search designations',
      },
    ],
    [designationData, selectedDesignation]
  )

  const handlePublish = useCallback(async () => {
    if (!data?.reports || selectedEmployees.size === 0) return

    const selectedEmployeeData = data.reports
      .filter((employee) => selectedEmployees.has(employee.employee_id || ''))
      .map((employee) => ({
        ...employee,
        form_status: 'Published',
      }))

    try {
      await publishPedp({
        pepd_eligible_employees: selectedEmployeeData,
      }).unwrap()
      setSelectedEmployees(new Set())
    } catch (error) {
      console.error('Failed to publish:', error)
    }
  }, [data?.reports, selectedEmployees, publishPedp])

  const isPublishDisabled = useMemo(
    () => selectedEmployees.size === 0 || isPublishing,
    [selectedEmployees.size, isPublishing]
  )

  // Update indeterminate state when selection changes
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = !!isIndeterminate
    }
  }, [isIndeterminate])

  // Column definitions for GenericTable
  const columns: ColumnDef<HrEmployeeReport>[] = [
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
    {
      key: 'reason',
      header: 'Reason',
      headerClassName: 'th-reason',
    },
    {
      key: 'form_status',
      header: 'Form status',
      headerClassName: 'th-form-status text-center',
    },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <Container fluid className="EmployeeEligibilityContainer">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              <Spinner />
            </span>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="EmployeeEligibilityContainer">
      <div className="common-dashboardCard mb-1">
        {statsCards.map((card) => (
          <StatsCard key={card.label} employeeInfo={card} />
        ))}
      </div>

      <TopSearch
        title="Eligible Employees"
        dropdowns={designationDropdown}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search Employee"
        buttonLabel="Publish"
        buttonToggledVariant="primary"
        buttonToggledLabel="Publish"
        buttonIconSrc=""
        buttonToggledIconSrc=""
        buttonDisabled={isPublishDisabled}
        buttonLoading={isPublishing}
        onToggle={handlePublish}
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
        <GenericTable<HrEmployeeReport>
          columns={columns}
          data={data?.reports ?? []}
          isLoading={isFetching}
          keyExtractor={(item) => item.employee_id}
          renderRow={(item) => (
            <EmployeeRow
              item={item}
              isSelected={selectedEmployees.has(item.employee_id || '')}
              onSelectEmployee={handleSelectEmployee}
            />
          )}
          emptyState={{
            heading: 'No Employee Found',
            description: 'Currently, no Employee list Found.',
          }}
          className="tableWithInfoBar"
          extraHeaderStart={
            <th className="custom-th th-checkbox">
              <input
                ref={selectAllCheckboxRef}
                type="checkbox"
                checked={!!isAllSelected}
                onChange={handleSelectAll}
                style={{ cursor: 'pointer' }}
                aria-label="Select all employees"
              />
            </th>
          }
        />

        {data?.reports && data.reports.length > 0 && (
          <CustomPagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalRows={data.total_count || 0}
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

export default EmployeeEligibility
