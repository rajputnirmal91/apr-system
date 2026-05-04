import { Col, Row } from 'react-bootstrap'

import ProfilePic from '@project/assets/images/profilePic.svg'

import '@project/Pages/Admin/Profile/Profile.scss'

function Profile() {
  const displayInfo = (name: string, value: string) => {
    return (
      <div style={{ width: '30%' }} className="pb-lg-none pb-2">
        <p className="m-0 textLight font14 font400 fontOnest pb-lg-2">{name}</p>
        <div className="d-flex gap-2">
          <p className="m-0">{value}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="profileWrapper">
        <div className="profileHead mx-0">
          <h3 className="font16 font400 fontOnest mb-0 ps-3">
            Key Information
          </h3>
        </div>

        <div className="p-4">
          <Row>
            <Col
              lg={2}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="profileImageMain">
                <img
                  src={ProfilePic}
                  alt="profilePic"
                  className="profileImage"
                />
              </div>
            </Col>
            <Col lg={10}>
              <Row className="mt-sm-3">
                <Col lg={12} sm={6} className="d-lg-flex mb-lg-3">
                  {displayInfo('Emp ID', 'Test')}
                  {displayInfo('Emp Name', 'Test')}
                  {displayInfo('Current Designation', 'Test')}
                  {displayInfo('Date of Joining', 'Test')}
                </Col>
                <Col lg={12} sm={6} className="d-lg-flex">
                  {displayInfo('Review Period', 'Test')}
                  {displayInfo('Total IT Experience', 'Test')}
                  {displayInfo('Total LMS Experience', 'Test')}
                  {displayInfo(`Appraiser's Name`, 'Test')}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <div className="profileWrapper">
        <div className="profileHead mx-0">
          <h3 className="font16 font400 fontOnest mb-0 ps-3">Personal</h3>
        </div>
        <Row>
          <Col lg={12} sm={4} className="d-lg-flex py-3 px-5">
            {displayInfo('Blood Group', 'A +ve')}
            {displayInfo('Date of Birth', '24 Jan 1995')}
            {displayInfo('Nationality', 'Indian')}
            {displayInfo('Marital Status', 'Single')}
            {displayInfo('Marriage Date', '--')}
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex py-3 px-5">
            {displayInfo('Spouse', '--')}
            {displayInfo('Place of Birth', 'Indore')}
            {displayInfo('Residential Status', '--')}
            {displayInfo('Father Name', 'Leonard Barber')}
            {displayInfo('Religion', '26 Sep 2024')}
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex py-3 px-5">
            {displayInfo('Physically Challenged', 'No')}
            {displayInfo('International Employee', '--')}
            {displayInfo('Height', '5.8')}
            {displayInfo('Weight', '65')}
            {displayInfo('Identification Mark', 'XDEE34121')}
          </Col>
        </Row>
      </div>
      <div className="profileWrapper">
        <div className="profileHead mx-0">
          <h3 className="font16 font400 fontOnest mb-0 ps-3">Personal</h3>
        </div>
        <Row>
          <Col lg={12} sm={4} className="d-lg-flex py-3 px-5">
            {displayInfo('Addresss', '123, Acg colony')}
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex py-3 px-5">
            {displayInfo('Email', 'test@yopmail.com')}
            {displayInfo('Phone 1', '4512 452323')}
            {displayInfo('Phone 2', '45214 12423')}
            {displayInfo('Extension', '26 Sept 2024')}
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex py-3 px-5">
            {displayInfo('Fax', 'MTJNM')}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Profile
