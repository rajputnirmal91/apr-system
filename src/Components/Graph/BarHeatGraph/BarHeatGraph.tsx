import { MouseEvent, useState } from 'react'

import { ComposedChart, Rectangle, ResponsiveContainer, YAxis } from 'recharts'

import DarkBlue from '@project/assets/images/DarkBlue.svg'
import LightBlue from '@project/assets/images/LightBlue.svg'

import '@project/Components/Graph/BarHeatGraph/BarHeadGraph.scss'

interface CriteriaData {
  criteria: string
  appraisee: number
  appraiser: number
}

const criteriaData: CriteriaData[] = [
  { criteria: 'Criteria 1', appraisee: 4, appraiser: 3 },
  { criteria: 'Criteria 2', appraisee: 5, appraiser: 4 },
  { criteria: 'Criteria 3', appraisee: 3, appraiser: 3 },
  { criteria: 'Criteria 4', appraisee: 2, appraiser: 3 },
  { criteria: 'Criteria 5', appraisee: 4, appraiser: 3 },
  { criteria: 'Criteria 6', appraisee: 4, appraiser: 2 },
  { criteria: 'Criteria 7', appraisee: 2, appraiser: 4 },
]

const opacities = [1, 0.85, 0.7, 0.55, 0.4]

interface HoverInfo {
  x: number
  y: number
  criteria: string
  appraisee: number
  appraiser: number
}

interface SegmentedBarProps {
  x: number
  y: number
  width: number
  height: number
  value: number
  baseColor: string
  borderRadius: number
  criteria: string
  appraisee: number
  appraiser: number
  onHover?: (info: HoverInfo) => void
  onLeave?: () => void
}

function SegmentedBar({
  x,
  y,
  width,
  height,
  value,
  baseColor,
  borderRadius,
  criteria,
  appraisee,
  appraiser,
  onHover,
  onLeave,
}: SegmentedBarProps) {
  const segments = 5
  const blockHeight = height / segments

  return (
    <>
      {Array.from({ length: segments }).map((_, i) => {
        const level = segments - i
        const isFilled = level <= value
        const color = isFilled
          ? `rgba(${baseColor},${opacities[i]})`
          : 'rgba(243, 250, 252, 0.5)'

        return (
          <Rectangle
            key={`${criteria}-level-${level}`}
            x={x}
            y={y + i * blockHeight}
            width={width}
            height={blockHeight - 4}
            fill={color}
            stroke="#fff"
            rx={borderRadius}
            ry={borderRadius}
            onMouseEnter={(e: MouseEvent<SVGRectElement>) =>
              onHover?.({
                x: e.clientX,
                y: e.clientY,
                criteria,
                appraisee,
                appraiser,
              })
            }
            onMouseLeave={onLeave}
            radius={borderRadius}
          />
        )
      })}
    </>
  )
}

export default function HeatmapChart() {
  const chartHeight = 200
  const barWidth = 52
  const gapBetweenBars = 8
  const gapBetweenCriteria = 40
  const startY = 50

  const totalBars = criteriaData.length * 2
  const totalWidth =
    totalBars * barWidth +
    (criteriaData.length - 1) * (gapBetweenBars + gapBetweenCriteria) +
    90

  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

  return (
    <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
      <div style={{ minWidth: totalWidth, height: 300 }}>
        <ResponsiveContainer width="100%" height={300} className="graph">
          <ComposedChart
            data={criteriaData}
            margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          >
            <YAxis type="number" domain={[1, 5]} hide />

            {[1, 2, 3, 4, 5].map((num) => {
              const blockHeight = chartHeight / 5
              return (
                <text
                  key={`y-${num}`}
                  x={40}
                  y={
                    startY +
                    chartHeight -
                    blockHeight * (num - 1) -
                    blockHeight / 2
                  }
                  textAnchor="end"
                  fill="#6b6b6b"
                  fontSize={12}
                  className="font14 font400 fontOnest textLight"
                >
                  {num}
                </text>
              )
            })}

            {criteriaData.map((entry) => {
              const baseX =
                60 +
                criteriaData.indexOf(entry) *
                  (barWidth * 2 + gapBetweenBars + gapBetweenCriteria)

              return (
                <g key={entry.criteria}>
                  <SegmentedBar
                    x={baseX}
                    y={startY}
                    width={barWidth}
                    height={chartHeight}
                    value={entry.appraisee}
                    baseColor="1,97,118"
                    borderRadius={4}
                    criteria={entry.criteria}
                    appraisee={entry.appraisee}
                    appraiser={entry.appraiser}
                    onHover={(pos) => setHoverInfo(pos)}
                    onLeave={() => setHoverInfo(null)}
                  />

                  <SegmentedBar
                    x={baseX + barWidth + gapBetweenBars}
                    y={startY}
                    width={barWidth}
                    height={chartHeight}
                    value={entry.appraiser}
                    baseColor="23,159,189"
                    borderRadius={4}
                    criteria={entry.criteria}
                    appraisee={entry.appraisee}
                    appraiser={entry.appraiser}
                    onHover={(pos) => setHoverInfo(pos)}
                    onLeave={() => setHoverInfo(null)}
                  />

                  <text
                    x={baseX + barWidth + gapBetweenBars / 2}
                    y={startY + chartHeight + 25}
                    textAnchor="middle"
                    fill="#6b6b6b"
                    fontSize={12}
                    className="font14 font400 fontOnest textLight"
                  >
                    {entry.criteria}
                  </text>
                </g>
              )
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {hoverInfo && (
        <div
          style={{
            position: 'fixed',
            top: hoverInfo.y - 50,
            left: hoverInfo.x + 10,
            width: 150,
            padding: 12,
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            borderRadius: 10,
            border: '1px solid var(--primary)',
            zIndex: 9999,
            pointerEvents: 'none',
            color: '#000',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <h4 className="font16 font400 fontOnest mb-2">
            {hoverInfo.criteria}
          </h4>
          <div className="d-flex justify-content-between mb-1">
            <div className="d-flex gap-2">
              <img src={DarkBlue} alt="darkBlueBox" />
              <span className="font14 font400 fontOnest">Appraisee</span>
            </div>
            <div>
              <span className="font16 font600 fontOnest">
                {hoverInfo.appraisee}
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-2">
              <img src={LightBlue} alt="lightBlueBox" />
              <span className="font14 font400 fontOnest">Appraiser</span>
            </div>
            <div>
              <span className="font16 font600 fontOnest">
                {hoverInfo.appraiser}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
