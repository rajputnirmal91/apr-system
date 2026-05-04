type TableHeadingProps = {
  heading: string
}

function TableHeading({ heading }: TableHeadingProps) {
  return <h5 className="list-title font20 font400 fontOnest">{heading}</h5>
}

export default TableHeading
