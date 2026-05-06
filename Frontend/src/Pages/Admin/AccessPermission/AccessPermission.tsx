import { useEffect, useRef, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'

import Danger from '@project/assets/images/Danger.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import GenericTable from '@project/Components/GenericTable/GenericTable'
import CustomModal from '@project/Components/Modal/Modal'
import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useAddRoleMasterMutation,
  useGetRoleMasterListQuery,
  useUpdateRoleMasterMutation,
} from '@project/Store/Api/Admin/AccessPermission'
import type { RoleMasterListItem } from '@project/Types/AccessPermissionType'
import {
  ACCESS_PERMISSION_ROLE_KEYS,
  ACCESS_PERMISSION_ROLE_OPTIONS,
  type AccessPermissionPermissions,
  type AccessPermissionRoleKey,
  createInitialPermissions,
  createPermissionsFromRoles,
  createRolesFromPermissions,
} from '@project/Utils/AccessPermissionConstants'
import useDebounce from '@project/Utils/debounce'
import { showErrorToast } from '@project/Utils/notificationPopup'

import '@project/Pages/Admin/AccessPermission/AccessPermission.scss'

function AccessPermission() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  // const { data } = useGetRoleMasterListQuery({
  //   page: currentPage,
  //   limit: itemsPerPage,
  //   search: debouncedSearch || null,
  //   order_by: 'asc',
  //   sort_by: 'name',
  // })
  const [addRoleMaster, { isLoading: isSaving }] = useAddRoleMasterMutation()
  const [updateRoleMaster, { isLoading: isUpdating }] =
    useUpdateRoleMasterMutation()

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [selectedEmployeeSnapshot, setSelectedEmployeeSnapshot] =
    useState<RoleMasterListItem | null>(null)
  const [permissions, setPermissions] = useState<AccessPermissionPermissions>(
    createInitialPermissions()
  )
  const [baselinePermissions, setBaselinePermissions] =
    useState<AccessPermissionPermissions>(createInitialPermissions())
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false)
  const [pendingEmployeeSelection, setPendingEmployeeSelection] = useState<
    string | null
  >(null)
  const permissionsCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setCurrentPage(1)
    setSelectedEmployee(null)
    setSelectedEmployeeSnapshot(null)
    setPermissions(createInitialPermissions())
    setBaselinePermissions(createInitialPermissions())
    setShowUnsavedModal(false)
    setPendingEmployeeSelection(null)
  }, [debouncedSearch])

  const employees =
    (
      data as
        | { users?: RoleMasterListItem[]; data?: RoleMasterListItem[] }
        | undefined
    )?.users ??
    data?.data ??
    []

  const filteredEmployees = employees.filter(
    (emp: RoleMasterListItem) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      (emp.designation_title || '').toLowerCase().includes(search.toLowerCase())
  )

  const hasUnsavedChanges = ACCESS_PERMISSION_ROLE_KEYS.some(
    (roleKey) => permissions[roleKey] !== baselinePermissions[roleKey]
  )

  const applyEmployeeSelection = (employeeId: string) => {
    setSelectedEmployee(employeeId)
    const employee = employees.find(
      (emp: RoleMasterListItem) => emp.user_id === employeeId
    )
    setSelectedEmployeeSnapshot(employee || null)
    const mappedPermissions = createPermissionsFromRoles(employee?.roles || [])
    setPermissions(mappedPermissions)
    setBaselinePermissions(mappedPermissions)
  }

  const resetPermissionPanel = () => {
    setSelectedEmployee(null)
    setSelectedEmployeeSnapshot(null)
    setPermissions(createInitialPermissions())
    setBaselinePermissions(createInitialPermissions())
    setShowUnsavedModal(false)
    setPendingEmployeeSelection(null)
  }

  useEffect(() => {
    if (!selectedEmployee || !hasUnsavedChanges || showUnsavedModal) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        permissionsCardRef.current &&
        !permissionsCardRef.current.contains(event.target as Node)
      ) {
        setPendingEmployeeSelection(null)
        setShowUnsavedModal(true)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    // eslint-disable-next-line consistent-return
    // return () => {
    //   document.removeEventListener('mousedown', handleOutsideClick)
    // }
  }, [selectedEmployee,showUnsavedModal,showUnsavedModal,hasUnsavedChanges,showUnsavedModal])

  const handleEmployeeSelect = (employeeId: string) => {
    if (hasUnsavedChanges && employeeId !== selectedEmployee) {
      setPendingEmployeeSelection(employeeId)
      setShowUnsavedModal(true)
      return
    }

    applyEmployeeSelection(employeeId)
  }

  const handleCheckboxChange = (role: AccessPermissionRoleKey) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: !prev[role],
    }))
  }

  const selectedEmployeeDataFromPage = employees.find(
    (emp: RoleMasterListItem) => emp.user_id === selectedEmployee
  )
  const selectedEmployeeData =
    selectedEmployeeDataFromPage || selectedEmployeeSnapshot

  const handleSaveOrUpdate = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee')
      return
    }

    if (!selectedEmployeeData) {
      alert('Selected employee data not found')
      return
    }

    if (!hasUnsavedChanges) {
      showErrorToast('Please select or modify at least one permission.')
      return
    }

    const selectedRoles = createRolesFromPermissions(
      permissions,
      selectedEmployeeData.roles
    )
    const canUpdatePermission = Boolean(selectedEmployeeData.id)

    try {
      const payload = {
        users: [
          {
            ...selectedEmployeeData,
            roles: selectedRoles,
          },
        ],
      }

      if (canUpdatePermission) {
        await updateRoleMaster(payload).unwrap()
      } else {
        await addRoleMaster(payload).unwrap()
      }

      const updatedPermissions = createPermissionsFromRoles(selectedRoles)
      setPermissions(updatedPermissions)
      setBaselinePermissions(updatedPermissions)

      // Reset the permission box after successful save/update.
      setSelectedEmployee(null)
      setSelectedEmployeeSnapshot(null)
      setPermissions(createInitialPermissions())
      setBaselinePermissions(createInitialPermissions())
    } catch (error) {
      console.error('Failed to save/update role permissions', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    resetPermissionPanel()
  }

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <Container fluid className="access-permission-container p-0">
      <TopSearch
        title="Access Permission"
        searchPlaceholder="Search"
        showButton={false}
        searchValue={search}
        onSearchChange={(value) => handleSearch(value)}
      />

      <Row className="access-permission-content mx-0">
        {/* Left Section - Employee Table */}
        <Col md={7} className="px-0 pe-md-2">
          <div className="commonTable">
            <GenericTable<RoleMasterListItem>
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'designation_title', header: 'Designation' },
              ]}
              data={filteredEmployees}
              keyExtractor={(emp) => emp.user_id}
              emptyState={{
                heading: 'No employees found',
                description: 'Currently, no employees are available.',
              }}
              renderRow={(employee) => (
                <tr
                  key={employee.user_id}
                  className={`custom-row ${selectedEmployee === employee.user_id ? 'selected-row' : ''}`}
                  onClick={() => handleEmployeeSelect(employee.user_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="custom-td">{employee.name}</td>
                  <td className="custom-td">{employee.email}</td>
                  <td className="custom-td">
                    {employee.designation_title || '-'}
                  </td>
                </tr>
              )}
            />
            {filteredEmployees.length > 0 && (
              <CustomPagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                totalRows={data?.total_count || 0}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </Col>

        {/* Right Section - Role Permissions */}
        <Col md={5} className="px-0 ps-md-2">
          <div ref={permissionsCardRef} className="permissions-card">
            {selectedEmployee ? (
              <>
                {selectedEmployeeData && (
                  <div className="selected-employee-info mb-4">
                    <p className="font14 font500 fontOnest textDark mb-1">
                      Selected Employee:{' '}
                      <strong>{selectedEmployeeData.name}</strong>
                    </p>
                    <p className="font12 font400 fontOnest textGray mb-0">
                      {selectedEmployeeData.email} |{' '}
                      {selectedEmployeeData.designation_title || '-'}
                    </p>
                  </div>
                )}

                <div className="permissions-checkboxes">
                  <div className="checkbox-wrapper">
                    {ACCESS_PERMISSION_ROLE_OPTIONS.map((role) => (
                      <div key={role.key} className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={permissions[role.key]}
                            onChange={() => handleCheckboxChange(role.key)}
                            className="permission-checkbox"
                          />
                          <span className="font14 font400 fontOnest textDark">
                            {role.label}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="save-button-wrapper mt-4">
                    <SharedButton
                      label="Update"
                      onClick={handleSaveOrUpdate}
                      disabled={isSaving || isUpdating || !hasUnsavedChanges}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p className="font14 font400 fontOnest textGray text-center">
                  {filteredEmployees.length > 0
                    ? 'Please select an employee from the table to assign permissions.'
                    : 'No employees found to assign permission.'}
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <CustomModal
        show={showUnsavedModal}
        onClose={() => {
          setShowUnsavedModal(false)
          setPendingEmployeeSelection(null)
        }}
        onConfirm={() => {
          if (pendingEmployeeSelection) {
            applyEmployeeSelection(pendingEmployeeSelection)
            setPendingEmployeeSelection(null)
          } else {
            setPermissions(baselinePermissions)
          }
          setShowUnsavedModal(false)
        }}
        image={Danger}
        type="Alert"
        modalHeading="Unsaved Changes"
        modalDesc="If you continue, your unsaved role changes will be lost."
        mode="confirm"
      />
    </Container>
  )
}

export default AccessPermission
