import { useParams } from 'react-router-dom'

import AnalyticsBlackIcon from '@project/assets/images/AnalyticsBlackIcon.svg'
import AnalyticsWhiteIcon from '@project/assets/images/AnalyticsWhiteIcon.svg'
import PedpBlackIcon from '@project/assets/images/PedpBlackIcon.svg'
import PedpWhiteIcon from '@project/assets/images/PedpWhiteIcon.svg'
import ProjectBlackIcon from '@project/assets/images/ProjectsBlackIcon.svg'
import ProjectWhiteIcon from '@project/assets/images/ProjectWhiteIcon.svg'
import Breadcrumbs from '@project/Components/BreadCrumb/BreadCrumb'
import Tab from '@project/Components/Tab/Tab'
import Analytics from '@project/Pages/Management/Reports/ReportDetails/Analytics/Analytics'
import Pedp from '@project/Pages/Management/Reports/ReportDetails/Pedp/Pedp'
import Projects from '@project/Pages/Management/Reports/ReportDetails/Projects/Project'
import { adminRoutes } from '@project/Utils/routeNavigation'

import '@project/Pages/General/Reports/ReportDetails/ReportDetails.scss'

function ReportDetails() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { employee_name } = useParams()
  const decodedName = decodeURIComponent(employee_name || '')

  const tabs = [
    {
      key: 'pedp',
      label: 'PEDP',
      icon: {
        active: PedpWhiteIcon,
        inactive: PedpBlackIcon,
      },
      content: <Pedp />,
    },
    {
      key: 'project',
      label: 'Projects',
      icon: {
        active: ProjectWhiteIcon,
        inactive: ProjectBlackIcon,
      },
      content: <Projects />,
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: {
        active: AnalyticsWhiteIcon,
        inactive: AnalyticsBlackIcon,
      },
      content: <Analytics />,
    },
  ]

  return (
    <div className="reportDetails">
      <Breadcrumbs
        items={[
          {
            label: 'Reports',
            path: `/${adminRoutes.root}/${adminRoutes.reports}`,
          },
          { label: decodedName },
        ]}
      />
      <Tab tabs={tabs} className="ps-0" />
    </div>
  )
}

export default ReportDetails
