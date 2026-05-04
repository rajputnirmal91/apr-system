import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import document from '@project/assets/images/Document.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import projectsIcon from '@project/assets/images/projectsIcon.svg'
import userIcon from '@project/assets/images/userIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import CommonDashboard from '@project/Components/CommonDashboard/CommonDashboard'
import {
  useGetIrmCounterQuery,
  useGetIrmDashboardListQuery,
} from '@project/Store/Api/Irm/IrmApi'
import useDebounce from '@project/Utils/debounce'

import IrmDetailsTab from '../IrmDetailsTab/IrmDetailsTab'

// ------------------ TYPES ------------------

interface SummaryCard {
  label: string
  value: number
  icon: string
}

interface EmployeeRow {
  id: number
  Employee_ID: string
  Employee_name: string
  Project_name: string | string[]
  Form_status: string
  Review_status: string
  employee_user_id: string
  employee_form_status: string
}

interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => JSX.Element
}

// ------------------ COMPONENT ------------------

function IrmDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showDetailsPage] = useState(false)
  const [sortBy, setSortBy] = useState('employee_name')
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const debouncedSearch = useDebounce(search, 500)

  // ------------------ API ------------------
  const { data: getCounterData } = useGetIrmCounterQuery()
  const { data } = useGetIrmDashboardListQuery(
    {
      page,
      limit,
      search: debouncedSearch,
      order_by: orderBy,
      sort_by: sortBy,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const list = data?.team_members ?? []
  const totalRecords = data?.total_count ?? 0

  const summaryCards: SummaryCard[] = [
    {
      label: 'No. of team members',
      value: getCounterData?.total_team_member ?? 0,
      icon: userIcon,
    },
    {
      label: 'Total project',
      value: getCounterData?.total_project ?? 0,
      icon: projectsIcon,
    },
    {
      label: 'Appraisal form received',
      value: getCounterData?.total_form_received ?? 0,
      icon: document,
    },
    {
      label: 'Remaining Appraisal form',
      value: getCounterData?.total_form_remaining ?? 0,
      icon: document,
    },
    {
      label: 'Reviewed Appraisal form',
      value: getCounterData?.total_form_reviewed ?? 0,
      icon: document,
    },
  ]

  // ------------------ Helper Function ------------------

  const formatProjectName = (
    projects: string | string[] | undefined
  ): JSX.Element => {
    if (!projects) return <span>-</span>

    const projectList = Array.isArray(projects)
      ? projects
      : projects.split(',').map((p) => p.trim())

    if (projectList.length === 0) return <span>-</span>

    if (projectList.length === 1) {
      return <span>{projectList[0]}</span>
    }

    return (
      <div className="projectNameWrapper d-flex align-items-center gap-2">
        <span className="projectName">{projectList[0]}</span>
        <div className="projectCounter" style={{ color: 'var(--primary' }}>
          +{projectList.length - 1}
        </div>
      </div>
    )
  }

  const tableData = Array.isArray(list)
    ? list?.map((item) => ({
        Employee_ID: item.employee_lms_id,
        Employee_name: item.employee_name,
        Project_name: item.employee_projects,
        Form_status: item.employee_form_status,
        Review_status: item.irm_review_status,
        employee_user_id: item.employee_user_id,
      }))
    : []

  const handleViewDetails = (employee: EmployeeRow) => {
    navigate(`/irm/irmDetailsTab/${employee.employee_user_id}`)
  }

  // ------------------ TABLE COLUMNS ------------------
  const tableColumns: TableColumn<EmployeeRow>[] = [
    { key: 'Employee_ID', label: 'Employee ID', sortable: true },
    { key: 'Employee_name', label: 'Employee Name', sortable: true },
    {
      key: 'Project_name',
      label: 'Project Name',
      sortable: true,
      render: (row: EmployeeRow) => formatProjectName(row.Project_name),
    },
    {
      key: 'Emp Form_status',
      label: 'Emp Form Status',
      render: (row: EmployeeRow) => (
        <>
          {getStatusIcon(row.Form_status)}
          {row.Form_status}
        </>
      ),
    },
    {
      key: 'Review_status',
      label: 'Review Status',
      render: (row: EmployeeRow) => (
        <>
          {getStatusIcon(row.Review_status)}
          {row.Review_status}
        </>
      ),
    },
    {
      key: 'Action',
      label: 'Action',
      render: (row: EmployeeRow) => (
        <button
          onClick={() => handleViewDetails(row)}
          className="transparentButton"
          disabled={row.Form_status === 'Pending'}
        >
          <img src={EyeIcon} alt="view" />
        </button>
      ),
    },
  ]

  return (
    <div className="h-100">
      {!showDetailsPage ? (
        <CommonDashboard
          title="Team Member"
          summaryCards={summaryCards}
          onSearchChange={(val) => setSearch(val)}
          searchValue={search}
          tableColumns={
            tableColumns as unknown as TableColumn<Record<string, unknown>>[]
          }
          tableData={tableData as unknown as Record<string, unknown>[]}
          /*  SERVER PAGINATION */
          useServerPagination
          page={page}
          limit={limit}
          totalRecords={totalRecords}
          onPageChange={(p, l) => {
            setLimit(l)
            setPage(p)
          }}
          onSort={(key, direction) => {
            if (key === 'Employee_name') {
              setSortBy('employee_name')
              setOrderBy(direction)
            }
          }}
          showSearch
        />
      ) : (
        <IrmDetailsTab />
      )}
    </div>
  )
}

export default IrmDashboard
