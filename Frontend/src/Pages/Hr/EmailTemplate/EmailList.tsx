import DraftEmailList from './DraftEmailList'
import SentEmailList from './SentEmailList'

type EmailListProps = {
  type: 'sent' | 'draft'
}

function EmailList({ type }: EmailListProps) {
  if (type === 'sent') return <SentEmailList />
  return <DraftEmailList />
}

export default EmailList
