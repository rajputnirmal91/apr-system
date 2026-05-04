import { useEffect, useState } from 'react'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import DeleteBlackIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import EyeIcon from '@project/assets/images/eyeIcon.svg'
import GenericTable from '@project/Components/GenericTable/GenericTable'
import CustomModal from '@project/Components/Modal/Modal'
import CustomPagination from '@project/Components/Pagination/Pagination'
import {
  useDeleteEmailTemplateMutation,
  useEmailTemplateListQuery,
} from '@project/Store/Api/Admin/Masters/EmailTemplate'
import { UpdateEmailTemplate } from '@project/Types/EmailTemplate'
import { htmlToPlainText } from '@project/Utils'

import AddEmailTemplateForm from './AddEmailTemplateForm'

import './EmailTemplate.scss'

type EmailTemplateProps = {
  refetchData: boolean
  setRefetchData: React.Dispatch<React.SetStateAction<boolean>>
  search: string
  emailTemplateForm: boolean
}

function EmailTemplateList({
  refetchData,
  setRefetchData,
  search,
  emailTemplateForm,
}: EmailTemplateProps) {
  const [showEditForm, setEditForm] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<'edit' | 'view'>('edit')
  const [sort, setSort] = useState<string>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortName, setSortName] = useState<string>('template_name')

  const {
    data,
    isLoading: ListLoading,
    isFetching: ListFetching,
    isError: ListError,
    refetch,
  } = useEmailTemplateListQuery({
    page: currentPage,
    limit: itemsPerPage,
    search,
    order_by: sort,
    sort_by: sortName,
  })

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [editData, setEditData] = useState<UpdateEmailTemplate>({
    id: '',
    template_name: '',
    subject: '',
    body: '',
  })
  const [associatePopup, setAssociatePopup] = useState<boolean>(false)
  const [cancelUpdateModal, setCancelUpdateModal] = useState<boolean>(false)
  const [deleteEmailTemplate] = useDeleteEmailTemplateMutation()

  useEffect(() => {
    if (refetchData) {
      refetch()
      setRefetchData(false)
    }
  }, [refetchData, refetch, setRefetchData, sort, sortName, currentPage])

  if (ListError) {
    return <p>Getting error while fetching the data</p>
  }

  const handleEdit = (item: UpdateEmailTemplate) => {
    setEditData({
      id: item.id,
      template_name: item.template_name,
      subject: item.subject,
      body: item.body,
    })
    setFormMode('edit')
    setEditForm(true)
  }

  const handleView = (item: UpdateEmailTemplate) => {
    setEditData({
      id: item.id,
      template_name: item.template_name,
      subject: item.subject,
      body: item.body,
    })
    setFormMode('view')
    setEditForm(true)
  }

  const handleDeleteModalOpen = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleSort = (sortBy: string) => {
    const newOrder = sort === 'asc' ? 'desc' : 'asc'
    setSortName(sortBy)
    setSort(newOrder)
  }

  const handleDeleteModalClose = () => setShowDeleteModal(false)

  const handleDeleteConfirm = () => {
    deleteEmailTemplate({ email_template_id: deleteId })
      .unwrap()
      .then(() => {
        handleDeleteModalClose()
        refetch()
      })
  }

  const handleCancelModalClose = () => setCancelUpdateModal(false)
  const handleAssociateModalClose = () => setAssociatePopup(false)
  const handleEditFormClose = () => {
    setEditForm(false)
    handleCancelModalClose()
  }
  const handleGoalFormClose = () => setEditForm(false)

  return (
    <>
      <div
        className={`userTableMain commonTable email-template ${emailTemplateForm ? 'form-open' : ''}`}
      >
        <GenericTable<UpdateEmailTemplate>
          columns={[
            { key: 's_no', header: 'S.No' },
            { key: 'template_name', header: 'Template Name', sortable: true },
            { key: 'subject', header: 'Subject', sortable: true },
            { key: 'body', header: 'Body' },
            { key: 'action', header: 'Action' },
          ]}
          data={data?.email_templates ?? []}
          isLoading={ListLoading || ListFetching}
          keyExtractor={(item) => item.id}
          onSort={(key) => handleSort(key)}
          emptyState={{
            heading: 'No Email Templates Found',
            description:
              'Please click on the "Add Email Template" button to create a new email template.',
          }}
          renderRow={(item, index) => (
            <tr key={item.id} className="custom-row">
              <td className="custom-td col-name">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="custom-td col-name">
                <span className="ellipsis">{item.template_name}</span>
              </td>
              <td className="custom-td col-subject">
                <span className="ellipsis">{item.subject}</span>
              </td>
              <td className="custom-td col-body">
                <span className="ellipsis">{htmlToPlainText(item.body)}</span>
              </td>
              <td className="custom-td col-action">
                <div className="d-flex gap-2">
                  <button
                    disabled={emailTemplateForm}
                    className="transparentButton"
                    onClick={() => handleView(item)}
                  >
                    <img src={EyeIcon} alt="viewIcon" />
                  </button>
                  <button
                    disabled={emailTemplateForm}
                    className="transparentButton"
                    onClick={() => handleEdit(item)}
                  >
                    <img src={EditIcon} alt="editIcon" />
                  </button>
                  <button
                    disabled={emailTemplateForm}
                    className="transparentButton"
                    onClick={() => handleDeleteModalOpen(item.id)}
                  >
                    <img src={DeleteBlackIcon} alt="deleteIcon" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
        {data?.email_templates && data.email_templates.length > 0 && (
          <CustomPagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalRows={data?.total_count || 0}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      <AddEmailTemplateForm
        show={showEditForm}
        handleEmailTemplateFormOpen={() => setEditForm(true)}
        emailTemplateFormLabel={
          formMode === 'view' ? 'View Email Template' : 'Edit email template'
        }
        closeForm={handleGoalFormClose}
        editData={editData}
        handleDataRefetch={refetch}
        mode={formMode}
      />
      <CustomModal
        show={showDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Delete Email Template"
        modalDesc="Are you sure you want to delete this email template?"
        type="Warning"
        mode="confirm"
      />
      <CustomModal
        show={associatePopup}
        onClose={handleAssociateModalClose}
        image={CloseWhiteIcon}
        type="Warning"
        modalHeading="Email Template delete not possible"
        modalDesc="This email template is already used so can not delete this email template."
        mode="info"
      />
      <CustomModal
        show={cancelUpdateModal}
        onClose={handleCancelModalClose}
        onConfirm={handleEditFormClose}
        image={CloseWhiteIcon}
        type="Warning"
        modalHeading="Cancel email template update"
        modalDesc="Are you sure you want to cancel this email template update?"
        mode="confirm"
      />
    </>
  )
}

export default EmailTemplateList
