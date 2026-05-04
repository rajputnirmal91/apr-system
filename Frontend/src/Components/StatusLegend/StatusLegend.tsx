import getStatusIcon from '@project/Common/GetStatusIcon'
import './StatusLegend.scss'

export interface LegendItem {
  label: string
  status: string
}

export interface LegendGroup {
  label: string
  items: LegendItem[]
}

interface StatusLegendProps {
  groups: LegendGroup[]
  className?: string
}

export default function StatusLegend({ groups, className }: StatusLegendProps) {
  return (
    <div className={`bottomIconInformation ${className ?? ''}`.trim()}>
      <div className="d-flex gap-5">
        {groups.map((group, gi) => (
          <>
            {gi > 0 && <div key={`divider-${gi}`} className="verticalDivider" />}
            <div key={group.label} className="d-flex gap-3 align-items-center">
              <h6 className="mb-0 font16 font500 fontOnest">{group.label}</h6> -
              {group.items.map((item) => (
                <div key={item.label} className="d-flex align-items-center gap-2">
                  <span>{item.label}</span>
                  {getStatusIcon(item.status)}
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  )
}
