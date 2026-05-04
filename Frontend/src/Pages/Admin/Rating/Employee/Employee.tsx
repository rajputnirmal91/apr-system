import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'

import AddWhiteIcon from '@project/assets/images/AddIcon.png'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import TableHeading from '@project/Components/TableHeading/TableHeading'
import EmployeeList from '@project/Pages/Admin/Rating/Employee/EmployeeList'
import EmployeeRatingForm from '@project/Pages/Admin/Rating/Employee/EmployeeRatingForm'
import { useGetRatingListQuery } from '@project/Store/Api/Admin/Ratings/rating'
import useDebounce from '@project/Utils/debounce'

type EmployeeProps = {
  ratingFor: string
  label: string
}

function Employee({ ratingFor, label }: EmployeeProps) {
  const [showRatingForm, setRatingForm] = useState<boolean>(false)
  const [refetch, setRefetch] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const { data, refetch: ListRefetch } = useGetRatingListQuery({
    page: 1,
    limit: 1000,
    search: '',
    rating_for: ratingFor,
  })

  useEffect(() => {
    if (refetch) {
      ListRefetch()
      setRefetch(false)
    }
  }, [refetch, ListRefetch])

  useEffect(() => {
    setSearch('')
  }, [ratingFor])

  const handleDataRefetch = () => {
    setRefetch(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <Container fluid>
        <Row className="align-items-center mb-4 mt-3">
          <Col lg={6}>
            <TableHeading heading={label} />
          </Col>
          <Col lg={6}>
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
              <Col lg={5} xs={12} className="ratingBtn">
                <SharedButton
                  icon={AddWhiteIcon}
                  label="Add rating"
                  onClick={() => setRatingForm(true)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <EmployeeRatingForm
          show={showRatingForm}
          ratingFor={ratingFor}
          closeForm={() => setRatingForm(false)}
          onSuccess={() => {
            handleDataRefetch()
            setRatingForm(false)
          }}
          data={data?.ratings}
        />
      </Container>
      <EmployeeList
        ratingFor={ratingFor}
        refetchData={refetch}
        search={debouncedSearch}
      />
    </>
  )
}

export default Employee
