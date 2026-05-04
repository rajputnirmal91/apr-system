import PendingIcon from '@project/assets/images/AlertIcon.svg'
import UnpublishedIcon from '@project/assets/images/crossRed.svg'
import DraftIcon from '@project/assets/images/draft.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'

export default function getStatusIcon(status?: string) {
  if (!status) {
    return (
      <span className="me-2 d-inline-flex align-items-center">
        <img src={PendingIcon} alt="Pending" className="me-1" />
        <span>Pending</span>
      </span>
    )
  }

  switch (status.toLowerCase()) {
    case 'received':
    case 'published':
    case 'complete':
    case 'reviewed':
      return <img src={PublishedIcon} alt="Published" className="me-2" />
    case 'draft':
      return <img src={DraftIcon} alt="Draft" className="me-2" />
    case 'pending':
      return <img src={PendingIcon} alt="Pending" className="me-2" />
    case 'unpublished':
      return <img src={UnpublishedIcon} alt="Unpublished" className="me-2" />
    default:
      return <img src={PendingIcon} alt="Pending" className="me-2" />
  }
}
