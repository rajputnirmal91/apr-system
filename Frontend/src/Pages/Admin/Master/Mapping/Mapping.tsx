import { useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import FilterIcon from '@project/assets/images/Filter.svg'
import MapChain from '@project/assets/images/MapChain.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import TableHeading from '@project/Components/TableHeading/TableHeading'
import TableStructure from '@project/Components/TableStructure/TableStructure'
import { DropdownOption } from '@project/Utils/dummyApiData'
import { adminRoutes } from '@project/Utils/routeNavigation'

import './mapping.scss'

function Mapping() {
  const [select, setSelect] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()

  const tableHead = [
    { name: 'Goal name', sortIcon: false },
    { name: 'Goal type', sortIcon: true },
    { name: 'Goal weightage', sortIcon: true },
    { name: 'Action' },
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <Container fluid>
        <Row className="align-items-center mb-4 mt-3">
          <Col lg={3} md={12} className="px-0">
            <TableHeading heading="Mapped Goals" />
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={3}>
                <CustomDropdown
                  id="Employee eligibility"
                  options={DropdownOption}
                  placeholder="Select eligibility"
                  append={document.body}
                  value={String(select)}
                  onChange={(e: { target: { value: string | number } }) =>
                    setSelect(String(e.target.value))
                  }
                />
              </Col>
              <Col lg={3}>
                <CommonInput
                  className="common-input"
                  placeholder="Search"
                  width="100%"
                  icon={<FaSearch />}
                  value={search}
                  onChange={handleSearch}
                />
              </Col>
              <Col lg={3}>
                <SharedButton
                  icon={FilterIcon}
                  label="Manage weightage"
                  variant="outline"
                  // onClick={() => console.log('manage weightage')}
                  classname="weightageBtn"
                />
              </Col>
              <Col lg={3}>
                <SharedButton
                  icon={MapChain}
                  label="Mapping"
                  variant="primary"
                  onClick={() => navigate(adminRoutes.goalMapping)}
                  classname="mappingBtn"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <TableStructure tableHead={tableHead}>
        <tr>
          <td>Data1</td>
          <td>Data1</td>
          <td>Data1</td>
          <td>Data1</td>
        </tr>
      </TableStructure>
    </>
  )
}

export default Mapping
