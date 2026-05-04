import AppraiselBlack from '@project/assets/images/AppraiselBlack.svg'
import AppraiselWhite from '@project/assets/images/AppraiselWhite.svg'
import Calendar from '@project/assets/images/Calendar.svg'
import CalendarWhite from '@project/assets/images/CalendarWhite.svg'
import GoalsBlack from '@project/assets/images/GoalsBlack.svg'
import GoalsWhite from '@project/assets/images/GoalsWhite.svg'
import KraBlack from '@project/assets/images/KraBlack.svg'
import KraWhite from '@project/assets/images/KraWhite.svg'
import MaappingBlackIcon from '@project/assets/images/MappingBlackIcon.svg'
import MappingWhiteIcon from '@project/assets/images/MappingWhiteIcon.svg'
import Tab from '@project/Components/Tab/Tab'
import Goals from '@project/Pages/Admin/Master/Goals/Goals'
import Kra from '@project/Pages/Admin/Master/Kra/Kra'

import Appraisal from './Appraisal/Appraisal'
import DateTab from './Date/DateTab'
import MappedGoals from './GoalMapping/MappedGoals'

import './Master.scss'

export default function Master() {
  const tabs = [
    {
      key: 'goals',
      label: 'Goals',
      icon: {
        active: GoalsWhite,
        inactive: GoalsBlack,
      },
      content: <Goals />,
    },
    {
      key: 'kra',
      label: 'KRA',
      icon: {
        active: KraWhite,
        inactive: KraBlack,
      },
      content: <Kra />,
    },
    {
      key: 'appraisal',
      label: 'Appraisal',
      icon: {
        active: AppraiselWhite,
        inactive: AppraiselBlack,
      },
      content: <Appraisal />,
    },
    {
      key: 'mappedGoals',
      label: 'Mapped Goals',
      icon: {
        active: MappingWhiteIcon,
        inactive: MaappingBlackIcon,
      },
      content: <MappedGoals />,
    },
    {
      key: 'Date',
      label: 'Date',
      icon: {
        active: CalendarWhite,
        inactive: Calendar,
      },
      content: <DateTab />,
    },
  ]

  return <Tab tabs={tabs} />
}
