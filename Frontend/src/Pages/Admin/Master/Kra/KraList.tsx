import { useState } from 'react'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import DeleteBlackIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import DownArrow from '@project/assets/images/DownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import Line from '@project/assets/images/Line.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import CustomModal from '@project/Components/Modal/Modal'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import KraForm from '@project/Pages/Admin/Master/Kra/KraForm'
import {
  useDeleteKraMutation,
  useGetKraListQuery,
} from '@project/Store/Api/Admin/Kra'
import useDebounce from '@project/Utils/debounce'

import './kra.scss'

type KraProps = {
  search: string
  showKraForm: boolean
}

function KraList({ search, showKraForm }: KraProps) {
  const [detail, setDetail] = useState<boolean>(false)
  const [subKraDetailId, setSubKraDetailId] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const { data, isLoading, isError, refetch } = useGetKraListQuery({
    page: 1,
    limit: 1000,
    search: debouncedSearch,
  })
  const [editForm, setEditForm] = useState<boolean>(false)
  const [editId, setEditId] = useState<string>('')
  const [modalShow, setModalShow] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [deleteKra, { isLoading: isDeletingKra }] = useDeleteKraMutation()
  const [associatePopup, setAssociatePopup] = useState<boolean>(false)

  const handleAssociatePopupOpen = () => {
    setAssociatePopup(true)
  }

  const handleAssociatePopupClose = () => {
    setAssociatePopup(false)
  }

  const handleKraDetail = (id: string) => {
    if (subKraDetailId === id && detail) {
      setDetail(false)
      setSubKraDetailId('')
    } else {
      setSubKraDetailId(id)
      setDetail(true)
    }
  }

  const handleEditForm = (id: string) => {
    setDetail(false)
    setEditForm(true)
    setEditId(id)
  }

  const handleKraFormClose = () => {
    setEditForm(false)
  }

  if (isLoading) return <p>Loading the data...</p>
  if (isError) return <p>Error while fetch the data</p>

  const handleDeletePopUpOpen = (id: string, associate: boolean) => {
    if (!associate) {
      setDetail(false)
      setModalShow(true)
      setDeleteId(id)
    } else {
      handleAssociatePopupOpen()
    }
  }

  const handleDeletePopUpClose = () => {
    setModalShow(false)
  }

  const handleDelete = () => {
    if (isDeletingKra) return
    const deleteData = {
      id: deleteId,
      is_deleted: true,
    }
    deleteKra(deleteData)
      .unwrap()
      .then(() => {
        if (refetch) refetch()
        handleDeletePopUpClose()
      })
  }

  return (
    <Row>
      <CustomModal
        show={modalShow}
        onClose={handleDeletePopUpClose}
        onConfirm={handleDelete}
        image={DeleteWhiteIcon}
        modalHeading="Delete KRA"
        modalDesc="Are you sure you want to delete this KRA? This action will also delete all associated Secondary-KRAs. ?"
        type="Warning"
      />
      <CustomModal
        show={associatePopup}
        onClose={handleAssociatePopupClose}
        image={CloseWhiteIcon}
        type="Warning"
        modalHeading="KRA delete not possible"
        modalDesc="This KRA is already used so can not delete this KRA."
        mode="info"
      />
      <KraForm
        show={editForm}
        refetch={refetch}
        kraFormLabel="Edit KRA"
        editId={editId}
        closeForm={handleKraFormClose}
      />
      {data?.kras && data.kras.length > 0 ? (
        data.kras.map(
          (item) => (
            <Col
              lg={12}
              className="kraWrapper"
              style={{
                paddingBottom:
                  detail && subKraDetailId === item.id ? '20px' : '0px',
              }}
              key={item.id}
            >
              <Row className="kraList">
                <Col
                  lg={10}
                  className="d-flex align-items-center"
                  onClick={() => handleKraDetail(item.id)}
                >
                  <span className="responsiveFont16  font400 fontOnest mb-0 cursor-pointer preserveWhitespace">
                    {item.kra_name}
                    <span className="primaryColor">
                      {' '}
                      (Secondary KRA - {item.sub_kras.length})
                    </span>
                  </span>
                </Col>
                <Col lg={2} className="d-flex justify-content-end">
                  <div className="d-flex gap-3">
                    <button
                      disabled={showKraForm}
                      className="transparentButton"
                      onClick={() => handleEditForm(item.id)}
                    >
                      <img src={EditIcon} alt="downArrow" className="pe-3" />
                      <img src={Line} alt="line" />
                    </button>
                    <button
                      disabled={showKraForm}
                      className="transparentButton"
                      onClick={() =>
                        handleDeletePopUpOpen(item.id, item.is_associated)
                      }
                    >
                      <img
                        src={DeleteBlackIcon}
                        alt="deleteIcon"
                        className="pe-3"
                      />
                      <img src={Line} alt="line" />
                    </button>
                    <button
                      disabled={showKraForm}
                      className="transparentButton"
                      onClick={() => handleKraDetail(item.id)}
                    >
                      {detail && subKraDetailId === item.id ? (
                        <img src={TopArrow} alt="topArrow" />
                      ) : (
                        <img src={DownArrow} alt="downArrow" />
                      )}
                      <img
                        style={{ visibility: 'hidden' }}
                        src={Line}
                        alt="line"
                      />
                    </button>
                  </div>
                </Col>
              </Row>
              {detail && subKraDetailId === item.id && (
                <Row>
                  <Col>
                    <div className="subKraDetailMain">
                      <div className="Kraborder">
                        {item.sub_kras.map((subKraList, index) => (
                          <p
                            key={subKraList.id || index}
                            className="font16 mb-0 fontOnest py-1 kraList preserveWhitespace"
                          >
                            <span className="subKraIndex">{index + 1}.</span>
                            <span className="subKraName">
                              {subKraList.sub_kra_name}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          )
          // )
        )
      ) : (
        <NoRecordFound
          heading="No KRA found"
          description="No KRA is available in the system."
          className="onlyWithTopSearch"
        />
      )}
    </Row>
  )
}

export default KraList
