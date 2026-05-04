import { useState } from 'react'

import { Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import Document from '@project/assets/images/Document.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import NoRecordFound from '@project/assets/images/NoRecordFound.svg'
import SortIcon from '@project/assets/images/Sort.svg'
import MultipleUser from '@project/assets/images/User1.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import Card from '@project/Components/Card/CardWithIcon/Card'
import CustomPagination from '@project/Components/Pagination/Pagination'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useGetManagementEmpListQuery,
  useManagementDashboardCounterQuery,
} from '@project/Store/Api/Management/managementApi'
import useDebounce from '@project/Utils/debounce'

import './ReviewRating.scss'

interface PedpItem {
  count: string
  label: string
  icon: string
}

function ReviewRatings() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showDetailsPage] = useState(false)
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */

  // const [sortBy, setSortBy] = useState('employee_name')
  // /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */

  // const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const debouncedSearch = useDebounce(search, 500)

  // Api calls
  const { data: getCounterData } = useManagementDashboardCounterQuery({
    refetchOnMountOrArgChange: true,
  })

  const { data } = useGetManagementEmpListQuery(
    {
      page,
      limit,
      search: debouncedSearch,
      order_by: 'asc',
      sort_by: 'employee_name',
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const list = data?.team_members ?? []
  const totalRecords = data?.total_count ?? 0

  const PedpData: PedpItem[] = [
    {
      count: getCounterData?.total_employee?.toString() || '0',
      label: 'Total employee',
      icon: MultipleUser,
    },
    {
      count: getCounterData?.total_form_received?.toString() || '0',
      label: 'Appraisal form received',
      icon: Document,
    },
    {
      count: getCounterData?.total_form_reviewed?.toString() || '0',
      label: 'Reviewed Appraisal form',
      icon: Document,
    },
    {
      count: getCounterData?.total_form_remaining?.toString() || '0',
      label: 'Remaining appraisal form',
      icon: Document,
    },
  ]

  const handleViewDetails = (employee: any) => {
    navigate(`/management/review-rating-details/${employee.employee_user_id}`)
  }

  return (
    <div>
      <Row>
        {PedpData.map((employeeInfo: PedpItem) => (
          <Col lg={3} md={4} sm={6} className="my-2 my-lg-0">
            <Card
              variant="small"
              icon={employeeInfo.icon}
              heading={employeeInfo.count}
              description={employeeInfo.label}
            />
          </Col>
        ))}
      </Row>
      <TopSearch
        title="Employees"
        showButton={false}
        onSearchChange={(val) => setSearch(val)}
      />
      <div className="commonTable">
        <TableResponsive maxHeight="55vh">
          <table className="table custom-table">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '2%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">#</span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '10%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">
                      Employee ID
                      <img src={SortIcon} alt="sortIcon" />
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '10%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">
                      Eligibility name
                      <img src={SortIcon} alt="sortIcon" />
                    </span>
                  </div>
                </th>

                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '15%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">
                      Designation
                      <img src={SortIcon} alt="sortIcon" />
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '10%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">
                      Form Status
                      <img src={SortIcon} alt="sortIcon" />
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '10%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">
                      Review Status
                      <img src={SortIcon} alt="sortIcon" />
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="custom-th font14 font400"
                  style={{ verticalAlign: 'top', width: '10%' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">Action</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((employee, index) => (
                <tr className="custom-row" key={employee.employee_user_id}>
                  <td className="custom-td font16 font400">
                    <p>{index + 1}</p>
                  </td>
                  <td className="custom-td font16 font400">
                    <p>{employee.employee_lms_id}</p>
                  </td>
                  <td className="custom-td font16 font400">
                    <p>{employee.employee_name}</p>
                  </td>
                  <td className="custom-td font16 font400">
                    <p>{employee.employee_designation}</p>
                  </td>

                  <td className="custom-td font16 font400">
                    <p>
                      {getStatusIcon(employee.employee_form_status)}
                      {employee.employee_form_status}
                    </p>
                  </td>
                  <td className="custom-td font16 font400">
                    <p>
                      {getStatusIcon(employee.management_review_status)}
                      {employee.management_review_status}
                    </p>
                  </td>
                  <td>
                    <button
                      className="transparentButton"
                      // onClick={() =>
                      //   navigate(
                      //     `/${managementRoutes.root}/${managementRoutes.reviewRatingDetails}`
                      //   )
                      // }
                      onClick={() => handleViewDetails(employee)}
                    >
                      <img src={EyeIcon} alt="EyeIcon" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="custom-row" />
            </tbody>
          </table>
        </TableResponsive>
        <CustomPagination
          itemsPerPage={limit}
          setItemsPerPage={setLimit}
          totalRows={totalRecords}
          currentPage={page}
          setCurrentPage={setPage}
        />
      </div>
      {list.length === 0 && showDetailsPage === false && (
        <div className="text-center mt-5">
          <img src={NoRecordFound} alt="Not Found" />
        </div>
      )}
    </div>
  )
}

export default ReviewRatings
