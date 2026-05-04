import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import closeBlackIcon from '@project/assets/images/closeBlackIcon.svg'
import Spinner from '@project/Common/Spinner'
import SharedButton from '@project/Components/Button/SharedButton'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import { useGetDesignationQuery } from '@project/Store/Api/Common/commonApi'
import {
  useGetEmailLogByIdQuery,
  useGetHrEmployeesQuery,
} from '@project/Store/Api/Hr/HrEmailTemplateApi'
import useDebounce from '@project/Utils/debounce'

import { MockUser } from '../emailTemplate.mock'
import { useEmailTemplate } from '../EmailTemplateContext'

function StepUserSelect() {
  const { selectedUsers, setSelectedUsers, setStep, isRestoring, draftId } =
    useEmailTemplate()

  const [search, setSearch] = useState('')
  const [selectedDesignation, setSelectedDesignation] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const debouncedSearch = useDebounce(search, 500)
  const debouncedDesignation = useDebounce(selectedDesignation, 500)
  const selectAllRef = useRef<HTMLInputElement>(null)
  // Tracks whether we've already pre-selected draft recipients — avoids re-running
  const recipientsResolvedRef = useRef(false)

  // Fetch draft log directly here — RTK Query returns cached result instantly
  // (already fetched in context on step 1), so no extra network call
  const { data: draftLog } = useGetEmailLogByIdQuery(
    { id: draftId! },
    { skip: !draftId }
  )

  const { data: designationData } = useGetDesignationQuery() as {
    data?: {
      designations: { designation_id: string; designation_title: string }[]
    }
  }

  const { data, isLoading, isError } = useGetHrEmployeesQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      order_by: 'asc',
      search: debouncedSearch || null,
      sort_by: 'employee_name',
      ...(debouncedDesignation && debouncedDesignation !== 'all'
        ? { filter_by: debouncedDesignation }
        : {}),
    },
    { refetchOnMountOrArgChange: true }
  )

  const pageUsers: MockUser[] = useMemo(
    () =>
      (data?.employees ?? []).map((e) => ({
        id: e.employee_user_id,
        name: e.employee_name,
        employeeId: e.employee_lms_id,
        designation: e.employee_designation,
        email: e.employee_email,
      })),
    [data]
  )

  const totalRows = data?.total_count ?? 0

  // Pre-select recipients from draft — runs once when draftLog is ready
  useEffect(() => {
    if (recipientsResolvedRef.current) return
    if (!draftId) return
    if (!draftLog?.recipient?.length) return

    setSelectedUsers(draftLog.recipient)
    recipientsResolvedRef.current = true
  }, [draftId, draftLog, setSelectedUsers])

  // selectedUsers is a string[] of emails — normalise for comparison

  // Extract username part before '@' for cross-domain matching
  // Draft stores @yopmail.com but employee API returns @lmsin.co — same username, different domain
  const emailUsername = (email: string | undefined) =>
    (email ?? '').split('@')[0].toLowerCase().trim()

  // Build a set of usernames from selectedUsers for matching
  const selectedUsernameSet = useMemo(
    () => new Set(selectedUsers.map((u) => emailUsername(u))),
    [selectedUsers]
  )

  const isAllPageSelected =
    pageUsers.length > 0 &&
    pageUsers.every((u) => selectedUsernameSet.has(emailUsername(u.email)))

  const isIndeterminate =
    pageUsers.some((u) => selectedUsernameSet.has(emailUsername(u.email))) &&
    !isAllPageSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  const handleSelectAll = useCallback(() => {
    if (isAllPageSelected) {
      const pageUsernames = new Set(
        pageUsers.map((p) => emailUsername(p.email))
      )
      setSelectedUsers(
        selectedUsers.filter((u) => !pageUsernames.has(emailUsername(u)))
      )
    } else {
      const newEmails = pageUsers
        .filter((u) => !selectedUsernameSet.has(emailUsername(u.email)))
        .map((u) => u.email ?? '')
        .filter(Boolean)
      setSelectedUsers([...selectedUsers, ...newEmails])
    }
  }, [
    isAllPageSelected,
    pageUsers,
    selectedUsers,
    selectedUsernameSet,
    setSelectedUsers,
  ])

  const handleToggleUser = useCallback(
    (user: MockUser) => {
      const username = emailUsername(user.email)
      if (selectedUsernameSet.has(username)) {
        setSelectedUsers(
          selectedUsers.filter((u) => emailUsername(u) !== username)
        )
      } else if (user.email) {
        setSelectedUsers([...selectedUsers, user.email])
      }
    },
    [selectedUsernameSet, selectedUsers, setSelectedUsers]
  )

  const handleRemoveUser = useCallback(
    (userEmail: string) =>
      setSelectedUsers(selectedUsers.filter((u) => u !== userEmail)),
    [selectedUsers, setSelectedUsers]
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const columns: ColumnDef<MockUser>[] = useMemo(
    () => [
      {
        key: 'employeeId',
        header: 'Emp ID',
        headerClassName: 'th-empid',
        className: 'td-empid',
      },
      {
        key: 'name',
        header: 'Name',
        headerClassName: 'th-name',
        className: 'td-name',
      },
      {
        key: 'designation',
        header: 'Designation',
        headerClassName: 'th-designation',
        className: 'td-designation',
      },
      {
        key: 'email',
        header: 'Email',
        headerClassName: 'th-designation',
        className: 'td-designation',
      },
    ],
    []
  )

  const dropdowns = useMemo(
    () => [
      {
        id: 'designation',
        placeholder: 'Select Designation',
        options: [
          { label: 'All Designations', value: 'all' },
          ...(designationData?.designations?.map((d) => ({
            label: d.designation_title,
            value: d.designation_id,
          })) ?? []),
        ],
        value: selectedDesignation,
        onChange: (e: { target: { value: string | number } }) => {
          setSelectedDesignation(String(e.target.value))
          setCurrentPage(1)
        },
        filter: true,
        filterPlaceholder: 'Search designations',
        showClear: true,
      },
    ],
    [designationData, selectedDesignation]
  )

  if (isRestoring) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="et-step-container">
      <Row className="align-items-center">
        <Col xs={12}>
          <TopSearch
            title="Employee List"
            showButton={false}
            searchPlaceholder="Search by name or ID"
            searchValue={search}
            onSearchChange={handleSearchChange}
            dropdowns={dropdowns}
          />
        </Col>
      </Row>

      <Row className="g-3 et-user-select-body">
        {/* Left: Employee list — server-side paginated */}
        <Col xs={12} md={8}>
          <div className="et-user-list-panel">
            {isError ? (
              <div
                className="text-center py-5 font14 fontOnest"
                style={{ color: 'var(--danger)' }}
              >
                Failed to load employees. Please try again.
              </div>
            ) : (
              <>
                <GenericTable<MockUser>
                  columns={columns}
                  data={pageUsers}
                  isLoading={isLoading}
                  keyExtractor={(user) => user.id ?? ''}
                  tableClassName="et-user-table"
                  emptyState={{
                    heading: 'No Employees Found',
                    description: 'Try adjusting your search or filter.',
                  }}
                  extraHeaderStart={
                    <th className="custom-th th-check">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={isAllPageSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all on this page"
                      />
                    </th>
                  }
                  renderRow={(user) => (
                    <tr key={user.id} className="custom-row">
                      <td className="custom-td td-check">
                        <input
                          type="checkbox"
                          checked={selectedUsernameSet.has(
                            emailUsername(user?.email)
                          )}
                          onChange={() => handleToggleUser(user)}
                          aria-label={`Select ${user.name}`}
                        />
                      </td>
                      <td className="custom-td td-empid">
                        <p className="mb-0 font14 font400 fontOnest textDark">
                          {user.employeeId}
                        </p>
                      </td>
                      <td className="custom-td td-name">
                        <p className="mb-0 font14 font400 fontOnest textDark">
                          {user.name}
                        </p>
                      </td>
                      <td className="custom-td td-designation">
                        <p className="mb-0 font14 font400 fontOnest textDark">
                          {user.designation}
                        </p>
                      </td>
                      <td className="custom-td td-designation">
                        <p className="mb-0 font14 font400 fontOnest textDark">
                          {user.email}
                        </p>
                      </td>
                    </tr>
                  )}
                />

                {pageUsers.length > 0 && (
                  <CustomPagination
                    totalRows={totalRows}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={(val) => {
                      setItemsPerPage(val)
                      setCurrentPage(1)
                    }}
                  />
                )}
              </>
            )}
          </div>
        </Col>

        {/* Right: Selected users */}
        <Col xs={12} md={4} className="p-0">
          {selectedUsers.length === 0 ? (
            <div className="et-panel-card h-100 d-flex align-items-center justify-content-center">
              <NoRecordFound
                heading="No Recipients Selected"
                description="Please select users to add them to the recipient list."
              />
            </div>
          ) : (
            <div className="et-panel-card et-selected-panel">
              <h6 className="et-panel-title font16 font600 fontOnest textDark">
                Selected Recipients
                <span className="et-selected-count font14 ms-2">
                  ({selectedUsers.length})
                </span>
              </h6>

              <ul className="et-selected-list">
                {selectedUsers.map((user, index) => (
                  <li key={`${user}-${index}`} className="et-selected-item">
                    <div className="et-selected-info">
                      <span className="et-selected-name font14 font500 fontOnest textDark">
                        {user}
                      </span>
                    </div>
                    <button
                      className="et-remove-btn"
                      onClick={() => handleRemoveUser(user)}
                      aria-label={`Remove ${user}`}
                      type="button"
                    >
                      <img src={closeBlackIcon} alt="remove" width={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>

      <div className="et-step-footer">
        <SharedButton
          label="Back"
          variant="outline"
          onClick={() => setStep(1)}
        />
        <SharedButton
          label="Next"
          variant="primary"
          onClick={() => setStep(3)}
          disabled={selectedUsers.length === 0}
        />
      </div>
    </div>
  )
}

export default StepUserSelect
