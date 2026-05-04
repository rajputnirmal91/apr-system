import { Link, useNavigate } from 'react-router-dom'

import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import ArrowRight from '@project/assets/images/ArrowRightBreadCrumb.svg'

import '@project/Components/BreadCrumb/BreadCrumb.scss'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  const navigate = useNavigate()

  const getPath = (path?: string) => {
    if (!path) return ''
    return path.startsWith('/') ? path : `/${path}`
  }

  return (
    <div className="flex flex-col gap-2 mb-3">
      <button
        onClick={() => navigate(-1)}
        className="transparentButton mb-3 d-flex align-items-center"
      >
        <img src={ArrowLeft} alt="Back" className="me-2" />
        <span className="font14 font400 fontOnest">Back</span>
      </button>

      <nav className="d-flex align-items-center text-sm">
        {items.map((item) => {
          const isLast = item === items[items.length - 1]
          const to = getPath(item.path)
          const key = `${item.label}-${to}`

          return (
            <span key={key} className="d-flex align-items-center">
              {!isLast && item.path ? (
                <Link
                  to={to}
                  className="link font14 font400 fontOnest capitalize"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font14 font400 fontOnest capitalize">
                  {item.label}
                </span>
              )}
              {!isLast && <img src={ArrowRight} alt=">" className="mx-2" />}
            </span>
          )
        })}
      </nav>
    </div>
  )
}
