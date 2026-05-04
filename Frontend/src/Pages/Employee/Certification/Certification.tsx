import CertificationList from './CertificationList'

import './Certification.scss'

function Certification(): JSX.Element {
  return (
    <div className="certificationWrapper">
      <CertificationList initialValues={[]} />
    </div>
  )
}

export default Certification
