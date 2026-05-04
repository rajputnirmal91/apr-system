import { useState } from 'react'

import document from '@project/assets/images/Document.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import projectsIcon from '@project/assets/images/projectsIcon.svg'
import userIcon from '@project/assets/images/userIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import CommonDashboard from '@project/Components/CommonDashboard/CommonDashboard'

import ManagerProjectDetails from '../ManagerProjectDetails/ManagerProjectDetails'

// ------------------ TYPES ------------------

interface SummaryCard {
  label: string
  value: number
  icon: string
}

interface TableRow {
  id: number
  Project_name: string
  Client_name: string
  Start_date: string
  End_date: string
  Strength: string
  Review_status: 'Pending' | 'Received' | 'Published' | 'Unpublished' | string
}

interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => JSX.Element
}

// ------------------ SUMMARY CARDS ------------------

const summaryCards: SummaryCard[] = [
  { label: 'No. of Project', value: 10, icon: projectsIcon },
  { label: 'No. of Employee', value: 40, icon: userIcon },
  { label: 'Appraisal form received', value: 12, icon: document },
  { label: 'Remaining Appraisal form', value: 28, icon: document },
  { label: 'Reviewed Appraisal form', value: 5, icon: document },
]

// ------------------ TABLE DATA ------------------

const tableData: TableRow[] = [
  {
    id: 1,
    Project_name: "Run'N Shoot",
    Client_name: 'Kurtis',
    Start_date: 'Dec 12, 2024',
    End_date: 'Dec 12, 2025',
    Strength: '08',
    Review_status: 'Pending',
  },
  {
    id: 2,
    Project_name: 'Skyline Revamp',
    Client_name: 'Ava Patel',
    Start_date: 'Jan 01, 2025',
    End_date: 'Dec 12, 2025',
    Strength: '12',
    Review_status: 'Received',
  },
  {
    id: 3,
    Project_name: 'NextGen AI Portal',
    Client_name: 'Liam Carter',
    Start_date: 'Feb 15, 2025',
    End_date: 'Dec 20, 2025',
    Strength: '10',
    Review_status: 'Pending',
  },
  {
    id: 4,
    Project_name: 'Urban Logistics',
    Client_name: 'Sophia Lee',
    Start_date: 'Mar 05, 2025',
    End_date: 'Dec 30, 2025',
    Strength: '08',
    Review_status: 'Received',
  },
  {
    id: 5,
    Project_name: 'Core Migration',
    Client_name: 'Ethan Brown',
    Start_date: 'Apr 10, 2025',
    End_date: 'Nov 25, 2025',
    Strength: '09',
    Review_status: 'Pending',
  },
]

// ------------------ COMPONENT ------------------

function ManagerDashboard() {
  const [showDetailsPage, setShowDetailsPage] = useState(false)

  const handleViewDetails = () => {
    setShowDetailsPage(true)
  }

  // ------------------ TABLE COLUMNS ------------------
  const tableColumns: TableColumn<TableRow>[] = [
    { key: 'id', label: '#', sortable: true },
    { key: 'Project_name', label: 'Project Name', sortable: true },
    { key: 'Client_name', label: 'Client Name', sortable: true },
    { key: 'Start_date', label: 'Start Date', sortable: true },
    { key: 'End_date', label: 'End Date', sortable: true },
    { key: 'Strength', label: 'Employee Strength', sortable: true },
    {
      key: 'Review_status',
      label: 'Review Status',
      render: (row: TableRow) => (
        <>
          {getStatusIcon(row.Review_status)}
          {row.Review_status}
        </>
      ),
    },
    {
      key: 'Action',
      label: 'Action',
      render: () => (
        <button
          onClick={() => handleViewDetails()}
          className="transparentButton"
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
          title="Projects"
          summaryCards={summaryCards}
          tableColumns={
            tableColumns as unknown as TableColumn<Record<string, unknown>>[]
          }
          tableData={tableData as unknown as Record<string, unknown>[]}
          showSearch
        />
      ) : (
        <ManagerProjectDetails onClose={() => setShowDetailsPage(false)} />
      )}
    </div>
  )
}

export default ManagerDashboard
