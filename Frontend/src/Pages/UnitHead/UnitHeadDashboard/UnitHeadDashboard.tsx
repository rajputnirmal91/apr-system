import { useEffect, useState } from 'react'

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
import {
  useGetUnitheadDashboardCounterQuery,
  useGetUnitHeadDashboardEmpListQuery,
  useLazyGetEmployeeDetailsQuery,
} from '@project/Store/Api/UnitHead/UnitHeadApi'
import {
  EmployeeReview,
  unitHeadDashboardCounterRes,
} from '@project/Types/UnitHead/UnitHeadTypes'
import useDebounce from '@project/Utils/debounce'
import { showErrorToast } from '@project/Utils/notificationPopup'

import './UnitHeadDashboard.scss'

/* ================= TYPES ================= */

export interface Employee {
  id: string
  Employee_ID: string
  Employee_name: string
  Designation: string
  Form_status: string
  Review_status: string
}

export interface Designation {
  designation_id: string
  designation_title: string
}

export interface DesignationApiResponse {
  designations: Designation[]
}

/* ================= COMPONENT ================= */

function UnitHeadDashboard() {
  const navigate = useNavigate()

  /* ---------- STATES ---------- */
  const [search, setSearch] = useState('')
  const [selectedDesignation, setSelectedDesignation] = useState('')
  const [sortBy, setSortBy] = useState('employee_name')
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const debouncedSearch = useDebounce(search, 500)
  const debouncedDesignation = useDebounce(selectedDesignation, 500)

  /* -------- RESET PAGE ON FILTER CHANGE (SAFE UX FIX) -------- */
  useEffect(() => {
    // setPage(1)
  }, [debouncedSearch, debouncedDesignation])

  /* -------- Counters -------- */
  const { data: counterData } = useGetUnitheadDashboardCounterQuery({}) as {
    data?: unitHeadDashboardCounterRes
  }

  /* -------- Dashboard List (API PAGINATION) -------- */
  const { data, isLoading } = useGetUnitHeadDashboardEmpListQuery(
    {
      page,
      limit,
      order_by: orderBy,
      search: debouncedSearch,
      sort_by: sortBy,
    },
    { refetchOnMountOrArgChange: true }
  )

  const list = data?.team_members ?? []
  const totalRecords = data?.total_count ?? 0

  /* -------- PEDP Details -------- */
  const [getPedpDetails, { isLoading: isDetailsloading }] =
    useLazyGetEmployeeDetailsQuery()

  /* ================= DROPDOWNS ================= */

  const designationDropdownOptions =
    list
      ?.map((emp: EmployeeReview) => emp.employee_designation)
      .filter(Boolean)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.findIndex((v) => v.toLowerCase() === value.toLowerCase()) ===
          index
      )
      .map((designation: string) => ({
        label: designation,
        value: designation,
      })) || []

  const dropdowns: DropdownFilter[] = [
    {
      id: 'Designation',
      placeholder: 'Select Designation',
      options: designationDropdownOptions,

      value: selectedDesignation,
      onChange: (e) => setSelectedDesignation(String(e.target.value)),
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

  const tableData: Employee[] = list?.map((item: EmployeeReview) => ({
    id: item?.employee_user_id,
    Employee_ID: item?.employee_lms_id,
    Employee_name: item?.employee_name,
    Designation: item?.employee_designation,
    Form_status: item?.employee_form_status,
    Review_status: item?.unit_head_review_status,
  }))

  /* ================= TABLE COLUMNS ================= */

  const tableColumns: TableColumn<Employee>[] = [
    { key: 'Employee_ID', label: 'Employee ID', sortable: true },
    { key: 'Employee_name', label: 'Employee Name', sortable: true },
    { key: 'Designation', label: 'Designation', sortable: true },
    {
      key: 'Form_status',
      label: 'Form Status',
      sortable: true,
      render: (row) => (
        <>
          {getStatusIcon(row.Form_status)} {row.Form_status}
        </>
      ),
    },
    {
      key: 'Review_status',
      label: 'Review Status',
      sortable: true,
      render: (row) => (
        <>
          {getStatusIcon(row.Review_status)} {row.Review_status}
        </>
      ),
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
              navigate(`/unit-head/unit-head-dashboard-details/${row.id}`)
            } catch {
              showErrorToast('Employee PEDP form not found')
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

  return (
    <div className="hrDashboard unitHeadDashboard padding2480">
      <CommonDashboard
        title="Employees"
        summaryCards={summaryCards}
        dropdowns={dropdowns}
        searchValue={search}
        onSearchChange={setSearch}
        tableColumns={
          tableColumns as unknown as TableColumn<Record<string, unknown>>[]
        }
        defaultItemsPerPage={limit}
        tableData={tableData as unknown as Record<string, unknown>[]}
        isTableLoading={isLoading}
        showSortIcon
        /*  SERVER PAGINATION */
        useServerPagination
        page={page}
        limit={limit}
        totalRecords={totalRecords}
        onPageChange={(p, l) => {
          setLimit(l)
          setPage(p)
        }}
        /*  SERVER SORT */
        onSort={(key, direction) => {
          if (key === 'Employee_name') {
            setSortBy('employee_name')
            setOrderBy(direction)
          }
        }}
      />
    </div>
  )
}

export default UnitHeadDashboard
