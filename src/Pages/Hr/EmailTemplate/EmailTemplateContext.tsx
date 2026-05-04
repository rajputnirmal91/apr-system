import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useGetEmailLogByIdQuery,
  useGetHrEmailTemplatesQuery,
} from '@project/Store/Api/Hr/HrEmailTemplateApi'

import { EmailTemplateOption } from './emailTemplate.mock'

export type EmailStep = 1 | 2 | 3

interface EmailTemplateContextValue {
  step: EmailStep
  selectedTemplate: EmailTemplateOption | null
  subject: string
  body: string
  selectedUsers: string[]
  isSending: boolean
  isSent: boolean
  isSavingDraft: boolean
  draftId: string | null
  isRestoring: boolean
  setStep: (step: EmailStep) => void
  setSelectedTemplate: (t: EmailTemplateOption | null) => void
  setSubject: (s: string) => void
  setBody: (b: string) => void
  setSelectedUsers: (users: string[]) => void
  setIsSending: (v: boolean) => void
  setIsSent: (v: boolean) => void
  setIsSavingDraft: (v: boolean) => void
  setDraftId: (id: string | null) => void
  resetFlow: () => void
}

const EmailTemplateContext = createContext<EmailTemplateContextValue | null>(null)

interface EmailTemplateProviderProps {
  children: React.ReactNode
  draftId?: string
}

export function EmailTemplateProvider({
  children,
  draftId: initialDraftId,
}: EmailTemplateProviderProps) {
  const [step, setStep] = useState<EmailStep>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateOption | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(initialDraftId ?? null)
  const [templateRestored, setTemplateRestored] = useState(false)

  // Only restore template here — recipient resolution happens in StepUserSelect
  const isDraftPending = !!draftId && !templateRestored

  const { data: draftLog } = useGetEmailLogByIdQuery(
    { id: draftId! },
    { skip: !isDraftPending },
  )

  const { data: templatesData } = useGetHrEmailTemplatesQuery(
    { page: 1, limit: 100, search: '', order_by: 'asc', sort_by: 'template_name' },
    { skip: !isDraftPending },
  )

  // Restore template selection from draft
  useEffect(() => {
    if (templateRestored) return

    const templates = templatesData?.email_templates
    if (!draftLog?.email_template_id || !templates) return

    const matched = templates.find((t) => t.id === draftLog.email_template_id)
    if (matched) {
      setSelectedTemplate({
        value: matched.id,
        label: matched.template_name,
        subject: matched.subject,
        body: matched.body,
      })
      setSubject(matched.subject)
      setBody(matched.body)
    }

    setTemplateRestored(true)
  }, [draftLog, templatesData, templateRestored])

  const resetFlow = useCallback(() => {
    setStep(1)
    setSelectedTemplate(null)
    setSubject('')
    setBody('')
    setSelectedUsers([])
    setIsSent(false)
    setIsSending(false)
    setDraftId(null)
    setTemplateRestored(false)
  }, [])

  const value = useMemo<EmailTemplateContextValue>(
    () => ({
      step,
      selectedTemplate,
      subject,
      body,
      selectedUsers,
      isSending,
      isSent,
      isSavingDraft,
      draftId,
      isRestoring: isDraftPending,
      setStep,
      setSelectedTemplate,
      setSubject,
      setBody,
      setSelectedUsers,
      setIsSending,
      setIsSent,
      setIsSavingDraft,
      setDraftId,
      resetFlow,
    }),
    [
      step,
      selectedTemplate,
      subject,
      body,
      selectedUsers,
      isSending,
      isSent,
      isSavingDraft,
      draftId,
      isDraftPending,
      resetFlow,
    ],
  )

  return (
    <EmailTemplateContext.Provider value={value}>
      {children}
    </EmailTemplateContext.Provider>
  )
}

export function useEmailTemplate() {
  const ctx = useContext(EmailTemplateContext)
  if (!ctx) throw new Error('useEmailTemplate must be used inside EmailTemplateProvider')
  return ctx
}
 