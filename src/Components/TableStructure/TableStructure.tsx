import React from 'react'

import SortArrow from '@project/assets/images/sortArrow.svg'

import './TableStructure.scss'

type TableHead = {
  name: string
  sortIcon?: boolean
}

type TableStructureProps = {
  tableHead: TableHead[]
  handleSort?: (sortBy: string) => void
  children?: React.ReactNode
}

function TableStructure({
  tableHead,
  handleSort,
  children,
}: TableStructureProps) {
  const handleSortClick = (name: string) => {
    handleSort?.(name)
  }

  return (
    <table className="table custom-table commonTable">
      <thead className="custom-thead">
        <tr className="custom-thead-row">
          {tableHead.map((head: TableHead) => (
            <th scope="col" className="custom-th font14 font400">
              <div className="d-flex align-items-center gap-2 pb-2">
                <span className="onest-regular-14">{head.name}</span>
                {head.sortIcon && (
                  <button
                    className="transparentButton sortButton"
                    onClick={() => head.sortIcon && handleSortClick(head.name)}
                  >
                    <img src={SortArrow} alt="sortIcon" className="sortIcon" />
                  </button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

type TableCellDataProps = {
  children?: React.ReactNode
}

function TableCellData({ children }: TableCellDataProps) {
  return (
    <td className="custom-td font16 font400">
      <p className="mb-0 font16 font400 fontOnest textDark">{children}</p>
    </td>
  )
}

export { TableCellData }

export default TableStructure

// How it can be used in the component

// const tableHead = [
//     { name: 'Goal Name', sortIcon: false, handleSort: handleSort},
//     { name: 'Goal Type', sortIcon: true, handleSort: handleSort},
//     { name: 'Goal Weightage', sortIcon: true, handleSort: handleSort},
//     { name: 'Action'}
//   ]
// <TableStructure tableHead={tableHead} handleSort={handleSort1}>
//  tableData
// </TableStructure>
