import { useEffect, useState } from 'react'

import {
  createDeadlinesFromFormReview,
  createDefaultDeadlines,
  Deadline,
  FormReviewDeadlineDetails,
} from './utils'

const usePedpDeadlines = (formReviewDeadline: FormReviewDeadlineDetails) => {
  const [deadlines, setDeadlines] = useState<Deadline[]>(createDefaultDeadlines)

  useEffect(() => {
    if (!formReviewDeadline) return

    setDeadlines(createDeadlinesFromFormReview(formReviewDeadline))
  }, [formReviewDeadline])

  return { deadlines, setDeadlines }
}

export default usePedpDeadlines
