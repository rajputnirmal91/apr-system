import AlertIcon from '@project/assets/images/AlertIcon.svg'
import EditIcon from '@project/assets/images/EditBlueIcon.svg'
import GreenRightIcon from '@project/assets/images/greenRightIcon.svg'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'

import '@project/Pages/General/Reports/ReportDetails/Pedp/Pedp.scss'

const scale = [
  {
    rating: 5,
    label: 'Strength to build upon',
    description: 'Exceeds expectations; performs at the next level.',
  },
  {
    rating: 4,
    label: 'Performs well & meets expectations',
    description: 'Meets expected performance for this level.',
  },
  {
    rating: 3,
    label: 'Developmental need',
    description:
      'Falls short in some areas; requires improvement (address in Section 5).',
  },
  {
    rating: 2,
    label: 'Issue',
    description: 'Repeatedly does not meet expectations despite feedback.',
  },
  {
    rating: 1,
    label: 'Not applicable',
    description: 'This competency does not apply to the role.',
  },
]

function Pedp() {
  const displayInfo = (name: string, value: string, icon?: string) => {
    return (
      <div className="">
        <p className="m-0 textLight font14 font400 fontOnest pb-2">{name}</p>
        <div className="d-flex gap-2">
          {icon && <img src={icon} alt="icon" />}
          <p className="m-0">{value}</p>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="marginTop24">
        <div className="bgRadius padding24">
          <div className="d-flex justify-content-between">
            <h4 className="m-0 font16 font400 fontOnest">
              Form review Deadline’s
            </h4>
            <div className="d-flex gap-1">
              <button className="transparentButton">
                <img src={EditIcon} alt="editIcon" />
              </button>
              <h4 className="m-0 font16 font400 fontOnest primaryColor">
                Edit deadlines
              </h4>
            </div>
          </div>
          <div className="d-flex flex-xxl-row flex-column displayInfo borderBottom">
            {displayInfo('Emp submission', 'Mar 7, 2025', GreenRightIcon)}
            {displayInfo('Manager', 'Mar 7, 2025', GreenRightIcon)}
            {displayInfo('IRM', 'Mar 7, 2025', AlertIcon)}
            {displayInfo('Unit head', 'Mar 7, 2025', AlertIcon)}
            {displayInfo('HR', 'Mar 7, 2025', AlertIcon)}
            {displayInfo('Management', 'Mar 7, 2025', AlertIcon)}
          </div>
        </div>
        <div className="bgRadius marginTop24 padding24">
          <div className="d-flex flex-xxl-row flex-column displayEmployeeInfo1 borderBottom">
            {displayInfo('Emp ID', 'LMS123')}
            {displayInfo('Current designation', 'UI Designer')}
            {displayInfo('Joining date', 'Apr 3, 2023')}
            {displayInfo('Review period', 'FY 2025-26')}
            {displayInfo('Total IT experience', '2 Years')}
          </div>
          <div className="d-flex flex-xxl-row flex-column displayEmployeeInfo2 borderBottom">
            {displayInfo('Total LMS experience', '2 Years')}
            {displayInfo('Appraiser', 'Madelyn Stanton')}
          </div>
        </div>
      </div>
      <div>
        <p className="py-3 mb-0">Rating key</p>
        <div className="padding24 ratingMain">
          <p className="mb-0 textLight font14 font400 fontOnest pb-2">Scale</p>
          <div className="d-flex flex-column gap-2">
            {scale.map(({ rating, label, description }) => (
              <p key={rating} className="mb-0 font16 font400 fontOnest">
                <span className="primaryColor">{rating}</span>
                <span> - ({label}): </span>
                <span className="textLight">{description}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="goalsMain">
        <p className="py-3 mb-0">Goals</p>
        {/* Category - 1 -> Service excellence */}
        <div className="goalCategory">
          <div className="goalsHead padding24">
            <p className="font16 font400 fontOnest mb-0">Service excellence</p>
          </div>
          {/* Kra name 1 */}
          <div className="categoryMain padding24 pb-0">
            <div className="categoryHead">
              <p className="font16 font400 fontOnest mb-0 p-3">Kra name 1</p>
            </div>

            <div className="container mt-4">
              <TableResponsive>
                <table className="tableMain">
                  <thead>
                    <tr className="border-bottom">
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '20%' }}
                      >
                        KRA <br />
                        description
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Employee <br />
                        rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Appraiser
                        <br /> rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Employee <br />
                        remarks
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Appraiser <br />
                        remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TableResponsive>
            </div>
          </div>
          {/* Kra name 2 */}
          <div className="categoryMain padding24">
            <div className="categoryHead">
              <p className="font16 font400 fontOnest mb-0 p-3">Kra name 1</p>
            </div>

            <div className="container mt-4">
              <TableResponsive>
                <table className="tableMain">
                  <thead>
                    <tr className="border-bottom">
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '20%' }}
                      >
                        KRA <br />
                        description
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Employee <br />
                        rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Appraiser
                        <br /> rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Employee <br />
                        remarks
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Appraiser <br />
                        remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TableResponsive>
            </div>
          </div>
        </div>
        {/* Category - 2 -> Management effectiveness */}
        <div className="goalCategory mt-3">
          <div className="goalsHead padding24">
            <p className="font16 font400 fontOnest mb-0">
              Management effectiveness
            </p>
          </div>
          {/* Kra name 1 */}
          <div className="categoryMain padding24 pb-0">
            <div className="categoryHead">
              <p className="font16 font400 fontOnest mb-0 p-3">Kra name 1</p>
            </div>

            <div className="container mt-4">
              <TableResponsive>
                <table className="tableMain">
                  <thead>
                    <tr className="border-bottom">
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '20%' }}
                      >
                        KRA <br />
                        description
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Employee <br />
                        rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Appraiser
                        <br /> rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Employee <br />
                        remarks
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Appraiser <br />
                        remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TableResponsive>
            </div>
          </div>
          {/* Kra name 2 */}
          <div className="categoryMain padding24 ">
            <div className="categoryHead">
              <p className="font16 font400 fontOnest mb-0 p-3">Kra name 1</p>
            </div>

            <div className="container mt-4">
              <TableResponsive>
                <table className="tableMain">
                  <thead>
                    <tr className="border-bottom">
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '20%' }}
                      >
                        KRA <br />
                        description
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Employee <br />
                        rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '10%' }}
                      >
                        Appraiser
                        <br /> rating
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Employee <br />
                        remarks
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight pb-2"
                        style={{ width: '30%' }}
                      >
                        Appraiser <br />
                        remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                    <tr className="">
                      <td className="pb-3 font14 font400 fontOnest">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">5</td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="pb-3 font14 font400 fontOnest">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TableResponsive>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="pt-3 mb-0 font20 font400 fontOnest">Goal description</p>
        <p className="textLight font16 font400 fontOnest">
          Significant achievement(s) of appraisee in review period
        </p>
        <div className="padding24 bgRadius">
          <p className="font14 font400 fontOnest textLight">Appraisee</p>
          <p className="font16 font400 fontOnest">
            Lorem ipsum dolor sit amet consectetur. Faucibus facilisis
            ullamcorper condimentum in elit erat elementum ultricies. Egestas
            risus interdum viverra suspendisse justo. Lorem dolor lorem amet
            adipiscing enim diam netus varius vel. Risus ac accumsan posuere
            quam. Dui amet consequat erat in a tellus commodo in sed. Nec ornare
            hendrerit ornare egestas nisl. Tempus diam consequat parturient diam
            amet in lacus.
          </p>
        </div>
      </div>
    </>
  )
}

export default Pedp
