import React from 'react'

import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'

import './Dashboard.scss'

function Dashboard(): React.ReactElement {
  return (
    <div className="dashboard-container container-fluid">
      <NoRecordFound
        heading="Coming Soon"
        description="The Admin Dashboard is currently under development and will be available soon. Stay tuned for updates!"
      />
    </div>
  )
}

export default Dashboard
