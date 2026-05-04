// /* eslint-disable prettier/prettier */

import { Pagination } from 'react-bootstrap'

import LeftArrow from '@project/assets/images/leftArrow.svg'
import RightArrow from '@project/assets/images/rightArrow.svg'

import '@project/Components/Pagination/Pagination.scss'

type CustomPaginationProps = {
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
  currentPage: number
  totalRows: number
  setCurrentPage: (currentPage: number) => void
}

function CustomPagination({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  totalRows,
  setCurrentPage,
}: CustomPaginationProps) {
  const totalPages = Math.ceil(totalRows / itemsPerPage)

  if (!totalPages) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i)
      }
      return pages
    }

    pages.push(1)

    if (currentPage > 4) {
      pages.push('...')
    }

    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i += 1
    ) {
      pages.push(i)
    }

    if (currentPage < totalPages - 3) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }

  return (
    <div className="custom-pagination d-flex align-items-center justify-content-between">
      <div className="pagination-left d-flex align-items-center">
        <span className="label font14 font400 textDark">Show per page</span>
        <div className="custom-select-wrapper">
          <select
            className="select"
            name="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value, 10)
              setItemsPerPage(newLimit)
              // Don't call setCurrentPage here - let the parent handle it via setItemsPerPage callback
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="select-arrow" aria-hidden="true">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1l5 5 5-5"
                stroke="#1F2D3D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="pagination-right d-flex align-items-center">
        <Pagination className="pagination-controls mb-0">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <img src={LeftArrow} alt="leftArrow" />
            <span className="font14 font400 fontOnest">Prev</span>
          </Pagination.Prev>

          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              // eslint-disable-next-line react/no-array-index-key
              <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
            ) : (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </Pagination.Item>
            )
          )}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <span className="font14 font400 fontOnest">Next</span>
            <img src={RightArrow} alt="leftArrow" />
          </Pagination.Next>
        </Pagination>
      </div>
    </div>
  )
}

export default CustomPagination
