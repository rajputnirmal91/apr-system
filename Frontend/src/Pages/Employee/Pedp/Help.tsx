import { useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import DownArrow from '@project/assets/images/DownArrow.svg'
import RatePoint from '@project/assets/images/ratePoint.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import Breadcrumbs from '@project/Components/BreadCrumb/BreadCrumb'
import { useGetRatingListQuery } from '@project/Store/Api/Admin/Ratings/rating'
import { employeeRoutes } from '@project/Utils/routeNavigation'

function Help() {
  const { data: Rating } = useGetRatingListQuery({
    page: 1,
    limit: 1000,
    search: '',
    rating_for: 'Employee',
  })
  const [detailId, setDetailId] = useState<string | null>('')

  const handleDetail = (id: string | null) => {
    setDetailId((prev) => (prev === id ? '' : id))
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'PEDP',
            path: `/${employeeRoutes.root}/${employeeRoutes.pedp}`,
          },
          { label: 'Help' },
        ]}
      />
      <div className="kraWrapper">
        <div className="kraList mx-0">
          <h3 className="font16 font400 fontOnest mb-0 ps-3">Competencies</h3>
        </div>
        <Row className="p-4">
          <Col lg={12}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <p className="mb-0 font14 font400 fontOnest pb-1">
              <span className="textLight">Instructions</span>
            </p>
            <p className="mb-0 font16 font400 fontOnest textDark">
              The purpose of this appraisal is to evaluate the employee's
              performance over the review period, focusing on the competencies
              relevant to their job role and service line. The evaluator will
              consider the feedback provided by the employee to guide the
              appraisal discussion. We are committed to fostering employee
              development by offering the resources and support needed for
              growth. This assessment will be essential in shaping the
              employee's Development Plan for the next year.
            </p>
          </Col>
          <hr className="commanDivider border" />
          <Col lg={12}>
            <span className="textLight font14 font400 fontOnest">
              Rating Scales
            </span>
            {Rating?.ratings && Rating?.ratings.length > 0
              ? Rating?.ratings.map((data) => (
                  <h3 className="font16 font400 fontOnest mb-0 mt-2">
                    <span className="primaryColor">{data.rating_score} -</span>{' '}
                    ({data.rating_title}):{' '}
                    <span className="textLight">
                      Exceeds expectations; performs at the next level.
                      {data.rating_description}
                    </span>
                  </h3>
                ))
              : null}
          </Col>
        </Row>
      </div>

      <div className="kraWrapper">
        <div className="kraList mx-0">
          <h3 className="font16 font400 fontOnest mb-0 ps-3">
            Rating guidelines
          </h3>
        </div>
        <p className="mb-0 font16 font400 fontOnest textDark p-4">
          An evaluation rating directly translates to an overall year end
          rating. The year end rating also takes into consideration factors such
          as: contribution to firm initiatives, level of commitment to the firm,
          contribution to the practice success, and also considers the Team
          Lead's and Leadership Inputs.
        </p>

        {Rating?.ratings && Rating?.ratings.length > 0
          ? Rating?.ratings.map((data) => (
              <div className="wrapper ms-4 mb-3 me-4">
                <div className="kraList d-flex align-items-center justify-content-between">
                  <h3 className="font16 font400 fontOnest mb-0 ps-3">
                    Rating Scale -{' '}
                    <span className="primaryColor">{data?.rating_score}</span>
                    <span className="primaryColor">
                      {data.rating_name}
                    </span>{' '}
                  </h3>
                  <button
                    className="transparentButton"
                    onClick={() => handleDetail(data.id)}
                  >
                    {detailId === data.id ? (
                      <img src={TopArrow} alt="downArrow" />
                    ) : (
                      <img src={DownArrow} alt="downArrow" />
                    )}
                  </button>
                </div>
                {detailId === data.id && (
                  <div className="ps-4 py-3">
                    <p className="font16 font400 fontOnest pb-0">
                      {data.rating_description}
                    </p>
                    <hr className="divider" />
                    <ul
                      className="rating-points"
                      style={{ listStyle: 'none', paddingLeft: '0px' }}
                    >
                      {data.rating_points.map((rate) => (
                        <li key={rate.id} className="d-flex gap-2">
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
              </div>
            ))
          : null}
      </div>
    </>
  )
}

export default Help
