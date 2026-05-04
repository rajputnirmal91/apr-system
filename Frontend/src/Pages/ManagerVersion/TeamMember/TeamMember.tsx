/* eslint-disable */
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import DocumentIcon from '@project/assets/images/Document.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import MultipleUserIcon from '@project/assets/images/MultipleUser.svg'
import NoRecordFound from '@project/assets/images/NoRecordFound.svg'
import SortIcon from '@project/assets/images/Sort.svg'
import CustomPagination from '@project/Components/Pagination/Pagination'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import {
  useGetManagerCounterQuery,
  useGetTeamMemberListQuery,
} from '@project/Store/Api/Manager/managerApi'
import { formatDate } from '@project/Utils'
import useDebounce from '@project/Utils/debounce'

import './TeamMember.scss'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'

interface EmployeeEligibilityCard {
  count: number
  label: string
  icon: string
}

export default function TeamMember() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const [sort, setSort] = useState<string>('asc')
  const [sortName, setSortName] = useState<string>('employee_name')

  const { data: managerCounterData } = useGetManagerCounterQuery()

  const employeeEligibilityData: EmployeeEligibilityCard[] = [
    {
      count: managerCounterData?.total_team_member ?? 0,
      label: 'No of team members',
      icon: MultipleUserIcon,
    },
    {
      count: managerCounterData?.total_form_received ?? 0,
      label: 'Appraisal Form Received',
      icon: DocumentIcon,
    },
    {
      count: managerCounterData?.total_form_remaining ?? 0,
      label: 'Remaining Appraisal Form',
      icon: DocumentIcon,
    },
    {
      count: managerCounterData?.total_form_reviewed ?? 0,
      label: 'Reviewed Appraisal Form',
      icon: DocumentIcon,
    },
  ]

  const handleSort = (sortBy: string) => {
    const newOrder = sort === 'asc' ? 'desc' : 'asc'
    setSortName(sortBy)
    setSort(newOrder)
  }

  const navigate = useNavigate()

  const { data, isLoading, refetch } = useGetTeamMemberListQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    order_by: sort,
    sort_by: sortName,
  })

  useEffect(() => {
    refetch()
  }, [sort, sortName, debouncedSearch])

  if (isLoading) {
    return 'Loading....'
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') {
      setSearch(e)
    } else {
      setSearch(e.target.value)
    }
  }

  return (
    <div className=" managerDashboard">
      <div className="gap-3 cardMainBox">
        {employeeEligibilityData.map((employeeInfo, index) => (
          <div key={index} className="commanStyle px-3 py-3">
            <div className="d-flex gap-3">
              <div className="cardIcon">
                <img
                  src={employeeInfo.icon}
                  alt="icon"
                  className="innerIconSmall"
                />
              </div>
              <div>
                <h4 className="font32 font600 fontOnest mb-0">
                  {employeeInfo.count}
                </h4>
                <h4 className="font14 font400 fontOnest mb-0">
                  {employeeInfo.label}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TopSearch
        title="Team Members"
        showButton={false}
        onSearchChange={(value) => handleSearch(value)}
      />
      {data?.team_members && data?.team_members.length > 0 ? (
        <div className="commonTable">
          <TableResponsive maxHeight="55vh">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '7%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Employee ID</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '10%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">
                        <button
                          className="transparentButton sortButton pb-2"
                          onClick={() => handleSort('employee_name')}
                        >
                          Employee Name
                          <img src={SortIcon} alt="sortIcon" />
                        </button>
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
                        <button
                          className="transparentButton sortButton pb-2"
                          onClick={() => handleSort('employee_designation')}
                        >
                          Designation
                          <img src={SortIcon} alt="sortIcon" />
                        </button>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '15%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Form Status</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '15%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Review Status</span>
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
                {data?.team_members.map((item) => (
                  <tr className="custom-row">
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {item?.employee_lms_id}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {item.employee_name}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {item.employee_designation}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {formatDate(item.employee_form_status)}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        {formatDate(item.hr_review_status)}
                      </p>
                    </td>

                    <td className="custom-td font16 font400">
                      <p className="mb-0 font16 font400 fontOnest textDark">
                        <button
                          className="transparentButton"
                          onClick={
                            () =>
                              navigate(
                                `/srm/srmDetailsTab/${item.employee_user_id}`
                              )
                            // navigate(
                            //   '/srm/srm-dashboard/projectDetails',
                            //   {
                            //     state: {
                            //       projectId: item.project_id,
                            //       status: item.hr_review_status,
                            //     },
                            //   }
                            // )
                          }
                        >
                          <img
                            src={EyeIcon}
                            alt="deleteIcon"
                            className="pl-3"
                          />
                        </button>
                      </p>
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
