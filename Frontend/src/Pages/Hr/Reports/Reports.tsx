import { useState } from 'react'

import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import EyeIcon from '@project/assets/images/eyeIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import Spinner from '@project/Common/Spinner'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import CustomPagination from '@project/Components/Pagination/Pagination'
import StatusLegend from '@project/Components/StatusLegend/StatusLegend'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import { useGetReportsListQuery } from '@project/Store/Api/General/Reports/reports'
import useDebounce from '@project/Utils/debounce'
import { adminRoutes } from '@project/Utils/routeNavigation'

import './Reports.scss'

export const tableHeaders: string[] = [
  'Emp ID',
  'Employee name',
  'Form status',
  'Employee',
  'HR ',
  'IRM ',
  'SRM ',
  'Director Engineer',
  'Unit head ',
  'Management ',
  'Action',
]

export default function Reports() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  const {
    data,
    isLoading: ListLoading,
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
    return <p> Getting error while fetching the data</p>
  }

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
      {data?.reports && data?.reports.length > 0 ? (
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
          <TableResponsive>
            <table className="table custom-table">
              <thead>
                <tr>
                  {tableHeaders.map((title) => (
                    <th
                      key={title}
                      scope="col"
                      className="custom-th font16 font400"
                    >
                      <div className="d-flex align-items-center gap-2 ">
                        <span className="fontOnest font16 font400">
                          {title}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.reports.map((item) => (
                  <tr className="custom-row">
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest textDark">
                        {item.employee_id}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest textDark ">
                        {item.employee_name}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest textDark ">
                        {getStatusIcon(item.form_status)}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest textDark ">
                        {/* {getStatusIcon(item.employee_status)}
                        {item.form_status === 'Unpublished' ? '-' : ''} */}
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.employee_status)}
                      </p>
                    </td>
                    <td className="custom-td">
                      <p className="mb-0 font14 font400 fontOnest  ">
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.hr_status)}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest  ">
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.irm_status)}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest  ">
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.srm_status)}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest  ">
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.director_engineer_status)}
                      </p>
                    </td>
                    <td className="custom-td font14 font400">
                      <p className="mb-0 font14 font400 fontOnest  ">
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.unit_head_status)}
                      </p>
                    </td>

                    <td className="custom-td">
                      <p className="mb-0 font14 font400 fontOnest  ">
                        {item.form_status === 'Unpublished'
                          ? '-'
                          : getStatusIcon(item.management_status)}
                      </p>
                    </td>

                    <td className="custom-td">
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
                                <img
                                  src={EyeIcon}
                                  alt="viewIcon"
                                  className="px-3"
                                />
                              </button>
                            </span>
                          </OverlayTrigger>
                        ) : (
                          <Link
                            to={`/${adminRoutes.root}/reports-details/${encodeURIComponent(
                              item.employee_name
                            )}`}
                            state={{ item }}
                          >
                            <button className="transparentButton" disabled>
                              <img
                                src={EyeIcon}
                                alt="viewIcon"
                                className="px-3"
                              />
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableResponsive>

          <CustomPagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalRows={data?.total_count || 0}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <NoRecordFound
          heading="No Reports Found"
          description="There are no reports to display at the moment."
          className="centerNoRecord"
        />
      )}
    </Container>
  )
}
