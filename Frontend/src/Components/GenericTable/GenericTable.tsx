import React, { ReactNode } from 'react'

import { Table } from 'react-bootstrap'

import SortArrow from '@project/assets/images/sortArrow.svg'
import Spinner from '@project/Common/Spinner'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'

import './GenericTable.scss'

export type ColumnDef<T> = {
  key: string
  header: string
  sortable?: boolean
  className?: string
  headerClassName?: string
  render?: (item: T, index: number) => ReactNode
}

type GenericTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  emptyState?: {
    heading: string
    description: string | ReactNode
  }
  onSort?: (columnKey: string) => void
  maxHeight?: string
  containerRef?: React.RefObject<HTMLDivElement>
  className?: string
  tableClassName?: string
  keyExtractor: (item: T, index: number) => string | number
  renderRow?: (item: T, index: number) => ReactNode
  extraHeaderStart?: ReactNode
}

function GenericTable<T>({
  columns,
  data,
  isLoading = false,
  emptyState = {
    heading: 'No Records Found',
    description: 'Currently, no data available.',
  },
  onSort,
  maxHeight,
  containerRef,
  className = '',
  tableClassName = '',
  keyExtractor,
  renderRow,
  extraHeaderStart,
}: GenericTableProps<T>) {
  const handleSortClick = (columnKey: string) => {
    if (onSort) {
      onSort(columnKey)
    }
  }

  const totalColumns = columns.length + (extraHeaderStart ? 1 : 0)

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={totalColumns} className="text-center py-5">
            <Spinner />
          </td>
        </tr>
      )
    }

    if (!data || data.length === 0) {
      return (
        <tr className="empty-state-row">
          <td colSpan={totalColumns} style={{ padding: 0, border: 'none' }}>
            <NoRecordFound
              heading={emptyState.heading}
              description={emptyState.description}
            />
          </td>
        </tr>
      )
    }

    if (renderRow) {
      return data.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderRow(item, index)}
        </React.Fragment>
      ))
    }

    return data.map((item, index) => (
      <tr key={keyExtractor(item, index)} className="custom-row">
        {columns.map((column) => (
          <td
            key={column.key}
            className={`custom-td ${column.className || ''}`}
          >
            {column.render
              ? column.render(item, index)
              : String((item as any)[column.key] || '—')}
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <TableResponsive
      maxHeight={maxHeight}
      containerRef={containerRef}
      className={className}
    >
      <Table
        className={`table custom-table ${data && data.length > 0 ? 'has-data' : ''} ${tableClassName}`}
      >
        <thead className="custom-thead">
          <tr className="custom-thead-row">
            {extraHeaderStart}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`custom-th font14 font400 ${column.headerClassName || ''}`}
              >
                {column.sortable && onSort ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="fontOnest font16">{column.header}</span>
                    <button
                      type="button"
                      className="transparentButton sortButton"
                      onClick={() => handleSortClick(column.key)}
                      aria-label={`Sort by ${column.header}`}
                    >
                      <img
                        src={SortArrow}
                        alt="sortIcon"
                        className="sortIcon"
                      />
                    </button>
                  </div>
                ) : (
                  <span className="fontOnest font16">{column.header}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </TableResponsive>
  )
}

export default GenericTable
