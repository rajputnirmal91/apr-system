import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'

import AddWhiteIcon from '@project/assets/images/AddIcon.png'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import TableHeading from '@project/Components/TableHeading/TableHeading'
import AddGoalForm from '@project/Pages/Admin/Master/Goals/AddGoalForm'
import GoalList from '@project/Pages/Admin/Master/Goals/GoalsList'
import { useGoalListQuery } from '@project/Store/Api/Admin/Masters/Goals'
import useDebounce from '@project/Utils/debounce'

function Goals() {
  const [goalFormLabel, setGoalFormLabel] = useState<string>('')
  const [showGoalForm, setGoalForm] = useState<boolean>(false)
  const [refetch, setRefetch] = useState<boolean>(false)
  const { refetch: ListRefetch } = useGoalListQuery({
    page: 1,
    limit: 1000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const [cancelPopup, setCancelPopup] = useState<boolean>(false)

  useEffect(() => {
    if (refetch) {
      ListRefetch()
      setRefetch(false)
    }
  }, [refetch, ListRefetch])

  const handleCancelPopupClose = () => {
    setCancelPopup(false)
  }

  const handleGoalFormOpen = (label: string) => {
    setGoalFormLabel(label)
    setGoalForm(true)
  }

  const handleGoalFormClose = () => {
    setGoalForm(false)
    handleCancelPopupClose()
  }

  const handleDataRefetch = () => {
    setRefetch(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <CustomModal
        show={cancelPopup}
        onClose={handleCancelPopupClose}
        onConfirm={handleGoalFormClose}
        image={CloseWhiteIcon}
        modalHeading="Cancel Goal’s"
        modalDesc="Are you sure you want to cancel the goal’s"
        type="Warning"
      />
      <Container fluid className="p-0">
        <Row className="align-items-center mb-4 mt-3 mx-0">
          <Col lg={6} md={12} className="px-0">
            <TableHeading heading="Goals" />
          </Col>
          <Col lg={6} md={12} className="px-0">
            <Row className="gx-2 gy-2">
              <Col lg={9}>
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
                  icon={AddWhiteIcon}
                  label="Add Goal"
                  onClick={() => handleGoalFormOpen('Add new Goal')}
                  style={{ width: '100%', height: '50px' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <AddGoalForm
          show={showGoalForm}
          handleGoalFormOpen={handleGoalFormOpen}
          goalFormLabel={goalFormLabel}
          closeForm={handleGoalFormClose}
          handleDataRefetch={handleDataRefetch}
        />
      </Container>
      <GoalList
        refetchData={refetch}
        search={debouncedSearch}
        showGoalForm={showGoalForm}
      />
    </>
  )
}

export default Goals
