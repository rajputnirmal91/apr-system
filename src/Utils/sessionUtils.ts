import { SessionItem } from '@project/Types/sessionTypes'

const findOverlappingSessions = (
  startDate: Date,
  endDate: Date,
  sessions: SessionItem[],
  editingId?: string
) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return sessions.filter((session: SessionItem) => {
    if (editingId && session.appraisal_session_id === editingId) return false

    const existingStart = new Date(session.session_start_date)
    const existingEnd = new Date(session.session_end_date)

    return start <= existingEnd && end >= existingStart
  })
}

export default findOverlappingSessions
