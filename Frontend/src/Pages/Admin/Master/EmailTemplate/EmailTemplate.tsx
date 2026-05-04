import { useState } from 'react'

import { Container } from 'react-bootstrap'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CustomModal from '@project/Components/Modal/Modal'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import useDebounce from '@project/Utils/debounce'

import AddEmailTemplateForm from './AddEmailTemplateForm'
import EmailTemplateList from './EmailTemplateList'

function EmailTemplate() {
  const [search, setSearch] = useState<string>('')
  const [emailTemplateFormLabel, setEmailTemplateFormLabel] =
    useState<string>('')
  const [showEmailTemplateForm, setEmailTemplateForm] = useState<boolean>(false)

  const [refetch, setRefetch] = useState<boolean>(false)
  const debouncedSearch = useDebounce(search, 500)

  // const [emailTemplateForm, setEmailTemplateFormState] =
  //   useState<boolean>(false)

  const [cancelPopup, setCancelPopup] = useState<boolean>(false)

  const handleEmailTemplateFormOpen = (label: string) => {
    setEmailTemplateFormLabel(label)
    setEmailTemplateForm(true)
  }

  const handleDataRefetch = () => {
    setRefetch(true)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleCancelPopupClose = () => {
    setCancelPopup(false)
  }

  const handleEmailTemplateFormClose = () => {
    setEmailTemplateForm(false)
    handleCancelPopupClose()
  }

  return (
    <div className="emailTemplateContainer">
      <Container fluid className="p-0">
        <TopSearch
          title="Email Template"
          searchPlaceholder="Search"
          searchValue={search}
          onSearchChange={(value) => handleSearch(value)}
          buttonLabel="Add Email Template"
          isToggled={false}
          onToggle={() => handleEmailTemplateFormOpen('Add Email Template')}
        />
        <AddEmailTemplateForm
          show={showEmailTemplateForm}
          handleEmailTemplateFormOpen={handleEmailTemplateFormOpen}
          emailTemplateFormLabel={emailTemplateFormLabel}
          closeForm={handleEmailTemplateFormClose}
          handleDataRefetch={handleDataRefetch}
          mode="add"
        />
      </Container>

      <EmailTemplateList
        refetchData={refetch}
        setRefetchData={setRefetch}
        search={debouncedSearch}
        emailTemplateForm={false}
      />

      <CustomModal
        show={cancelPopup}
        onClose={handleCancelPopupClose}
        onConfirm={handleEmailTemplateFormClose}
        image={CloseWhiteIcon}
        modalHeading="Cancel Email Template"
        modalDesc="Are you sure you want to cancel the email template?"
        type="Warning"
      />
    </div>
  )
}

export default EmailTemplate
