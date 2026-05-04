import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'

import '@project/Pages/Employee/EmployeeDashboard/EmployeeDashboard.scss'

function EmployeeDashboard() {
  return (
    <div className="dashboard-container container-fluid">
      <NoRecordFound
        heading="Coming Soon"
        description="The Employee Dashboard is currently under development and will be available soon. Stay tuned for updates!"
      />
    </div>
  )
}

export default EmployeeDashboard
