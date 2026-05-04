import AccessPermissionIcon from '@project/assets/images/AccessPermission.svg'
import Calendar from '@project/assets/images/Calendar.svg'
import CalendarWhite from '@project/assets/images/CalendarWhite.svg'
import CertificateBlackIcon from '@project/assets/images/CertificateBlackIcon.svg'
import CertificateWhiteIcon from '@project/assets/images/CertificateWhiteIcon.svg'
import DashboardIconBlack from '@project/assets/images/DashboardBlackIcon.svg'
import DashboardIconWhite from '@project/assets/images/DashboardIconWhite.svg'
import DuplicateActive from '@project/assets/images/duplicateActive.svg'
import DuplicateDark from '@project/assets/images/duplicateDark.svg'
import EmailDark from '@project/assets/images/EmailDark.svg'
import EmailWhite from '@project/assets/images/EmailWhite.svg'
import EmployeeEligibilityBlackIcon from '@project/assets/images/EmployeeEligibilityBlackIcon.svg'
import EmployeeEligibilityWhiteIcon from '@project/assets/images/EmployeeEligibilityWhiteIcon.svg'
import GoalAssociationBlackIcon from '@project/assets/images/GoalAssociationBlackIcon.svg'
import GoalAssociationWhiteIcon from '@project/assets/images/GoalAssocationWhiteIcon.svg'
import KraBlack from '@project/assets/images/KraBlack.svg'
import KraWhite from '@project/assets/images/KraWhite.svg'
import LaptopIcon from '@project/assets/images/laptop.png'
import MaappingBlackIcon from '@project/assets/images/MappingBlackIcon.svg'
import MappingWhiteIcon from '@project/assets/images/MappingWhiteIcon.svg'
import MasterBlackIcon from '@project/assets/images/MasterBlackIcon.svg'
import MessageDark from '@project/assets/images/MessageDark.svg'
import MeterIconBlack from '@project/assets/images/MeterBlackIcon.svg'
import MeterIconWhite from '@project/assets/images/MeterWhiteIcon.svg'
import PerformanceBlackIcon from '@project/assets/images/PerformanceBlackIcon.svg'
import ProjectIconBlack from '@project/assets/images/ProjectsBlackIcon.svg'
import ProjectIconWhite from '@project/assets/images/ProjectWhiteIcon.svg'
import RatingBlackIcon from '@project/assets/images/RatingBlackIcon.svg'
import RatingWhiteIcon from '@project/assets/images/RatingWhiteIcon.svg'
import ReportBlackIcon from '@project/assets/images/ReportsBlackIcon.svg'
import ReportWhiteIcon from '@project/assets/images/ReportsWhiteIcon.svg'
import SelfEvalution from '@project/assets/images/selfAssessment.svg'
import SendDark from '@project/assets/images/SendDark.svg'
import SendWhiteIcon from '@project/assets/images/SendWhiteIcon.svg'
import {
  adminRoutes,
  employeeRoutes,
  hrRoutes,
  managementRoutes,
} from '@project/Utils/routeNavigation'

export type SubMenuItem = {
  label: string
  path: string
  activeIcon: string
  inactiveIcon: string
  relatedPaths?: string[]
}

export type MenuItem = {
  label: string
  path?: string
  activeIcon: string
  inactiveIcon: string
  children?: SubMenuItem[]
  relatedPaths?: string[]
}

const adminMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: adminRoutes.dashboard,
    activeIcon: DashboardIconWhite,
    inactiveIcon: DashboardIconBlack,
  },
  {
    label: 'Configuration',
    activeIcon: PerformanceBlackIcon,
    inactiveIcon: PerformanceBlackIcon,
    children: [
      {
        label: 'Session Master',
        path: adminRoutes.sessionMaster,
        activeIcon: LaptopIcon,
        inactiveIcon: LaptopIcon,
      },
      {
        label: 'Goals',
        path: adminRoutes.goals,
        activeIcon: MappingWhiteIcon,
        inactiveIcon: MaappingBlackIcon,
      },
      {
        label: 'KRA',
        path: adminRoutes.kra,
        activeIcon: KraWhite,
        inactiveIcon: KraBlack,
      },
      {
        label: 'Rating Scales',
        path: adminRoutes.rating,
        activeIcon: RatingWhiteIcon,
        inactiveIcon: RatingBlackIcon,
      },
      {
        label: 'Goal Association',
        path: adminRoutes.goalsAssociation,
        activeIcon: GoalAssociationWhiteIcon,
        inactiveIcon: GoalAssociationBlackIcon,
      },
      {
        label: 'Milestones',
        path: adminRoutes.milestones,
        activeIcon: CalendarWhite,
        inactiveIcon: Calendar,
      },
      {
        label: 'Employee Eligibility',
        path: adminRoutes.employeeEligibility,
        activeIcon: EmployeeEligibilityWhiteIcon,
        inactiveIcon: EmployeeEligibilityBlackIcon,
      },
      {
        label: 'Access Permission',
        path: adminRoutes.accessPermission,
        activeIcon: AccessPermissionIcon,
        inactiveIcon: AccessPermissionIcon,
      },
      {
        label: 'Replicate Data',
        path: adminRoutes.appraisal,
        activeIcon: DuplicateActive,
        inactiveIcon: DuplicateDark,
      },
      {
        label: 'Email Template',
        path: adminRoutes.emailTemplate,
        activeIcon: ReportWhiteIcon,
        inactiveIcon: ReportBlackIcon,
      },
    ],
  },
  {
    label: 'Reports',
    activeIcon: MasterBlackIcon,
    inactiveIcon: MasterBlackIcon,
    children: [
      {
        label: 'Status Report',
        path: adminRoutes.reports,
        relatedPaths: [adminRoutes.reportDetails.split('/')[0]],
        activeIcon: ReportWhiteIcon,
        inactiveIcon: ReportBlackIcon,
      },
    ],
  },
]

const employeeMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: employeeRoutes.dashboard,
    activeIcon: DashboardIconWhite,
    inactiveIcon: DashboardIconBlack,
  },
  {
    label: 'Self Evaluation',
    activeIcon: DashboardIconWhite,
    inactiveIcon: SelfEvalution,
    children: [
      {
        label: 'PEDP',
        path: employeeRoutes.pedp,
        activeIcon: MeterIconWhite,
        inactiveIcon: MeterIconBlack,
      },
      {
        label: 'Project Details',
        path: employeeRoutes.projectDetails,
        activeIcon: ProjectIconWhite,
        inactiveIcon: ProjectIconBlack,
      },
      {
        label: 'Certifications',
        path: employeeRoutes.certification,
        activeIcon: CertificateWhiteIcon,
        inactiveIcon: CertificateBlackIcon,
      },
    ],
  },
]

const hrMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: `/${hrRoutes.root}/${hrRoutes.dashboard}`,
    activeIcon: DashboardIconWhite,
    inactiveIcon: DashboardIconBlack,
  },
  {
    label: 'HR Reviews',
    path: `/${hrRoutes.root}/${hrRoutes.hrReviews}`,
    activeIcon: DashboardIconWhite,
    inactiveIcon: DashboardIconBlack,
  },
  {
    label: 'Publish',
    path: `/${hrRoutes.root}/${hrRoutes.employeeEligibility}`,
    activeIcon: EmployeeEligibilityWhiteIcon,
    inactiveIcon: EmployeeEligibilityBlackIcon,
  },
  {
    label: 'Report',
    path: `/${hrRoutes.root}/${hrRoutes.reportsDashboard}`,
    activeIcon: ReportWhiteIcon,
    inactiveIcon: ReportBlackIcon,
  },
  {
    label: 'Email Template',
    activeIcon: MessageDark,
    inactiveIcon: MessageDark,
    children: [
      {
        label: 'New',
        path: `/${hrRoutes.root}/${hrRoutes.emailTemplateNew}`,
        activeIcon: EmailWhite,
        inactiveIcon: EmailDark,
      },
      {
        label: 'Draft',
        path: `/${hrRoutes.root}/${hrRoutes.emailTemplateDraft}`,
        activeIcon: ReportWhiteIcon,
        inactiveIcon: ReportBlackIcon,
      },
      {
        label: 'Sent',
        path: `/${hrRoutes.root}/${hrRoutes.emailTemplateSent}`,
        activeIcon: SendWhiteIcon,
        inactiveIcon: SendDark,
      },
    ],
  },
]

const managementMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: managementRoutes.dashboard,
    activeIcon: DashboardIconWhite,
    inactiveIcon: DashboardIconBlack,
  },
  {
    label: 'Review and Rating',
    path: managementRoutes.reviewRating,
    activeIcon: RatingWhiteIcon,
    inactiveIcon: RatingBlackIcon,
  },
  {
    label: 'Reports',
    path: managementRoutes.reports,
    activeIcon: ReportWhiteIcon,
    inactiveIcon: ReportBlackIcon,
  },
  {
    label: 'Employee Eligibility',
    path: managementRoutes.employeeEligibility,
    activeIcon: EmployeeEligibilityWhiteIcon,
    inactiveIcon: EmployeeEligibilityBlackIcon,
  },
]

export const roleMenuConfig: Record<string, MenuItem[]> = {
  ADMIN: adminMenuItems,
  USER: employeeMenuItems,
  HR: hrMenuItems,
  MANAGEMENT: managementMenuItems,
}
