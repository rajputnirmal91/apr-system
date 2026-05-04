import { useEffect, useState } from 'react'

import { Card, Container } from 'react-bootstrap'

import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import StatusLegend, {
  LegendGroup,
} from '@project/Components/StatusLegend/StatusLegend'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'

import './CommonDashboard.scss'

// ------------------ TYPES ------------------

export interface SummaryCard {
  label: string
  value: number | string
  icon?: string
}

export interface DropdownOption {
  label: string
  value: string | number
}

export interface DropdownFilter {
  id: string
  options: DropdownOption[]
  placeholder?: string
  value?: string | number
  onChange?: (e: { target: { value: string | number } }) => void
  filter?: boolean // Enable search inside dropdown
  filterPlaceholder?: string // Placeholder for search input
  showClear?: boolean // Show clear button
}

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  showSortIcon?: boolean
}

export interface CommonDashboardProps<T extends Record<string, unknown>> {
  title?: string
  summaryCards?: SummaryCard[]
  dropdowns?: DropdownFilter[]
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (val: string) => void
  tableColumns: TableColumn<T>[]
  tableData: T[]
  enablePagination?: boolean
  defaultItemsPerPage?: number
  onViewDetails?: (row: T) => void
  isTableLoading?: boolean
  showSortIcon?: boolean

  /* -------- NO RECORD FOUND (OPTIONAL) -------- */
  noRecordHeading?: string
  noRecordDescription?: string

  /* -------- SERVER PAGINATION (OPTIONAL & SAFE) -------- */
  useServerPagination?: boolean
  page?: number
  limit?: number
  totalRecords?: number
  onPageChange?: (page: number, limit: number) => void

  /* -------- SERVER SORT (OPTIONAL) -------- */
  onSort?: (key: string, direction: 'asc' | 'desc') => void

  /* -------- LEGEND (OPTIONAL) -------- */
  legendContent?: LegendGroup[]
}

// ------------------ COMPONENT ------------------

function CommonDashboard<T extends Record<string, unknown>>({
  title = '',
  summaryCards = [],
  dropdowns = [],
  showSearch = true,
  searchValue = '',
  onSearchChange,
  tableColumns,
  tableData,
  enablePagination = true,
  defaultItemsPerPage = 5,
  isTableLoading = false,
  noRecordHeading = 'No Data Found',
  noRecordDescription = 'Currently, no data available.',
  useServerPagination = false,
  page,
  limit,
  totalRecords,
  onPageChange,
  onSort,
  legendContent,
}: CommonDashboardProps<T>) {
  /* -------- LOCAL STATE (USED ONLY FOR CLIENT PAGINATION) -------- */
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  /* -------- SORT STATE -------- */
  const [sortedData, setSortedData] = useState<T[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string
    direction: 'asc' | 'desc' | null
  }>({ key: '', direction: null })

  /* -------- SORT HANDLER -------- */
  const handleSort = (key: keyof T | string) => {
    let direction: 'asc' | 'desc' = 'asc'

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })

    if (onSort) {
      onSort(String(key), direction)
    }
  }

  /* -------- SORT EFFECT -------- */
  useEffect(() => {
    // SERVER PAGINATION → data already sorted & paginated by backend
    if (useServerPagination) {
      setSortedData(tableData)
      return
    }

    // CLIENT SORTING
    const data = [...tableData]

    setSortedData(data)
  }, [tableData, sortConfig, useServerPagination])

  /* -------- PAGINATION VALUES -------- */
  const activePage = useServerPagination ? (page ?? 1) : currentPage
  const activeLimit = useServerPagination
    ? (limit ?? itemsPerPage)
    : itemsPerPage

  const displayData = useServerPagination
    ? sortedData
    : sortedData.slice((activePage - 1) * activeLimit, activePage * activeLimit)

  // Loading state for table (if data is being fetched)
  const isLoading = isTableLoading

  /* ================= RENDER ================= */

  return (
    <div className="h-100 common-dashboard-container">
      <Container fluid className="common-dashboard">
        {/* ================= SUMMARY CARDS ================= */}
        {summaryCards.length > 0 && (
          <div className="common-dashboardCard mb-1">
            {summaryCards.map((card) => (
              <Card
                key={card.label}
                className="text-center shadow-sm summary-card h-100"
                style={{
                  minHeight: '117px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  boxShadow: 'none',
                }}
              >
                <Card.Body>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: '18px', height: '100%' }}
                  >
                    {card.icon && (
                      <div className="iconWrapper d-flex justify-content-center align-items-center">
                        <img src={card.icon} alt={card.label} />
                      </div>
                    )}
                    <div className="d-flex flex-column align-items-start">
                      <h4 className="mb-0 font40" style={{ fontWeight: 600 }}>
                        {card.value}
                      </h4>
                      <p className="mb-0 font14 text-start">{card.label}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* ================= SEARCH + FILTER ================= */}
        <TopSearch
          title={title}
          dropdowns={dropdowns}
          showSearch={showSearch}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          showButton={false}
        />

        {/* ================= TABLE ================= */}
        <div className="commonTable">
          {legendContent && <StatusLegend groups={legendContent} />}
          <GenericTable<T>
            columns={tableColumns.map(
              (col): ColumnDef<T> => ({
                key: String(col.key),
                header: col.label,
                sortable: col.sortable,
                render: col.render ? (row) => col.render!(row) : undefined,
              })
            )}
            data={displayData}
            isLoading={isLoading}
            keyExtractor={(row) =>
              String(
                (row as any).id ?? (row as any).employee_id ?? Math.random()
              )
            }
            onSort={(key) => handleSort(key as keyof T)}
            emptyState={{
              heading: noRecordHeading,
              description: noRecordDescription,
            }}
          />
        </div>
        {/* ================= PAGINATION ================= */}
        {enablePagination && (
          <CustomPagination
            itemsPerPage={activeLimit}
            setItemsPerPage={(val) => {
              if (useServerPagination) {
                onPageChange?.(1, val)
              } else {
                setItemsPerPage(val)
              }
            }}
            totalRows={
              useServerPagination ? (totalRecords ?? 0) : sortedData.length
            }
            currentPage={activePage}
            setCurrentPage={(val) => {
              if (useServerPagination) {
                onPageChange?.(val, activeLimit)
              } else {
                setCurrentPage(val)
              }
            }}
          />
        )}
      </Container>
    </div>
  )
}

export default CommonDashboard
