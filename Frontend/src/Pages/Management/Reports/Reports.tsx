import { useState } from 'react'

import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import PendingIcon from '@project/assets/images/AlertIcon.svg'
import UnpublishedIcon from '@project/assets/images/crossRed.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'
import NoRecordFound from '@project/assets/images/NoRecordFound.svg'
import SearchIcon from '@project/assets/images/Search.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import CustomPagination from '@project/Components/Pagination/Pagination'
import TableHeading from '@project/Components/TableHeading/TableHeading'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { useGetReportsListQuery } from '@project/Store/Api/General/Reports/reports'
import useDebounce from '@project/Utils/debounce'
import { adminRoutes } from '@project/Utils/routeNavigation'

export const tableHeaders: string[] = [
  'Emp ID',
  'Employee name',
  'Form status',
  'Emp submission status',
  'Manager review status',
  'IRM review status',
  'Unit head review status',
  'HR review status',
  'Management review status',
  'Action',
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Published':
      return <img src={PublishedIcon} alt="PublishedIcon" className="me-2" />
    case 'Unpublished':
      return (
        <img src={UnpublishedIcon} alt="UnpublishedIcon" className="me-2" />
      )
    case 'Pending':
      return <img src={PendingIcon} alt="PendingIcon" className="me-2" />
    default:
      return null
  }
}

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
    return <p>Loading the goals ...</p>
  }
  if (ListError) {
    return <p> Getting error while fetching the data</p>
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className="padding24">
      <Row className="align-items-center mb-4">
        <Col lg={9}>
          <TableHeading heading="Status Report" />
        </Col>
        <Col lg={3}>
          <CommonInput
            className="common-input"
            placeholder="Search"
            width="100%"
            icon={<img src={SearchIcon} alt="search" />}
            value={search}
            onChange={handleSearch}
          />
        </Col>
      </Row>
      {data?.reports && data?.reports.length > 0 ? (
        <div className="commonTable">
          <TableResponsive maxHeight="55vh">
            <table className="table custom-table">
              <thead>
                <tr>
                  {tableHeaders.map((title) => (
                    <th
                      key={title}
                      scope="col"
                      className="custom-th font14 font400"
                      style={{ verticalAlign: 'top' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="onest-regular-14">{title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.reports.map((item) => (
                  <tr className="custom-row">
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {item.employee_id}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {item.employee_name}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {getStatusIcon(item.form_status)}
                        {item.form_status}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {getStatusIcon(item.employee_status)}
                        {item.employee_status}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        -
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {getStatusIcon(item.irm_status)}
                        {item.irm_status}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {getStatusIcon(item.unit_head_status)}
                        {item.unit_head_status}
                      </p>
                    </td>
                    <td className="custom-td">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {getStatusIcon(item.hr_status)}
                        {item.hr_status}
                      </p>
                    </td>
                    <td className="custom-td">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        -
                      </p>
                    </td>
                    <td className="custom-td">
                      <div>
                        <div>
                          <Link
                            to={`/${adminRoutes.root}/reports-details/${encodeURIComponent(item.employee_name)}`}
                          >
                            <button className="transparentButton">
                              <img
                                src={EyeIcon}
                                alt="deleteIcon"
                                className="px-3"
                              />
                            </button>
                          </Link>
                        </div>
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
        <div className="text-center mt-4">
          <img src={NoRecordFound} alt="Not Found" />
        </div>
      )}
    </div>
  )
}
