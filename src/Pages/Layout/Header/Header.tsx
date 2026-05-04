/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useMemo, useRef, useState } from 'react'

import { Col, Container, Image, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import DividerLine from '@project/assets/images/DividerLine.svg'
import DownArrow from '@project/assets/images/DownArrow.svg'
import headerLefIcon from '@project/assets/images/headerLefIcon.png'
import LogoutIcon from '@project/assets/images/Logout.svg'
import DeleteWhiteIcon from '@project/assets/images/Logout-white.svg'
import pedp from '@project/assets/images/pedp.png'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useGetRolesQuery,
  useGetSessionsQuery,
} from '@project/Store/Api/Common/commonApi'
import { useGenerateTokenMutation } from '@project/Store/Api/Login/loginApi'
import { selectUserState } from '@project/Store/Feature/UserSlice'
import {
  logout,
  setUserLoginData,
} from '@project/Store/Feature/UserSlice/userSlice'
import { AppDispatch } from '@project/Store/store'
import { SessionItem } from '@project/Types/sessionTypes'
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@project/Utils/browserStorage'
import getInitials from '@project/Utils/InitialUserName'

import './Header.scss'

interface HeaderProps {
  title: string
  sidebarBtn?: () => void
  sidebar?: boolean
}

type ProfileMenuItem = {
  id: number
  label: string
  icon: string
  className?: string
  onClick: (
    navigate: (to: string) => void,
    setProfileDropdown: (value: boolean) => void,
    dispatch: AppDispatch
  ) => void
}

const profileMenuItems: ProfileMenuItem[] = [
  // {
  //   id: 1,
  //   label: 'Profile',
  //   icon: ProfileIcon,
  //   onClick: (navigate, setProfileDropdown) => {
  //     navigate(adminRoutes.profile)
  //     setProfileDropdown(false)
  //   },
  // },
  // {
  //   id: 2,
  //   label: 'Settings',
  //   icon: SettingsIcon,
  //   onClick: () => {},
  // },
  {
    id: 3,
    label: 'Logout',
    icon: LogoutIcon,
    onClick: (navigate, setProfileDropdown, dispatch) => {
      // clear storage and redux state
      removeLocalStorage('authData')
      dispatch(logout())
      navigate('/')
      setProfileDropdown(false)
    },
    className: 'textRed',
  },
]

const ROLE_DISPLAY_MAP: Record<string, string> = {
  IRM: 'IRM',
  HR: 'HR',
  UNIT_HEAD: 'Unit Head',
  SRM: 'SRM',
  EMPLOYEE: 'Employee',
  ADMIN: 'Admin',
}

