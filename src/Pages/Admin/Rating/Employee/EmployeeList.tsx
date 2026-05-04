import { useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import DeleteBlackIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import DownArrow from '@project/assets/images/DownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import Line from '@project/assets/images/Line.svg'
import NoEmployeeRating from '@project/assets/images/NoRatingFound.svg'
import RatePoint from '@project/assets/images/ratePoint.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import CustomModal from '@project/Components/Modal/Modal'
import EmployeeRatingForm from '@project/Pages/Admin/Rating/Employee/EmployeeRatingForm'
import {
  useDeleteRatingMutation,
  useGetRatingListQuery,
} from '@project/Store/Api/Admin/Ratings/rating'
import { Ratings } from '@project/Types/rating'

type EmployeeListProps = {
  ratingFor: string
  refetchData: boolean
  search: string
}

function EmployeeList({ ratingFor, refetchData, search }: EmployeeListProps) {
  const [deleteRating, { isLoading: DeleteLoading }] = useDeleteRatingMutation()
  const [detailId, setDetailId] = useState<string | null>('')
  const [editData, setEditData] = useState<Ratings | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string | null>('')

  const {
    data,
    isLoading: ListLoading,
    error: ListError,
    refetch,
  } = useGetRatingListQuery({
    page: 1,
    limit: 1000,
    search,
    rating_for: ratingFor,
  })

  useEffect(() => {
    if (refetchData) refetch()
  }, [refetchData, refetch])

  if (ListLoading) {
    return <p>Loading the ratings...</p>
  }

  if (ListError) {
    return <p> Getting error while fetching the data</p>
  }

  const handleRatingDetail = (id: string | null) => {
    setDetailId((prev) => (prev === id ? '' : id))
  }

  const handleEditForm = (ratingData: Ratings) => {
    setEditData(ratingData)
    setShowForm(true)
  }

  const handleDelete = (id: string | null) => {
    setShowDelete(true)
    setDeleteId(id)
  }

  const handleDeleteData = () => {
    const deletePayload = {
      id: deleteId,
      is_deleted: true,
    }

    deleteRating(deletePayload)
      .unwrap()
      .then(() => {
        setShowDelete(false)
        refetch()
      })
  }

  return (
    <>
      <CustomModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteData}
        image={DeleteWhiteIcon}
        modalHeading="Delete Rating"
        modalDesc="Are you sure you want to delete this rating?"
        type="Warning"
        loading={DeleteLoading}
      />
      <EmployeeRatingForm
        show={showForm}
        ratingFor={ratingFor}
        closeForm={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false)
          refetch()
        }}
        editData={editData}
        data={data?.ratings}
      />
      <div className="tableList">
        {data?.ratings && data?.ratings.length > 0 ? (
          data?.ratings.map((item) => (
            <Col lg={12} className="kraWrapper">
              <Row className="kraList mx-0">
                <Col lg={9}>
                  <h3 className="font16 font400 fontOnest mb-0">
                    <span className="primaryColor">{item.rating_name} -</span>{' '}
                    {item.rating_title}
                  </h3>
                </Col>
                <Col lg={3} className="d-flex justify-content-end">
                  <div className="d-flex gap-3">
                    <button
                      className="transparentButton"
                      onClick={() => handleEditForm(item)}
                    >
                      <img src={EditIcon} alt="downArrow" className="pe-3" />
                      <img src={Line} alt="line" />
                    </button>
                    <button
                      className="transparentButton"
                      onClick={() => handleDelete(item.id)}
                    >
                      <img
                        src={DeleteBlackIcon}
                        alt="deleteIcon"
                        className="pe-3"
                      />
                      <img src={Line} alt="line" />
                    </button>
                    <button
                      className="transparentButton"
                      onClick={() => handleRatingDetail(item.id)}
                    >
                      {detailId === item.id ? (
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

              {detailId === item.id && (
                <div className="ps-4 py-3">
                  <p className="font16 font400 fontOnest pb-0">
                    {item.rating_description}
                  </p>
                  <hr className="divider" />
                  <ul className="rating-points">
                    {item.rating_points.map((rate) => (
                      <li key={rate.id}>
                        <img
                          src={RatePoint}
                          alt="check icon"
                          className="icon"
                        />
                        <span className="font16 font400 fontOnest textLight">
                          {rate.rating_points}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
          ))
        ) : (
          <div className="text-center mt-4">
            <img src={NoEmployeeRating} alt="Not Found" />
          </div>
        )}
      </div>
    </>
  )
}

export default EmployeeList
