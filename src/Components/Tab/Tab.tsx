import { useState } from 'react'

import { Container, Nav } from 'react-bootstrap'

import '@project/Components/Tab/Tab.scss'

type TabItem = {
  key: string
  label: string
  icon: {
    active: string
    inactive: string
  }
  content: React.ReactNode
}

type SimpleTabsProps = {
  tabs: TabItem[]
  className?: string
}

export default function Tab({ tabs, className }: SimpleTabsProps) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key)

  return (
    <Container fluid className={`simpleTabs ${className || ''}`}>
      <Nav
        variant="tabs"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k || '')}
        className="bg-white p-2"
      >
        {tabs.map((tab) => (
          <Nav.Item key={tab.key}>
            <Nav.Link eventKey={tab.key} className="d-flex align-items-center">
              <img
                src={
                  activeKey === tab.key ? tab.icon.active : tab.icon.inactive
                }
                alt={`${tab.label} icon`}
                className="tab-icon me-2"
              />
              <span
                className={
                  activeKey === tab.key
                    ? 'fontOnest font600 font14'
                    : 'fontOnest font400 font14'
                }
              >
                {tab.label}
              </span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <div className="tab-content-wrapper">
        {tabs.find((tab) => tab.key === activeKey)?.content}
      </div>
    </Container>
  )
}
