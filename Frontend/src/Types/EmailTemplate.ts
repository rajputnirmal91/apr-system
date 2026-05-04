type EmailTemplateListRequest = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
}

interface EmailTemplateResponse {
  message: string
  total_count: number
  page: number
  email_templates: {
    id: string
    template_name: string
    subject: string
    body: string
  }[]
}

type UpdateEmailTemplate = {
  id: string
  template_name: string
  subject: string
  body: string
}

type AddEmailTemplateRequest = {
  template_name: string
  subject: string
  body: string
}

type UpdateEmailTemplateRequest = {
  id: string
  template_name: string
  subject: string
  body: string
}

type DeleteEmailTemplateRequest = {
  email_template_id: string
}

type DeleteEmailTemplateResponse = {
  success: boolean
  message: string
}

type CheckDuplicateEmailTemplateRequest = {
  id?: string
  template_name: string
}

type CheckDuplicateEmailTemplateResponse = {
  message: string
}
export type {
  AddEmailTemplateRequest,
  CheckDuplicateEmailTemplateRequest,
  CheckDuplicateEmailTemplateResponse,
  DeleteEmailTemplateRequest,
  DeleteEmailTemplateResponse,
  EmailTemplateListRequest,
  EmailTemplateResponse,
  UpdateEmailTemplate,
  UpdateEmailTemplateRequest,
}
