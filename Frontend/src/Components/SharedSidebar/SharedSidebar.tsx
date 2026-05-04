import { useEffect, useState } from 'react'

import { FaBars, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import DownArrow from '@project/assets/images/DownArrow.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import { GoalsAlertModal } from '@project/Components/Modal/GoalsAlertModal/GoalsAlertModal'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { selectUserState } from '@project/Store/Feature/UserSlice'
import { RootState } from '@project/Store/store'

import { MenuItem, roleMenuConfig } from './sidebarConfig'

import '@project/Pages/Layout/Layout.scss'
import '@project/Pages/Layout/AdminLayout/AdminLayout.scss'

type SharedSidebarProps = {
  sidebar: boolean
}

export default function SharedSidebar({ sidebar }: SharedSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [pendingTab, setPendingTab] = useState<string | null>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user_role } = useSelector(selectUserState)
  const hasUnsavedChanges = useSelector(
    (state: RootState) => state.unsavedChangesGoalsSlice.hasUnsavedChanges
  )

  const menuItems: MenuItem[] = roleMenuConfig[user_role] ?? []

  const handleNavClick = () => {
    setIsOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSubMenu = (label: string) => {
    setOpenMenu((prev) => {
      const next = prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [label]
      localStorage.setItem('sidebarOpenMenu', JSON.stringify(next))
      return next
    })
  }

  const matchesChild = (child: { path: string; relatedPaths?: string[] }) =>
    location.pathname.endsWith(`/${child.path}`) ||
    location.pathname.includes(`/${child.path}/`) ||
    location.pathname.includes(`/${child.path.split('/')[0]}/`) ||
    child.relatedPaths?.some((rp) => location.pathname.includes(`/${rp}`)) ||
    // absolute path match (HR routes use full paths like /hr/...)
    location.pathname === child.path ||
    location.pathname.startsWith(`${child.path}/`)

  useEffect(() => {
    const activeParent = menuItems.find((item) =>
      item.children?.some(matchesChild)
    )

    if (activeParent) {
      setOpenMenu([activeParent.label])
      localStorage.setItem(
        'sidebarOpenMenu',
        JSON.stringify([activeParent.label])
      )
    } else {
      setOpenMenu([])
      localStorage.setItem('sidebarOpenMenu', JSON.stringify([]))
    }
  }, [location.pathname, user_role])

  const handleProtectedNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingTab(path)
      setShowModal(true)
      return
    }
    navigate(path)
    handleNavClick()
  }

  return (
    <>
      <button
        className="sidebar-toggle d-md-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar px-2 ${isOpen ? 'open' : ''}`}>
        <ul className="nav flex-column gap-2 adminList mt-4">
          {menuItems.map((item) => {
            const hasChildren = !!item.children

            const isParentActive =
              (item.path
                ? location.pathname.endsWith(`/${item.path}`) ||
                  location.pathname === item.path
                : false) || item.children?.some(matchesChild)

            const isOpenCurrent =
              openMenu.includes(item.label) || item.children?.some(matchesChild)

            return (
              <li key={item.label}>
                {hasChildren ? (
                  <div
                    className={isOpenCurrent ? 'sidebar-dropdown-open' : ''}
                  >
                    <button
                      className={`sidebarHeight nav-link d-flex align-items-center w-100 sidebar-btn px-3 ${
                        isParentActive ? 'active sidebar-parent-active' : ''
                      }`}
                      onClick={() => toggleSubMenu(item.label)}
                      type="button"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <img
                        src={
                          isParentActive ? item.activeIcon : item.inactiveIcon
                        }
                        className="sidebar-icon me-2"
                        alt=""
                      />

                      {!sidebar && (
                        <span className="sidebar-label font14 fontOnest activeHeading">
                          {item.label}
                        </span>
                      )}

                      <span
                        className={`submenu-arrow ms-auto ${isOpenCurrent ? 'open' : ''}`}
                      >
                        <img
                          src={isOpenCurrent ? TopArrow : DownArrow}
                          alt=""
                        />
                      </span>
                    </button>

                    {isOpenCurrent && (
                      <ul className="nav flex-column subMenuList mx-2">
                        {item.children!.map((sub) => (
                          <li key={sub.path} className="mb-2">
                            <NavLink
                              to={sub.path}
                              onClick={(e) => {
                                e.preventDefault()
                                handleProtectedNavigation(sub.path)
                              }}
                              className={({ isActive }) => {
                                const isRelated = sub.relatedPaths?.some(
                                  (rp) => location.pathname.includes(`/${rp}`)
                                )
                                return `sidebar-btn d-flex align-items-center w-100 px-3 py-2 rounded ${
                                  isActive || isRelated
                                    ? 'active-nav'
                                    : 'inactive-nav'
                                }`
                              }}
                              style={{ textDecoration: 'none' }}
                            >
                              {({ isActive }) => {
                                const isRelated = sub.relatedPaths?.some(
                                  (rp) => location.pathname.includes(`/${rp}`)
                                )
                                return (
                                  <>
                                    <img
                                      src={
                                        isActive || isRelated
                                          ? sub.activeIcon
                                          : sub.inactiveIcon
                                      }
                                      className="sidebar-icon me-2"
                                      alt=""
                                    />
                                    {!sidebar && (
                                      <span className="font14 fontOnest">
                                        {sub.label}
                                      </span>
                                    )}
                                  </>
                                )
                              }}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path!}
                    onClick={(e) => {
                      e.preventDefault()
                      handleProtectedNavigation(item.path!)
                    }}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    className={({ isActive }) =>
                      `sidebar-btn d-flex align-items-center w-100 px-3 py-2 rounded ${
                        isActive ? 'active-nav' : 'inactive-nav'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <img
                          src={isActive ? item.activeIcon : item.inactiveIcon}
                          className="me-2 sidebar-icon"
                          alt=""
                        />
                        {!sidebar && (
                          <span className="sidebar-label font14 fontOnest">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            )
          })}
        </ul>

        {hasUnsavedChanges && (
          <GoalsAlertModal
            show={showModal}
            onConfirm={() => {
              dispatch(setUnsavedChanges(false))
              if (pendingTab) {
                navigate(pendingTab)
                handleNavClick()
              }
              setShowModal(false)
              setPendingTab(null)
            }}
            onCancel={() => {
              setShowModal(false)
              setPendingTab(null)
            }}
          />
        )}
      </div>
    </>
  )
}
