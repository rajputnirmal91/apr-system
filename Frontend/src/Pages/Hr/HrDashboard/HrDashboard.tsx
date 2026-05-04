import { useCallback, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import document from '@project/assets/images/Document.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import userIcon from '@project/assets/images/userIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import Spinner from '@project/Common/Spinner'
import CommonDashboard, {
  DropdownFilter,
  TableColumn,
} from '@project/Components/CommonDashboard/CommonDashboard'
import { useGetDesignationQuery } from '@project/Store/Api/Common/commonApi'
import {
  useGetCounterListQuery,
  useGetHrDashboardListQuery,
  useLazyGetEmployeePedpDetailsQuery,
} from '@project/Store/Api/Hr/HrDetailsApi'
import {
  getHrEmpDashboardRes,
  HrDashboardCounterRes,
} from '@project/Types/Hr/HrDetailsTypes'
import useDebounce from '@project/Utils/debounce'
import { showErrorToast } from '@project/Utils/notificationPopup'

import './HrDashboard.scss'

/* ================= TYPES ================= */

export interface Employee {
  id: string
  Employee_ID: string
  Employee_name: string
  Designation: string
  Form_status: string
  Review_status: string
  employee_form_status?: string
}

export interface Designation {
  designation_id: string
  designation_title: string
}

export interface DesignationApiResponse {
  designations: Designation[]
}

/* ================= COMPONENT ================= */

function HrDashboard() {
  const navigate = useNavigate()

  /* ---------- STATES ---------- */
  const [search, setSearch] = useState('')
  const [selectedDesignation, setSelectedDesignation] = useState('all')
  const [sortBy, setSortBy] = useState('employee_name')
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const debouncedSearch = useDebounce(search, 500)
  const debouncedDesignation = useDebounce(selectedDesignation, 500)

  /* -------- Counters -------- */
  const { data: counterData } = useGetCounterListQuery({}) as {
    data?: HrDashboardCounterRes
  }

  /* -------- Designations -------- */
  const { data: designationData } = useGetDesignationQuery() as {
    data?: DesignationApiResponse
  }

  /* -------- Dashboard List -------- */

  const { data, isLoading, isFetching } = useGetHrDashboardListQuery(
    {
      page,
      limit,
      search: debouncedSearch,
      sort_by: sortBy,
      order_by: orderBy,
      ...(debouncedDesignation && debouncedDesignation !== 'all'
        ? { filter_by: debouncedDesignation }
        : {}),
    },
    { refetchOnMountOrArgChange: true }
  )

  const list = data?.team_members ?? []
  const totalRecords = data?.total_count ?? 0
  /* -------- PEDP Details -------- */

  const [getPedpDetails, { isLoading: isDetailsloading }] =
    useLazyGetEmployeePedpDetailsQuery()

  /* ================= DROPDOWNS ================= */

  const dropdowns: DropdownFilter[] = [
    {
      id: 'Designation',
      placeholder: 'Select Designation',
      options: [
        { label: 'All Designations', value: 'all' },
        ...(designationData?.designations?.map((d) => ({
          label: d.designation_title,
          value: d.designation_id,
        })) ?? []),
      ],
      value: selectedDesignation,
      onChange: (e) => {
        const id = String(e.target.value)
        setSelectedDesignation(id)
        setPage(1)
        // Clear search when "All Designations" is selected
        if (id === 'all') setSearch('')
      },
      filter: true,
      filterPlaceholder: 'Search designations',
      showClear: true,
    },
  ]

  /* ================= SUMMARY CARDS ================= */

  const summaryCards = [
    {
      label: 'Total employee',
      value: counterData?.total_employee ?? 0,
      icon: userIcon,
    },
    {
      label: 'Appraisal form received',
      value: counterData?.total_form_received ?? 0,
      icon: document,
    },
    {
      label: 'Remaining Appraisal form',
      value: counterData?.total_form_remaining ?? 0,
      icon: document,
    },
    {
      label: 'Reviewed Appraisal form',
      value: counterData?.total_form_reviewed ?? 0,
      icon: document,
    },
  ]

  /* ================= API → UI ================= */

  const tableData: Employee[] = Array.isArray(list)
    ? list.map((item: getHrEmpDashboardRes) => ({
      id: item.employee_user_id,
      Employee_ID: item.employee_lms_id,
      Employee_name: item.employee_name,
      Designation: item.employee_designation,
      Form_status: item.employee_form_status,
      Review_status: item.hr_review_status,
    }))
    : []

  /* ================= TABLE COLUMNS ================= */

  const tableColumns: TableColumn<Employee>[] = [
    { key: 'Employee_ID', label: 'Employee ID', sortable: true },
    { key: 'Employee_name', label: 'Employee Name', sortable: true },
    { key: 'Designation', label: 'Designation', sortable: true },
    {
      key: 'Form_status',
      label: 'Form Status',
      sortable: true,
      render: (row) => <>{getStatusIcon(row.Form_status)}</>,
    },
    {
      key: 'Review_status',
      label: 'Review Status',
      sortable: true,
      render: (row) => <>{getStatusIcon(row.Review_status)}</>,
    },
    {
      key: 'Action',
      label: 'Action',
      render: (row) => (
        <button
          className="transparentButton"
          onClick={async () => {
            try {
              await getPedpDetails(row.id).unwrap()
              navigate(`/hr/hr-emp-details/${row.id}`)
            } catch (detail) {
              showErrorToast(
                (detail as string) || 'Employee PEDP form not found'
              )
            }
          }}
          disabled={row.Form_status !== 'Reviewed'}
        >
          {isDetailsloading ? <Spinner /> : <img src={EyeIcon} alt="view" />}
        </button>
      ),
    },
  ]

  /* ================= RENDER ================= */

  const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
    // Map UI column keys to API field names
    const columnToApiFieldMap: Record<string, string> = {
      Employee_ID: 'employee_lms_id',
      Employee_name: 'employee_name',
      Designation: 'employee_designation',
      Form_status: 'employee_form_status',
      Review_status: 'hr_review_status',
    }

    const apiField = columnToApiFieldMap[key]
    if (apiField) {
      setSortBy(apiField)
      setOrderBy(direction)
      setPage(1) // Reset to first page when sorting changes
    }
  }, [])

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val)
    setPage(1) // Reset to first page when search changes
  }, [])

  const handlePageChange = useCallback((p: number, l: number) => {
    // Update both states together to ensure API is called with correct params
    setPage(p)
    setLimit(l)
  }, [])

  return (
    <div className="hrDashboard">
      <CommonDashboard
        title="Employees"
        summaryCards={summaryCards}
        dropdowns={dropdowns}
        searchValue={search}
        onSearchChange={handleSearchChange}
        tableColumns={
          tableColumns as unknown as TableColumn<Record<string, unknown>>[]
        }
        tableData={tableData as unknown as Record<string, unknown>[]}
        isTableLoading={isLoading || isFetching}
        showSortIcon
        /*  SERVER PAGINATION */
        useServerPagination
        page={page}
        limit={limit}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onSort={handleSort}
        noRecordHeading="No Employees Found"
        noRecordDescription="No employees found with the current search or filter"
        legendContent={[
          {
            label: 'Form Status',
            items: [
              { label: 'Pending', status: 'Pending' },
              { label: 'Reviewed', status: 'Reviewed' },
            ],
          },
          {
            label: 'Review Status',
            items: [
              { label: 'Pending', status: 'Pending' },
              { label: 'Reviewed', status: 'Reviewed' },
              { label: 'Draft', status: 'Draft' },
            ],
          },
        ]}
      />
    </div>
  )
}

export default HrDashboard
