// components/GoalHeader.tsx

import React from 'react'

import { Col, Row } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'

import AddWhiteIcon from '@project/assets/icons/AddWhiteIcon.svg'
import CloseBlack from '@project/assets/icons/CloseBlack.svg'
// Import your icons
import FilterIcon from '@project/assets/icons/FilterIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'

type ListHeaderProps = {
  search: string
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleManageWeightModal?: () => void
  handleGoalFormOpen: (title: string) => void
  handleGoalFormClose: () => void
  showGoalForm: boolean
}

function ListHeader({
  search,
  handleSearch,
  handleManageWeightModal,
  handleGoalFormOpen,
  handleGoalFormClose,
  showGoalForm,
}: ListHeaderProps) {
  return (
    <Row className="align-items-center mb-4 mt-3">
      <Col lg={3}>
        <h5 className="list-title">Goals</h5>
      </Col>
      <Col lg={9}>
        <Row className="gx-2 gy-2">
          <Col lg={7} xs={12}>
            <CommonInput
              placeholder="Search something..."
              width="100%"
              icon={<FaSearch />}
              value={search}
              onChange={handleSearch}
            />
          </Col>
          <Col lg={3} xs={6}>
            <SharedButton
              icon={FilterIcon}
              label="Manage weightage"
              variant="outline"
              onClick={handleManageWeightModal}
              classname="weightageBtn"
            />
          </Col>
          <Col lg={2} xs={6}>
            {showGoalForm ? (
              <SharedButton
                icon={CloseBlack}
                label="Add Goal"
                variant="outline"
                classname="closeAddForm"
                onClick={handleGoalFormClose}
                style={{ width: '100%' }}
              />
            ) : (
              <SharedButton
                icon={AddWhiteIcon}
                label="Add Goal"
                onClick={() => handleGoalFormOpen('Add new Goal')}
                style={{ width: '100%' }}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ListHeader
