import { useState } from 'react'

import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

import EyeIcon from '@project/assets/images/eyeIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import Spinner from '@project/Common/Spinner'
import CustomPagination from '@project/Components/Pagination/Pagination'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import StatusLegend from '@project/Components/StatusLegend/StatusLegend'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import { useGetReportsListQuery } from '@project/Store/Api/General/Reports/reports'
import useDebounce from '@project/Utils/debounce'
import { adminRoutes, hrRoutes } from '@project/Utils/routeNavigation'

import './Reports.scss'

export default function Reports() {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  const isHrModule = location.pathname.startsWith('/hr')
  const reportDetailsPath = isHrModule
    ? `/${hrRoutes.root}/hr-reports-details`
    : `/${adminRoutes.root}/reports-details`

  const {
    data,
    isLoading: ListLoading,
    isFetching: ListFetching,
    isError: ListError,
  } = useGetReportsListQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    order_by: 'asc',
  })

  if (ListLoading) {
    return <Spinner />
  }
  if (ListError) {
    return <p>Getting error while fetching the data</p>
  }

  type ReportRow = NonNullable<typeof data>['reports'][number]

  const statusCell = (item: ReportRow, value: string) =>
    item.form_status === 'Unpublished' ? '-' : getStatusIcon(value)

  const columns: ColumnDef<ReportRow>[] = [
    {
      key: 'employee_id',
      header: 'Emp ID',
    },
    {
      key: 'employee_name',
      header: 'Employee name',
    },
    {
      key: 'form_status',
      header: 'Form status',
      render: (item) => <>{getStatusIcon(item.form_status)}</>,
    },
    {
      key: 'employee_status',
      header: 'Employee',
      render: (item) => <>{statusCell(item, item.employee_status)}</>,
    },
    {
      key: 'hr_status',
      header: 'HR',
      render: (item) => <>{statusCell(item, item.hr_status)}</>,
    },
    {
      key: 'irm_status',
      header: 'IRM',
      render: (item) => <>{statusCell(item, item.irm_status)}</>,
    },
    {
      key: 'srm_status',
      header: 'SRM',
      render: (item) => <>{statusCell(item, item.srm_status)}</>,
    },
    {
      key: 'director_engineer_status',
      header: 'Director Engineer',
      render: (item) => <>{statusCell(item, item.director_engineer_status)}</>,
    },
    {
      key: 'unit_head_status',
      header: 'Unit head',
      render: (item) => <>{statusCell(item, item.unit_head_status)}</>,
    },
    {
      key: 'management_status',
      header: 'Management',
      render: (item) => <>{statusCell(item, item.management_status)}</>,
    },
    ...(!isHrModule
      ? [
        {
          key: 'action',
          header: 'Action',
          render: (item: ReportRow) => (
            <div>
              {item.form_status === 'Unpublished' ? (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip
                      id={`tooltip-${item.employee_id}`}
                      className="custom-tooltip"
                    >
                      <span className="tooltip-text">
                        Form is not published yet
                      </span>
                    </Tooltip>
                  }
                >
                  <span style={{ display: 'inline-block' }}>
                    <button
                      className="transparentButton"
                      disabled
                      style={{ pointerEvents: 'none' }}
                    >
                      <img src={EyeIcon} alt="viewIcon" className="px-3" />
                    </button>
                  </span>
                </OverlayTrigger>
              ) : (
                <Link
                  to={`${reportDetailsPath}/${encodeURIComponent(item.employee_id)}`}
                  state={{ item }}
                >
                  <button className="transparentButton">
                    <img src={EyeIcon} alt="viewIcon" className="px-3" />
                  </button>
                </Link>
              )}
            </div>
          ),
        } as ColumnDef<ReportRow>,
      ]
      : []),
  ]

  return (
    <Container fluid className="px-0 reportsContainer">
      <TopSearch
        showButton={false}
        title="Status Report"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setCurrentPage(1)
        }}
      />
      <div className="commonTable customReportsTable">
        <StatusLegend
          groups={[
            {
              label: 'Form status',
              items: [
                { label: 'Published', status: 'Published' },
                { label: 'Unpublished', status: 'Unpublished' },
              ],
            },
            {
              label: 'Others',
              items: [
                { label: 'Pending', status: 'Pending' },
                { label: 'Reviewed', status: 'Reviewed' },
                { label: 'Draft', status: 'Draft' },
              ],
            },
          ]}
        />
        <GenericTable<ReportRow>
          columns={columns}
          data={data?.reports ?? []}
          isLoading={ListFetching}
          keyExtractor={(item) => item.employee_id}
          emptyState={{
            heading: 'No Reports Found',
            description: 'There are no reports to display at the moment.',
          }}
        />
      </div>
      {data?.reports && data.reports.length > 0 && (
        <CustomPagination
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalRows={data.total_count || 0}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Container>
  )
}
