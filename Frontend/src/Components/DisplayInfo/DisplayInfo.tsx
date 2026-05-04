type DisplayInfoProps = {
  name: string
  value: string
  width?: string
}

function DisplayInfo({ name, value, width }: DisplayInfoProps) {
  return (
    <div style={{ width }} className="pb-lg-none pb-2">
      <p className="m-0 textLight font14 font400 fontOnest pb-lg-2">{name}</p>
      <div className="d-flex gap-2">
        <p className="m-0">{value}</p>
      </div>
    </div>
  )
}

export default DisplayInfo
