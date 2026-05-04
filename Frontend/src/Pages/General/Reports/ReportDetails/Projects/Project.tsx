import { useEffect } from 'react'

import NoRecordFound from '@project/assets/images/NoRecordFound.svg'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { useProjectMutation } from '@project/Store/Api/General/Reports/reports'
import { Employee } from '@project/Types/reports'

import '@project/Pages/General/Reports/ReportDetails/Projects/Project.scss'

type ProjectProps = {
  employee: Employee
}

function Projects({ employee }: ProjectProps) {
  const [Project, { data, isLoading }] = useProjectMutation()

  useEffect(() => {
    Project({
      employee_lms_id: employee.employee_id,
      employee_user_id: employee.user_id,
    })
  }, [])

  if (isLoading) {
    return (
      <div className="py-2 d-flex align-items-center gap-2">
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
        <p className="mb-0">Loading details ...</p>
      </div>
    )
  }

  return (
    <div className="commonTable my-3">
      {data?.project_details && data?.project_details.length > 0 ? (
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
              {data?.project_details.map((item) => (
                <tr className="custom-row">
                  <td className="custom-td font14 font400">
                    <p className="mb-0 font14 font400 fontOnest textDark">
                      {item.project_name}
                    </p>
                  </td>
                  <td className="custom-td">
                    <p className="mb-0 font14 font400 fontOnest textDark">
                      {item.mode_of_handling || '-'}
                    </p>
                  </td>
                  <td className="custom-td">
                    <p className="mb-0 font14 font400 fontOnest textDark">
                      {item.remarks || ''}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableResponsive>
      ) : (
        <div className="text-center mt-4">
          <img src={NoRecordFound} alt="Not Found" />
        </div>
      )}
    </div>
  )
}

export default Projects
