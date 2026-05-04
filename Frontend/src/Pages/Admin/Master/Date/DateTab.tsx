import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import Calendar from '@project/assets/images/Calendar.svg'
import CancelIcon from '@project/assets/images/Cancel.svg'
import Danger from '@project/assets/images/Danger.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import SaveIcon from '@project/assets/images/Save.svg'
import CustomModal from '@project/Components/Modal/Modal'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useDateAddMutation,
  useDateEditMutation,
  useDateListQuery,
} from '@project/Store/Api/Admin/Masters/Date/dateApi'
import {
  IDateApiResponse,
  IDateMutationResponse,
  IPublishItem,
  ITableRow,
} from '@project/Types/DateTypes'
import useDebounce from '@project/Utils/debounce'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'
import { submissionTypeMap } from '@project/Utils/validationMessages'

import 'react-datepicker/dist/react-datepicker.css'
import './DateTab.scss'

function DateTab() {
  const [tableData, setTableData] = useState<ITableRow[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [tempDate, setTempDate] = useState<string | null>('')
  const [originalEditDate, setOriginalEditDate] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false)
  const [pendingEditRow, setPendingEditRow] = useState<ITableRow | null>(null)
  const [pendingCancelRow, setPendingCancelRow] = useState<ITableRow | null>(
    null
  )

  const debouncedSearch = useDebounce(search, 500)

  const { data, refetch: ListRefetch } = useDateListQuery({
    page: 1,
    limit: 1000,
    search: '',
    order_by: 'asc',
  }) as { data: IDateApiResponse | undefined; refetch: () => void }

  /* -------------------- MUTATIONS -------------------- */
  const [addDateApi] = useDateAddMutation()
  const [editDateApi] = useDateEditMutation()

  /* -------------------- MAP API TO UI -------------------- */

  useEffect(() => {
    if (data?.PEDP_Form_Publish) {
      const mapped: ITableRow[] = data.PEDP_Form_Publish.map(
        (item: IPublishItem, index: number) => ({
          id: index + 1,
          event: submissionTypeMap[item.submission_type],
          date: item.submission_date
            ? moment(item.submission_date).format('MMM DD, YYYY')
            : null,
          rawDate: item.submission_date,
          submission_type: item.submission_type,
          api_id: item.id,
        })
      )
      setTableData(mapped)
    }
  }, [data])

  /* -------------------- EDIT START -------------------- */

  const hasUnsavedDateChange = (): boolean => {
    if (editId === null) return false

    if (!tempDate) return false

    const currentRow = tableData.find((item) => item.id === editId)
    if (!currentRow) return false

    const originalDate = currentRow.rawDate || ''
    return originalDate !== tempDate
  }

  const getRowDateValue = (row: ITableRow): string | null => {
    if (row.rawDate) {
      return moment(row.rawDate).format('YYYY-MM-DD')
    }

    if (!row.date) return null

    const parsedDate = moment(row.date, ['YYYY-MM-DD', 'MMM DD, YYYY'], true)
    return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null
  }

  const revertCurrentEditToOriginal = () => {
    if (editId === null) return

    const currentRow = tableData.find((row) => row.id === editId)
    if (!currentRow) return

    if (currentRow.api_id === null) {
      setTableData((prev: ITableRow[]) =>
        prev.map((row) =>
          row.id === editId ? { ...row, date: originalEditDate || null } : row
        )
      )
    }

    setTempDate(originalEditDate || '')
  }

  const startEdit = (row: ITableRow) => {
    const originalDate = getRowDateValue(row)
    setOriginalEditDate(originalDate)
    setEditId(row.id)

    if (row.api_id === null) {
      setTempDate('')
    } else {
      setTempDate(originalDate || '')
    }
  }

  const handleEdit = (row: ITableRow) => {
    if (editId !== null && editId !== row.id && hasUnsavedDateChange()) {
      setPendingEditRow(row)
      setShowUnsavedModal(true)
      return
    }

    startEdit(row)
  }

  const handleCancel = (item: ITableRow) => {
    if (editId === item.id && hasUnsavedDateChange()) {
      setPendingCancelRow(item)
      setShowUnsavedModal(true)
      return
    }

    setEditId(null)
    setTempDate('')
    setOriginalEditDate(null)
    if (item.api_id === null) {
      setTableData((prev: ITableRow[]) =>
        prev.map((row) => (row.id === item.id ? { ...row, date: null } : row))
      )
    }
  }

  /* -------------------- SAVE (ADD / EDIT) -------------------- */

  const handleSave = async (mileStone: ITableRow) => {
    let row = null
    if (mileStone) {
      row = tableData.find((r) => r.id === mileStone.id)
    } else {
      row = tableData.find((item) => item.id === editId)
    }
    if (!row || !tempDate) return

    /* ---- VALIDATION: CANNOT SELECT A DATE EARLIER THAN PREVIOUS ONE ---- */
    const currentIndex = tableData.findIndex((r) => r.id === editId)
    const prevRow = tableData[currentIndex - 1]

    if (prevRow) {
      const prevDate = moment(prevRow.rawDate)
      const newDate = moment(tempDate)

      if (newDate.isBefore(prevDate) || newDate.isSame(prevDate)) {
        showErrorToast(
          `Selected date must be later than the previous date (${prevRow.date}).`
        )
        return
      }
    }

    try {
      const payload = {
        id: row.api_id,
        submission_type: row.submission_type,
        submission_date: tempDate,
      }

      let res: IDateMutationResponse | null = null

      if (row.api_id === null) {
        res = await addDateApi(payload).unwrap()
      } else {
        res = await editDateApi(payload).unwrap()
      }

      if (res?.message) {
        showSuccessToast(`${res.message}`)
      } else {
        showSuccessToast('Operation completed successfully')
      }

      ListRefetch()
      setEditId(null)
      setOriginalEditDate(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const backendMessage =
        err?.data?.detail || 'Something went wrong. Please try again.'
      showErrorToast(backendMessage)
    }
  }

  const filteredTableData = tableData.filter((item) => {
    if (!debouncedSearch.trim()) return true

    const searchValue = debouncedSearch.toLowerCase()

    return (
      item.event.toLowerCase().includes(searchValue) ||
      item.date?.toLowerCase().includes(searchValue)
    )
  })

  const handleDateChange = (date: string | null, item: ITableRow) => {
    if (editId !== null && editId !== item.id && hasUnsavedDateChange()) {
      setPendingEditRow(item)
      setShowUnsavedModal(true)
      return
    }

    if (editId !== item.id) {
      setOriginalEditDate(getRowDateValue(item))
    }

    setEditId(item.id)
    setTempDate(date)
    const formattedDate = date ? moment(date).format('YYYY-MM-DD') : ''

    setTableData((prev: ITableRow[]) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, date: formattedDate } : row
      )
    )
  }

  /* -------------------- RENDER -------------------- */

  return (
    <Container fluid className="m-0 p-0 dateTab">
      <Row className="align-items-center">
        <Col lg={12} className="p-0">
          <TopSearch
            title="Milestones"
            showButton={false}
            searchPlaceholder="Search"
            searchValue={search}
            onSearchChange={(val) => setSearch(val)}
          />
        </Col>
      </Row>

      {filteredTableData.length === 0 ? (
        <NoRecordFound
          heading="No milestones found"
          description="Currently, no milestones are available."
          className="centerNoRecord"
        />
      ) : (
        <div className="userTableMain commonTable dateTabTable">
          <TableResponsive maxHeight="65vh">
            <table className="table manageWeightageTable">
              <thead className="custom-thead">
                <tr className="custom-thead-row">
                  <th
                    className="custom-th font14 font400"
                    style={{ width: '100px' }}
                  >
                    S.No
                  </th>

                  <th className="custom-th font16 font400 fontOnest">
                    Event Name
                  </th>

                  <th className="custom-th font16 font400 fontOnest">Date</th>

                  <th
                    className="custom-th font16 font400 fontOnest"
                    style={{ width: '200px' }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTableData.map((item) => (
                  <tr key={item.id}>
                    <td
                      className="font14 font400 fontOnest"
                      style={{ width: '100px' }}
                    >
                      {item.id}
                    </td>
                    <td className="font14 font400 fontOnest">{item.event}</td>

                    <td className="font14 font400 fontOnest datePickerTd">
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {editId === item.id ? (
                        /* EDIT MODE */
                        <DatePicker
                          selected={tempDate ? moment(tempDate).toDate() : null}
                          onChange={(d) =>
                            setTempDate(d ? moment(d).format('YYYY-MM-DD') : '')
                          }
                          dateFormat="MMM dd, yyyy"
                          placeholderText="Select date"
                          onKeyDown={(e) => e.preventDefault()}
                          autoFocus
                          minDate={new Date()}
                          icon={
                            <img
                              src={Calendar}
                              alt="cal"
                              className="calendar-icon"
                            />
                          }
                        />
                      ) : item.api_id === null ? (
                        <DatePicker
                          selected={
                            item.date ? moment(item.date).toDate() : null
                          }
                          onChange={(d) =>
                            handleDateChange(
                              d ? moment(d).format('YYYY-MM-DD') : null,
                              item
                            )
                          }
                          dateFormat="MMM dd, yyyy"
                          placeholderText="Select date"
                          minDate={new Date()}
                          onKeyDown={(e) => e.preventDefault()}
                          icon={
                            <img
                              src={Calendar}
                              alt="cal"
                              className="calendar-icon"
                            />
                          }
                          className="disabled-datepicker"
                        />
                      ) : (
                        /* VIEW MODE – id exists */
                        item.date
                      )}
                    </td>
                    <td>
                      {editId === item.id || item.api_id === null ? (
                        <div className="d-flex gap-3">
                          <button
                            className="transparentButton"
                            onClick={() => handleSave(item)}
                            disabled={
                              editId === item.id
                                ? !tempDate
                                : item?.date === null
                            }
                          >
                            <img src={SaveIcon} alt="Save" />
                          </button>

                          <button
                            className="transparentButton"
                            onClick={() => handleCancel(item)}
                            disabled={
                              editId === item.id
                                ? !tempDate
                                : item?.date === null
                            }
                          >
                            <img src={CancelIcon} alt="Cancel" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="cursor-pointer"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                          style={{ border: 'none', background: 'transparent' }}
                        >
                          <img src={EditIcon} alt="Edit" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableResponsive>
        </div>
      )}

      <CustomModal
        show={showUnsavedModal}
        onClose={() => {
          setShowUnsavedModal(false)
          setPendingEditRow(null)
          setPendingCancelRow(null)
        }}
        onConfirm={() => {
          if (pendingCancelRow) {
            revertCurrentEditToOriginal()
            setEditId(null)
            setTempDate('')
            setOriginalEditDate(null)
            setPendingCancelRow(null)
          } else if (pendingEditRow) {
            revertCurrentEditToOriginal()
            startEdit(pendingEditRow)
            setPendingEditRow(null)
          }
          setShowUnsavedModal(false)
        }}
        image={Danger}
        type="Alert"
        modalHeading="Unsaved Changes"
        modalDesc="If you continue, unsaved date changes will be lost."
        mode="confirm"
      />
    </Container>
  )
}

export default DateTab
