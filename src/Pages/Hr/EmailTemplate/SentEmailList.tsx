import { useMemo, useState } from 'react'

import EyeIcon from '@project/assets/images/eyeIcon.svg'
import Spinner from '@project/Common/Spinner'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useLazyGetEmailLogByIdQuery,
  useGetEmailLogsQuery,
} from '@project/Store/Api/Hr/HrEmailTemplateApi'
import {
  HrGetEmailLogByIdResponse,
  HrEmailLog,
} from '@project/Types/Hr/HrEmailTypes'
import { truncateText } from '@project/Utils/commonFunctions'
import useDebounce from '@project/Utils/debounce'

import EmailViewModal from './EmailViewModal'
import './EmailTemplate.scss'

const TEMPLATE_MAX_LENGTH = 50
const RECIPIENT_MAX_LENGTH = 40

function SentEmailList() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewLogId, setViewLogId] = useState<string | null>(null)
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null)
  const [modalData, setModalData] = useState<HrGetEmailLogByIdResponse | null>(
    null
  )

  const [fetchEmailLogById] = useLazyGetEmailLogByIdQuery()
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isFetching, isError } = useGetEmailLogsQuery(
    {
      save_as_draft: false,
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

  const handleViewClick = async (id: string) => {
    setLoadingRowId(id)
    try {
      const result = await fetchEmailLogById({ id }).unwrap()
      setModalData(result)
      setViewLogId(id)
    } finally {
      setLoadingRowId(null)
    }
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
        key: 'view',
        header: 'View',
        headerClassName: 'th-view',
        className: 'td-view',
        render: (log) => (
          <button
            className="transparentButton"
            type="button"
            aria-label={`View email from ${log.send_by}`}
            onClick={() => handleViewClick(log.id)}
            disabled={loadingRowId === log.id}
          >
            {loadingRowId === log.id ? (
              <Spinner />
            ) : (
              <img src={EyeIcon} alt="viewIcon" className="px-3" />
            )}
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingRowId]
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
        Failed to load sent emails. Please try again.
      </div>
    )
  }

  return (
    <div className="EmailListContainer">
      <TopSearch
        title="Sent Emails"
        showButton={false}
        searchPlaceholder="Search sent emails…"
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
                  heading: 'No Sent Emails',
                  description: 'Emails you send will appear here.',
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

      <EmailViewModal
        logId={viewLogId}
        data={modalData}
        onClose={() => {
          setViewLogId(null)
          setModalData(null)
        }}
      />
    </div>
  )
}

export default SentEmailList
