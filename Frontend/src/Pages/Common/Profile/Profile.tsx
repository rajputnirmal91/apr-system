import { Col, Row } from 'react-bootstrap'

import ProfilePic from '@project/assets/images/profilePic.svg'
import CardWithContent from '@project/Components/Card/CardWithContent/CardWithContent'
import DisplayInfo from '@project/Components/DisplayInfo/DisplayInfo'

import '@project/Pages/Admin/Profile/Profile.scss'

type ProfileProps = {
  userRole: string
}

function Profile({ userRole }: ProfileProps) {
  return (
    // <Container>
    <div>
      <p className="d-none">{userRole}</p>
      <CardWithContent heading="Key Information">
        <Row>
          <Col
            lg={2}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="profileImageMain">
              <img src={ProfilePic} alt="profilePic" className="profileImage" />
            </div>
          </Col>
          <Col lg={10}>
            <Row className="mt-sm-3">
              <Col lg={12} sm={6} className="d-lg-flex mb-lg-3">
                <DisplayInfo name="Emp ID" value="Test" width="30%" />
                <DisplayInfo name="Emp Name" value="Test" width="30%" />
                <DisplayInfo
                  name="Current Designation"
                  value="Test"
                  width="30%"
                />
                <DisplayInfo name="Date of Joining" value="Test" width="30%" />
              </Col>
              <Col lg={12} sm={6} className="d-lg-flex">
                <DisplayInfo name="Review Period" value="Test" width="30%" />
                <DisplayInfo
                  name="Total IT Experience"
                  value="Test"
                  width="30%"
                />
                <DisplayInfo
                  name="Total LMS Experience"
                  value="Test"
                  width="30%"
                />
                <DisplayInfo name="Appraiser Name" value="Test" width="30%" />
              </Col>
            </Row>
          </Col>
        </Row>
      </CardWithContent>

      <CardWithContent heading="Personal">
        <Row>
          <Col lg={12} sm={4} className="d-lg-flex">
            <DisplayInfo name="Blood Group" value="A +ve" width="30%" />
            <DisplayInfo name="Date of Birth" value="24 Jan 1995" width="30%" />
            <DisplayInfo name="Nationality" value="Indian" width="30%" />
            <DisplayInfo name="Marital Status" value="Single" width="30%" />
            <DisplayInfo name="Marriage Date" value="--" width="30%" />
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex">
            <DisplayInfo name="Spouse" value="--" width="30%" />
            <DisplayInfo name="Place of Birth" value="Indore" width="30%" />
            <DisplayInfo name="Residential Status" value="--" width="30%" />
            <DisplayInfo
              name="Father Name"
              value="Leonard Barber"
              width="30%"
            />
            <DisplayInfo name="Religion" value="26 Sep 2024" width="30%" />
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex">
            <DisplayInfo name="Physically Challenged" value="No" width="30%" />
            <DisplayInfo name="International Employee" value="--" width="30%" />
            <DisplayInfo name="Height" value="5.8" width="30%" />
            <DisplayInfo name="Weight" value="65" width="30%" />
            <DisplayInfo
              name="Identification Mark"
              value="XDEE34121"
              width="30%"
            />
          </Col>
        </Row>
      </CardWithContent>

      <CardWithContent heading="Personal">
        <Row>
          <Col lg={12} sm={4} className="d-lg-flex">
            <DisplayInfo name="Addresss" value="123" width="30%" />
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex">
            <DisplayInfo name="Email" value="test@yopmail.com" width="30%" />
            <DisplayInfo name="Phone 1" value="4512 452323" width="30%" />
            <DisplayInfo name="Phone 2" value="45214 12423" width="30%" />
            <DisplayInfo name="Extension" value="26 Sept 2024" width="30%" />
          </Col>
          <Col lg={12} sm={4} className="d-lg-flex">
            <DisplayInfo name="Fax" value="MTJNM" width="30%" />
          </Col>
        </Row>
      </CardWithContent>
    </div>
    // </Container>
  )
}

export default Profile
