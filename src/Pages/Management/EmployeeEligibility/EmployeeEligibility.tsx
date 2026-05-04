import { useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import PendingIcon from '@project/assets/images/AlertIcon.svg'
import CancelIcon from '@project/assets/images/Cancel.svg'
import CorrectIcon from '@project/assets/images/Correct.svg'
import CrossIcon from '@project/assets/images/Cross.svg'
import UnpublishedIcon from '@project/assets/images/crossRed.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'
import MultipleUserIcon from '@project/assets/images/MultipleUser.svg'
import NoRecordFound from '@project/assets/images/NoRecordFound.svg'
import QuestionIcon from '@project/assets/images/Question.svg'
import SaveIcon from '@project/assets/images/Save.svg'
import SearchIcon from '@project/assets/images/Search.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import Card from '@project/Components/Card/CardWithIcon/Card'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import CustomPagination from '@project/Components/Pagination/Pagination'
import TableHeading from '@project/Components/TableHeading/TableHeading'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { useGetEmployeeListingQuery } from '@project/Store/Api/Admin/EmployeeEligibility/EmployeeEligibilityApi'
import { Reports } from '@project/Types/employeeEligibility'
import useDebounce from '@project/Utils/debounce'

import '@project/Pages/Admin/EmployeeEligibility/EmployeeEligibility.scss'

interface EmployeeEligibilityCard {
  count: string
  label: string
  icon: string
}

export const EmployeeEligibilityData: EmployeeEligibilityCard[] = [
  {
    count: '250',
    label: 'Total employees',
    icon: MultipleUserIcon,
  },
  {
    count: '200',
    label: 'Eligible for appraisal',
    icon: CorrectIcon,
  },
  {
    count: '40',
    label: 'Not eligible for appraisal',
    icon: CrossIcon,
  },
  {
    count: '5',
    label: 'Unknown eligibility',
    icon: QuestionIcon,
  },
]

const EligibilityOption = [
  {
    label: 'Eligible',
    value: '0',
  },
  {
    label: 'Non Eligible',
    value: '1',
  },
]

const FormStatusOption = [
  {
    label: 'Published',
    value: '0',
  },
  {
    label: 'Unpublished',
    value: '1',
  },
]

const icons: Record<string, string> = {
  Eligible: PublishedIcon,
  'Not Eligible': UnpublishedIcon,
  Unknown: PendingIcon,
  Published: PublishedIcon,
  Unpublished: UnpublishedIcon,
  Pending: PendingIcon,
}

const getIcon = (status: string) => {
  const icon = icons[status]
  return icon ? <img src={icon} alt={`${status}Icon`} className="me-2" /> : null
}

export default function EmployeeEligibility() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const [editData, setEditData] = useState<Reports | null>(null)
  const [eligibility, setEligibility] = useState<string>('')
  const [formStatus, setFormStatus] = useState<string>('')
  const [reason, setReason] = useState<string>('')

  const { data } = useGetEmployeeListingQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleEditData = (item: Reports) => {
    setEditData(item)
  }

  const handleCancel = () => {
    setEditData(null)
  }

  return (
    <div className="">
      <Row className="">
        {EmployeeEligibilityData.map((employeeInfo) => (
          <Col lg={3} md={6} sm={12} className="my-1">
            <Card
              variant="large"
              icon={employeeInfo.icon}
              heading={employeeInfo.count}
              description={employeeInfo.label}
            />
          </Col>
        ))}
      </Row>
      <Row className="align-items-center mb-4 mt-3">
        <Col lg={9}>
          <TableHeading heading="Employee Eligibility" />
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
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '10%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Emp ID</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '10%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Employee name</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '10%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">
                        Eligibility status
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '15%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Reason</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="custom-th font14 font400"
                    style={{ verticalAlign: 'top', width: '10%' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Form status</span>
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
                {data?.reports.map((item) => (
                  <tr className="custom-row">
                    <td className="custom-td font16 font400">
                      <p
                        style={{
                          padding:
                            editData && editData.id === item.id
                              ? '10px 0px'
                              : 'unset',
                        }}
                        className="mb-0 font16 font400 fontOnest textDark"
                      >
                        {item.employee_id}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      <p
                        style={{
                          padding:
                            editData && editData.id === item.id
                              ? '10px 0px'
                              : 'unset',
                        }}
                        className="mb-0 font16 font400 fontOnest textDark"
                      >
                        {item.employee_name}
                      </p>
                    </td>
                    <td className="custom-td font16 font400">
                      {editData && editData.id === item.id ? (
                        <CustomDropdown
                          id="Employee eligibility"
                          options={EligibilityOption}
                          placeholder="Select eligibility"
                          append={document.body}
                          value={String(eligibility)}
                          onChange={(e: {
                            target: { value: string | number }
                          }) => setEligibility(String(e.target.value))}
                        />
                      ) : (
                        <p className="mb-0 font16 font400 fontOnest textDark">
                          {getIcon(item.employee_eligibility)}
                          {item.employee_eligibility}
                        </p>
                      )}
                    </td>
                    <td className="custom-td font16 font400">
                      {editData && editData.id === item.id ? (
                        <CommonInput
                          placeholder="Search something..."
                          width="100%"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      ) : (
                        <p className="mb-0 font16 font400 fontOnest textDark">
                          {item.reason}
                        </p>
                      )}
                    </td>
                    <td className="custom-td font16 font400">
                      {editData && editData.id === item.id ? (
                        <CustomDropdown
                          id="Form status"
                          options={FormStatusOption}
                          placeholder="Select status"
                          append={document.body}
                          value={String(formStatus)}
                          onChange={(e: {
                            target: { value: string | number }
                          }) => setFormStatus(String(e.target.value))}
                        />
                      ) : (
                        <p className="mb-0 font16 font400 fontOnest textDark">
                          {getIcon(item.form_status)}
                          {item.form_status}
                        </p>
                      )}
                    </td>
                    <td>
                      {editData && editData.id === item.id ? (
                        <div
                          className="d-flex gap-3"
                          style={{ padding: '10px 0px' }}
                        >
                          <button className="transparentButton">
                            <img src={SaveIcon} alt="SaveIcon" />
                          </button>
                          <button
                            className="transparentButton"
                            onClick={handleCancel}
                          >
                            <img src={CancelIcon} alt="CancelIcon" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="transparentButton"
                          onClick={() => handleEditData(item)}
                        >
                          <img src={EditIcon} alt="editIcon" />
                        </button>
                      )}
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
      {/* </Container> */}
    </div>
  )
}
