import { useState } from 'react'

import Container from 'react-bootstrap/Container'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CustomModal from '@project/Components/Modal/Modal'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import KraForm from '@project/Pages/Admin/Master/Kra/KraForm'
import KraList from '@project/Pages/Admin/Master/Kra/KraList'
import { useGetKraListQuery } from '@project/Store/Api/Admin/Kra'
import useDebounce from '@project/Utils/debounce'

import '@project/Pages/Admin/Master/Kra/kra.scss'

function Kra() {
  const [showKraForm, setKraForm] = useState<boolean>(false)
  const [kraFormLabel, setKraFormLabel] = useState<string>('Add new KRA')
  const [search, setSearch] = useState<string>('')
  const [cancelPopup, setCancelPopup] = useState<boolean>(false)
  const debouncedSearch = useDebounce(search, 500)
  const { data, isLoading, isError } = useGetKraListQuery({
    page: 1,
    limit: 1000,
    search: debouncedSearch,
  })

  const hasKraData = isLoading || isError ? true : (data?.kras?.length ?? 0) > 0

  const handleCancelPopupClose = () => {
    setCancelPopup(false)
  }

  const handleKraFormOpen = (label: string) => {
    setKraFormLabel(label)
    setKraForm(true)
  }

  const handleKraFormClose = () => {
    setKraForm(false)
    handleCancelPopupClose()
  }

  return (
    <div className="page-container">
      <CustomModal
        show={cancelPopup}
        onClose={handleCancelPopupClose}
        onConfirm={handleKraFormClose}
        image={CloseWhiteIcon}
        modalHeading="Cancel KRA"
        modalDesc="Are you sure you want to cancel the KRA"
        type="Warning"
      />
      <div className="fixed-header">
        <Container fluid>
          <TopSearch
            title="KRAs"
            searchValue={search}
            onSearchChange={(value) => setSearch(value)}
            disabled={!hasKraData && search.trim() === ''}
            buttonLabel="Add KRA"
            onToggle={() => handleKraFormOpen('Add new KRA')}
          />
        </Container>
      </div>
      <div className="scrollable-content">
        <Container fluid>
          <KraForm
            show={showKraForm}
            kraFormLabel={kraFormLabel}
            closeForm={handleKraFormClose}
          />
          <KraList search={search} showKraForm={showKraForm} />
        </Container>
      </div>
    </div>
  )
}

export default Kra
