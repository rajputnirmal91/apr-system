import { useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Spinner from '@project/Common/Spinner'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import { useGetEmailLogsQuery } from '@project/Store/Api/Hr/HrEmailTemplateApi'
import { HrEmailLog } from '@project/Types/Hr/HrEmailTypes'
import { truncateText } from '@project/Utils/commonFunctions'
import useDebounce from '@project/Utils/debounce'

import './EmailTemplate.scss'

const TEMPLATE_MAX_LENGTH = 50
const RECIPIENT_MAX_LENGTH = 40

function DraftEmailList() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const navigate = useNavigate()

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isFetching, isError } = useGetEmailLogsQuery(
    {
      save_as_draft: true,
      page: currentPage,
      limit: itemsPerPage,
      order_by: 'asc',
      search: debouncedSearch || null,
      sort_by: 'recipient',
    },
    { refetchOnMountOrArgChange: true }
  )

  const logs = data?.email_logs ?? []
  const totalRows = data?.total_count ?? 0

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleResumeDraft = (id: string) => {
    navigate(`/hr/email-template/new?draftId=${id}`)
  }

  const columns: ColumnDef<HrEmailLog>[] = useMemo(
    () => [
      {
        key: 'send_by',
        header: 'From',
        headerClassName: 'th-from',
        className: 'td-from',
        render: (log) => (
          <p className="mb-0 font14 font400 fontOnest textDark">
            {log.send_by || '—'}
          </p>
        ),
      },
      {
        key: 'email_template',
        header: 'Template',
        headerClassName: 'th-subject',
        className: 'td-subject',
        render: (log) => (
          <p className="mb-0 font14 font400 fontOnest textDark">
            {truncateText(log.email_template || '—', TEMPLATE_MAX_LENGTH)}
          </p>
        ),
      },
      {
        key: 'recipient',
        header: 'Recipient',
        headerClassName: 'th-to',
        className: 'td-to',
        render: (log) => (
          <p className="mb-0 font14 font400 fontOnest textDark">
            {truncateText(
              log.recipient?.length ? log.recipient.join(', ') : '—',
              RECIPIENT_MAX_LENGTH
            )}
          </p>
        ),
      },
      {
        key: 'action',
        header: 'Action',
        headerClassName: 'th-action',
        className: 'td-action',
        render: (log) => (
          <button
            type="button"
            className="et-continue-btn font14 fontOnest"
            onClick={() => handleResumeDraft(log.id)}
          >
            Resume
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className="text-center py-5 font14 fontOnest"
        style={{ color: 'var(--danger)' }}
      >
        Failed to load draft emails. Please try again.
      </div>
    )
  }

  return (
    <div className="EmailListContainer">
      <TopSearch
        title="Draft Emails"
        showButton={false}
        searchPlaceholder="Search draft emails…"
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      <div className="commonTable">
        <GenericTable
          columns={columns}
          data={logs}
          isLoading={isFetching}
          emptyState={
            search
              ? {
                  heading: 'No Results Found',
                  description: `No results found for "${search}"`,
                }
              : {
                  heading: 'No Draft Emails',
                  description: 'Emails saved as drafts will appear here.',
                }
          }
          keyExtractor={(log) => log.id}
        />

        {totalRows > 0 && (
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
      </div>
    </div>
  )
}

export default DraftEmailList
