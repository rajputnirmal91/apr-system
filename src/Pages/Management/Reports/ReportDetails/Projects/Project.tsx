import TableResponsive from '@project/Components/TableResponsive/TableResponsive'

import '@project/Pages/General/Reports/ReportDetails/Projects/Project.scss'

function Projects() {
  return (
    <div className="commonTable">
      <TableResponsive maxHeight="55vh">
        <table className="table custom-table">
          <thead className="custom-thead">
            <tr className="custom-thead-row">
              <th scope="col" className="custom-th font14 font400">
                <div className="d-flex align-items-center gap-2 ">
                  <span className="onest-regular-14">Project</span>
                </div>
              </th>
              <th scope="col" className="custom-th font14 font400">
                <div className="d-flex align-items-center gap-2">
                  <span className="onest-regular-14">Mode of handling</span>
                </div>
              </th>
              <th scope="col" className="custom-th font14 font400">
                <div className="d-flex align-items-center gap-2">
                  <span className="onest-regular-14">Remarks</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="custom-row">
              <td className="custom-td font16 font400">
                <p className="mb-0 font16 font400 fontOnest textDark">name</p>
              </td>
              <td className="custom-td">
                <p className="mb-0 font16 font400 fontOnest textDark">test</p>
              </td>
              <td className="custom-td">
                <p className="mb-0 font16 font400 fontOnest textDark">test</p>
              </td>
            </tr>
          </tbody>
        </table>
      </TableResponsive>
    </div>
  )
}

export default Projects
