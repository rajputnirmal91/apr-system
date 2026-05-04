import Background from '@project/assets/images/Background.svg'
import DarkBlue from '@project/assets/images/DarkBlue.svg'
import Exclaim from '@project/assets/images/Exclaim.svg'
import Hat from '@project/assets/images/hat.svg'
import LightBlue from '@project/assets/images/LightBlue.svg'
import Line from '@project/assets/images/Line.svg'
import Profile from '@project/assets/images/Profile.svg'
import Tie from '@project/assets/images/tie.svg'
import HeatmapChart from '@project/Components/Graph/BarHeatGraph/BarHeatGraph'
import VerticalBar from '@project/Components/Graph/VerticalBarGraph/VerticalBarGraph'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'

import '@project/Pages/General/Reports/ReportDetails/Analytics/Analytics.scss'

function Analytics() {
  return (
    <div className="analyticsMain">
      <div className="commanStyle marginTop24 padding24">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="d-flex gap-3">
              <h4 className="m-0 font20 font400 fontOnest">
                Overall performance rating
              </h4>
              <img src={Exclaim} alt="exclaim" />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="d-flex justify-content-lg-end mt-4 mt-lg-0 gap-2">
              <div className="d-flex align-items-center gap-2">
                <img src={DarkBlue} alt="darkBlueBox" />
                <h4 className="m-0 font16 font400 fontOnest">Appraisee</h4>
              </div>
              <div>
                <img src={Line} alt="line" />
              </div>
              <div className="d-flex align-items-center gap-2">
                <img src={LightBlue} alt="lightBlueBox" />
                <h4 className="m-0 font16 font400 fontOnest">Appraiser</h4>
              </div>
            </div>
          </div>
          <HeatmapChart />
        </div>
      </div>
      <div>
        <h4 className="m-0 font20 font400 fontOnest mt-3">
          Overall performance rating
        </h4>
        <div className="mt-3">
          <div className="row mt-3">
            <div className="col-12 col-lg-4 ">
              <div className="commanStyle boxStyle d-flex align-items-center justify-content-between py-3 px-3">
                <div className="d-flex gap-3">
                  <div className="cardImage position-relative">
                    <img src={Background} alt="Background" />
                    <img
                      src={Profile}
                      alt="Profile"
                      className="Image position-absolute top-50 start-50 translate-middle"
                    />
                  </div>
                  <div>
                    <h4 className="font40 font600 fontOnest mb-0">4.5</h4>
                    <h4 className="font14 font400 fontOnest mb-0">
                      By employee
                    </h4>
                  </div>
                </div>
                <VerticalBar value={9} max={10} />
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="commanStyle boxStyle d-flex align-items-center justify-content-between py-3 px-3">
                <div className="d-flex gap-3">
                  <div className="cardImage position-relative">
                    <img src={Background} alt="Background" />
                    <img
                      src={Tie}
                      alt="Profile"
                      className="Image position-absolute top-50 start-50 translate-middle"
                    />
                  </div>
                  <div>
                    <h4 className="font40 font600 fontOnest mb-0">3.5</h4>
                    <h4 className="font14 font400 fontOnest mb-0">
                      By appraiser
                    </h4>
                  </div>
                </div>
                <VerticalBar value={4} max={10} />
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="commanStyle boxStyle d-flex align-items-center justify-content-between py-3 px-3">
                <div className="d-flex gap-3">
                  <div className="cardImage position-relative">
                    <img src={Background} alt="Background" />
                    <img
                      src={Hat}
                      alt="Profile"
                      className="Image position-absolute top-50 start-50 translate-middle"
                    />
                  </div>
                  <div>
                    <h4 className="font40 font600 fontOnest mb-0">2.6</h4>
                    <h4 className="font14 font400 fontOnest mb-0">
                      By unit head
                    </h4>
                  </div>
                </div>
                <VerticalBar value={4} max={10} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="m-0 font20 font400 fontOnest mt-3">
          Career development plan
        </h4>
        <div className="commanStyle mt-3">
          <div className="serviceHead padding24">
            <p className="font16 font400 fontOnest mb-0">Service excellence</p>
          </div>

          <div className="categoryMain pb-0">
            <div className="container mt-4">
              <TableResponsive>
                <table className="tableMain">
                  <thead>
                    <tr className="borderBottom">
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight colStrengths"
                      >
                        Strengths
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight colDevelopment"
                      >
                        Development needs
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight colTraining"
                      >
                        Training needs
                      </th>
                      <th
                        scope="col"
                        className="font14 font500 fontOnest textLight colHours"
                      >
                        No. of hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="tableCell">
                        KRA description Lorem ipsum dolor sit amet consectetur.
                        Ultrices sit interdum in pellentesque.
                      </td>
                      <td className="tableCell">
                        Lorem ipsum dolor sit amet consectetur. Ultrices sit
                        interdum in pellentesque. Proin netus amet urna neque
                        tristique cras scelerisque. Sollicitudin non.
                      </td>
                      <td className="tableCell">
                        Lorem ipsum dolor sit amet consectetur. Nulla habitant
                        elit dictumst id convallis adipiscing. Purus eu erat ut
                        id eget. Nec scelerisque tristique viverra ipsum elit
                        iaculis at amet ac. Aliquam ac libero eget.
                      </td>
                      <td className="tableCell">5</td>
                    </tr>
                  </tbody>
                </table>
              </TableResponsive>
            </div>
          </div>
        </div>

        <div>
          <h4 className="m-0 font20 font400 fontOnest mt-3">
            Overall appraisers remark
          </h4>
          <div className="commanStyle padding24 my-3">
            <h4 className="font14 font500 fontOnest textLight colHours">
              Remarks by RM
            </h4>
            <p className="font14 font400 fontOnest mb-0">
              Lorem ipsum dolor sit amet consectetur. Faucibus facilisis
              ullamcorper condimentum in elit erat elementum ultricies. Egestas
              risus interdum viverra suspendisse justo. Lorem dolor lorem amet
              adipiscing enim diam netus varius vel. Risus ac accumsan posuere
              quam. Dui amet consequat erat in a tellus commodo in sed. Nec
              ornare hendrerit ornare egestas nisl. Tempus diam consequat
              parturient diam amet in lacus.
            </p>
          </div>
          <div className="commanStyle padding24 my-3">
            <h4 className="font14 font500 fontOnest textLight colHours">
              Remarks by HR
            </h4>
            <p className="font14 font400 fontOnest mb-0">
              Lorem ipsum dolor sit amet consectetur. Faucibus facilisis
              ullamcorper condimentum in elit erat elementum ultricies. Egestas
              risus interdum viverra suspendisse justo. Lorem dolor lorem amet
              adipiscing enim diam netus varius vel. Risus ac accumsan posuere
              quam. Dui amet consequat erat in a tellus commodo in sed. Nec
              ornare hendrerit ornare egestas nisl. Tempus diam consequat
              parturient diam amet in lacus.
            </p>
          </div>
          <div className="commanStyle padding24 my-3">
            <h4 className="font14 font500 fontOnest textLight colHours">
              Remarks by Unit head
            </h4>
            <p className="font14 font400 fontOnest mb-0">
              Lorem ipsum dolor sit amet consectetur. Faucibus facilisis
              ullamcorper condimentum in elit erat elementum ultricies. Egestas
              risus interdum viverra suspendisse justo. Lorem dolor lorem amet
              adipiscing enim diam netus varius vel. Risus ac accumsan posuere
              quam. Dui amet consequat erat in a tellus commodo in sed. Nec
              ornare hendrerit ornare egestas nisl. Tempus diam consequat
              parturient diam amet in lacus.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