function Header({ title, sidebarBtn, sidebar }: HeaderProps) {
  const dispatch = useDispatch()
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const currentUser = useSelector(selectUserState)
  // Check localStorage directly — Redux rehydration is async so the token
  // may not be in Redux yet on first render, but localStorage is always sync
  const authData = getLocalStorage<{ access_token: string }>('authData')
  const isAuthenticated = Boolean(
    authData?.access_token || currentUser?.accessToken
  )

  const { data } = useGetSessionsQuery()
  const sessionsLoaded = Boolean(data?.appraisal_sessions?.length)
  const [generateToken] = useGenerateTokenMutation()
  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery(
    undefined,
    {
      skip: !isAuthenticated || !sessionsLoaded,
    }
  )
  const [selectedYear, setSelectedYear] = useState<string>()
  const [, _setProfileDropdown] = useState<boolean>(false)
  const navigate = useNavigate()
  const [department, setDepartment] = useState<boolean>(false)
  const [roleSelection, setRoleSelection] = useState<string>(
    () => getLocalStorage<string>('userRole') || ''
  )
  const currentLocation = useLocation()
  const segments = currentLocation.pathname.split('/')
  const role = segments[1]

  const SessionRef = useRef<HTMLDivElement>(null)
  const SessionButtonRef = useRef<HTMLButtonElement>(null)

  const DepartmentRef = useRef<HTMLDivElement>(null)
  const DepartmentButtonRef = useRef<HTMLButtonElement>(null)

  const ProfileRef = useRef<HTMLDivElement>(null)
  const ProfileButtonRef = useRef<HTMLButtonElement>(null)

  const [showModal, setShowModal] = useState(false)
  const sortedSessions = useMemo(
    () =>
      [...(data?.appraisal_sessions ?? [])].sort((a, b) => {
        const left = new Date(a.session_start_date).getTime()
        const right = new Date(b.session_start_date).getTime()

        return left - right
      }),
    [data?.appraisal_sessions]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ProfileRef.current &&
        !ProfileRef.current.contains(event.target as Node) &&
        ProfileButtonRef.current &&
        !ProfileButtonRef.current.contains(event.target as Node)
      ) {
        _setProfileDropdown(false)
      }

      if (
        SessionRef.current &&
        !SessionRef.current.contains(event.target as Node) &&
        SessionButtonRef.current &&
        !SessionButtonRef.current.contains(event.target as Node)
      ) {
        setShowYearDropdown(false)
      }

      if (
        DepartmentRef.current &&
        !DepartmentRef.current.contains(event.target as Node) &&
        DepartmentButtonRef.current &&
        !DepartmentButtonRef.current.contains(event.target as Node)
      ) {
        setDepartment(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Auto-select department based on current route
  useEffect(() => {
    const roleMap: Record<string, string> = {
      irm: 'IRM',
      hr: 'HR',
      'unit-head': 'Unit Head',
      srm: 'SRM',
      employee: 'Employee',
      admin: 'Admin',
    }
    const mapped = roleMap[role]
    if (mapped) {
      setRoleSelection(mapped)
      setLocalStorage('userRole', mapped)
    }
  }, [role])

  // Year session logic
  useEffect(() => {
    if (sortedSessions.length > 0) {
      const selected =
        sortedSessions.find(
          (v) =>
            v.appraisal_session_id ===
            getLocalStorage<string>('appraiselSessionId')
        ) ||
        sortedSessions.find((v) => v.is_present_session) ||
        sortedSessions[0]
      setSelectedYear(selected.session)
      setLocalStorage('appraiselSessionId', selected.appraisal_session_id)
    }
  }, [sortedSessions])

  function handleYearSelect(item: SessionItem) {
    setSelectedYear(item.session)
    setLocalStorage('appraiselSessionId', item.appraisal_session_id)
    setShowYearDropdown(false)
    window.location.reload()
  }

  // Handle department change + navigation
  async function handleDepartmentChange(selected: string) {
    setDepartment(false)

    // Map display name back to API role key
    const roleKeyMap: Record<string, string> = {
      IRM: 'IRM',
      HR: 'HR',
      'Unit Head': 'UNIT_HEAD',
      SRM: 'SRM',
      Employee: 'USER',
      Admin: 'ADMIN',
    }

    const routeMap: Record<string, string> = {
      IRM: '/irm/irm-dashboard',
      HR: '/hr/hr-dashboard',
      'Unit Head': '/unit-head/unit-head-dashboard',
      SRM: '/srm/srm-dashboard',
      Employee: '/employee/employee-dashboard',
      Admin: '/admin/dashboard',
    }

    try {
      const newTokenData = await generateToken({
        email: currentUser.email,
        selected_role: roleKeyMap[selected] ?? selected,
      }).unwrap()

      // Update localStorage and Redux with new token/role
      setLocalStorage('authData', newTokenData)
      dispatch(setUserLoginData(newTokenData))

      setRoleSelection(selected)
      setLocalStorage('userRole', selected)

      if (routeMap[selected]) {
        navigate(routeMap[selected])
      }
    } catch {
      // error toast is handled by axiosBaseQuery showErrorMessage
    }
  }

  return (
    <header className="py-2 border-bottom shadow-sm bg-white custom-header">
      <Container fluid>
        <Row className="align-items-center">
          {/* Left Section */}
          <Col
            xs={12}
            md={3}
            lg={sidebar ? 1 : 2}
            className="d-flex align-items-center"
          >
            <Image
              src={pedp}
              alt="PEDP Logo"
              height={sidebar ? 20 : 40}
              className="me-2"
            />
            <Image
              onClick={sidebarBtn}
              className="me-3"
              src={headerLefIcon}
              alt="headerLefIcon"
              style={{ marginLeft: 'auto' }}
            />
            <div className="vr custom-vr mr-0" />
          </Col>

          {/* Right Section */}
          <Col
            xs={12}
            md={9}
            lg={sidebar ? 11 : 10}
            className="d-flex align-items-center justify-content-end gap-3"
          >
            {/* Title */}
            <span
              className="headerTitle font20 font400 fontOnest"
              style={{ marginRight: 'auto' }}
            >
              {title}
            </span>

            {/* Year Dropdown */}
            {(sortedSessions.length ?? 0) > 0 && (
              <div
                className="d-flex align-items-center text-muted fw-medium headerDropdownWrapper"
                style={{ cursor: 'pointer' }}
              >
                <button
                  ref={SessionButtonRef}
                  className="transparentButton"
                  onClick={() => setShowYearDropdown((prev) => !prev)}
                >
                  <p
                    className={`mb-0 ${selectedYear ? 'selectedSessionText' : ''}`}
                  >
                    {selectedYear}{' '}
                    <span>
                      <img src={DownArrow} alt="downArrow" className="ps-1" />
                    </span>{' '}
                  </p>
                </button>

                {showYearDropdown && (
                  <div
                    className="profileDropdown yearDropdown"
                    ref={SessionRef}
                  >
                    {sortedSessions.map((year) => {
                      const isSelected =
                        selectedYear === year.session ||
                        (!selectedYear && year.is_present_session)

                      return (
                        <div
                          key={year.session}
                          className={`profileItem ${isSelected ? 'profileItemActive' : ''}`}
                        >
                          <button
                            className="transparentButton"
                            onClick={() => handleYearSelect(year)}
                          >
                            <div className="d-flex gap-4">
                              <span
                                className={`font14 font400 fontOnest ${isSelected ? 'profileItemTextActive' : ''}`}
                              >
                                {year.session}
                              </span>
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
            <img src={DividerLine} alt="dividerLine" />

            {/* Department Dropdown — visible whenever user has multiple roles */}
            {rolesData?.roles && rolesData.roles.length > 1 && (
              <>
                <div
                  className="headerDropdownWrapper"
                  style={{ cursor: 'pointer' }}
                >
                  <button
                    ref={DepartmentButtonRef}
                    className="transparentButton"
                    onClick={() => setDepartment(!department)}
                  >
                    <p className="mb-0">
                      {roleSelection || 'Select Role'}
                      <span>
                        <img src={DownArrow} alt="downArrow" className="ps-2" />
                      </span>
                    </p>
                  </button>
                  {department && (
                    <div
                      className="profileDropdown roleDropdown"
                      ref={DepartmentRef}
                    >
                      {rolesLoading ? (
                        <div className="profileItem">
                          <span className="font14 font400 fontOnest px-3">
                            Loading...
                          </span>
                        </div>
                      ) : (
                        (rolesData?.roles ?? []).map((r) => {
                          const displayName = ROLE_DISPLAY_MAP[r] ?? r
                          return (
                            <div className="profileItem" key={r}>
                              <button
                                className="transparentButton"
                                onClick={() =>
                                  handleDepartmentChange(displayName)
                                }
                              >
                                <div className="d-flex gap-4">
                                  <span className="font14 font400 fontOnest">
                                    {displayName}
                                  </span>
                                </div>
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
                <img src={DividerLine} alt="dividerLine" />
              </>
            )}

            {/* User Name */}
            <div>
              <p className="mb-0 font16 font400 fontOnest">
                {currentUser.name}
              </p>
            </div>

            {/* Profile Dropdown */}
            <div>
              <button
                className="transparentButton d-flex"
                // onClick={handleProfileDropdown}
                ref={ProfileButtonRef}
              >
                {currentUser.profile_image_url ? (
                  <img
                    src={currentUser.profile_image_url}
                    alt="profile"
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.currentTarget.replaceWith(
                        Object.assign(document.createElement('span'), {
                          className: 'avatar-initials',
                          textContent: getInitials(currentUser.name || ''),
                        })
                      )
                    }}
                  />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(currentUser.name || '')}
                  </span>
                )}{' '}
                {/* <img src={DownArrow} alt="downArrow" className="ps-2" /> */}
              </button>
            </div>

            {/* {profileDropdown && (
              <div className="profileDropdown" ref={ProfileRef}>
                {profileMenuItems.map((item) => (
                  <div key={item.id} className="profileItem">
                    <button
                      className="transparentButton"
                      onClick={() => {
                        if (item.label === 'Logout') {
                          setShowModal(true)
                          setProfileDropdown(false)
                        } else {
                          item.onClick(navigate, setProfileDropdown, dispatch)
                        }
                      }}
                    >
                      <div className="d-flex gap-4">
                        <img src={item.icon} alt={`${item.label}Icon`} />
                        <span
                          className={`font14 font400 fontOnest ${item.className || ''}`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )} */}

            <img src={DividerLine} alt="dividerLine" />

            {/* Logout Icon */}
            <button
              className="transparentButton d-flex align-items-center gap-2"
              onClick={() => setShowModal(true)}
              style={{ padding: '0 8px' }}
            >
              <img
                src={LogoutIcon}
                alt="Logout"
                style={{ width: 20, height: 20 }}
              />
              <span className="font14 font400 fontOnest">Logout</span>
            </button>
          </Col>
        </Row>

        <CustomModal
          show={showModal}
          onClose={() => {
            setShowModal(false)
          }}
          image={DeleteWhiteIcon}
          onConfirm={() => {
            profileMenuItems[0].onClick(navigate, _setProfileDropdown, dispatch)
          }}
          type="Warning"
          modalHeading="Are you sure you want to logout?"
          modalDesc="You will be logged out of the application. Do you want to proceed?"
          mode="confirm"
        />
      </Container>
    </header>
  )
}

export default Header
