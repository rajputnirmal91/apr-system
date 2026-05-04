import { useEffect, useMemo, useRef, useState } from 'react'

import { Col, Modal, Row } from 'react-bootstrap'
import ReactQuill, { Quill } from 'react-quill'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useAddEmailTemplateMutation,
  useCheckDuplicateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
} from '@project/Store/Api/Admin/Masters/EmailTemplate/emailTemplateApi'
import {
  AddEmailTemplateRequest,
  UpdateEmailTemplate,
} from '@project/Types/EmailTemplate'
import useDebounce from '@project/Utils/debounce'
import { htmlToPlainText } from '@project/Utils/utility'

import './AddEmailTemplateForm.scss'
import './EmailTemplate.scss'
import 'react-quill/dist/quill.snow.css'

type EmailTemplateFormProps = {
  show: boolean
  handleEmailTemplateFormOpen: (label: string) => void
  emailTemplateFormLabel: string
  closeForm: () => void
  handleDataRefetch: () => void
  editData?: UpdateEmailTemplate
  mode?: 'add' | 'edit' | 'view'
}

const limits: Record<keyof AddEmailTemplateRequest, number> = {
  template_name: 100,
  subject: 250,
  body: 5000,
}

const tags = [
  '{{employee_name}}',
  '{{appraisal_session}}',
  '{{pedp_publishDate}}',
  '{{employee_submitDate}}',
  '{{hr_submitDate}}',
  '{{irm_submitDate}}',
  '{{srm_submitDate}}',
  '{{director_submitDate}}',
  '{{unitHead_submitDate}}',
  '{{management_submitDate}}',
]

type TagRange = { start: number; end: number; tag: string }

const getTagRanges = (value: string): TagRange[] => {
  const ranges: TagRange[] = []

  tags.forEach((tag) => {
    let idx = 0
    while (idx < value.length) {
      const found = value.indexOf(tag, idx)
      if (found === -1) break
      ranges.push({ start: found, end: found + tag.length, tag })
      idx = found + tag.length
    }
  })

  return ranges.sort((a, b) => a.start - b.start)
}

const getIntersectingRanges = (
  ranges: TagRange[],
  start: number,
  end: number
) => ranges.filter((r) => Math.max(start, r.start) < Math.min(end, r.end))

const getRangeAtPosition = (
  ranges: TagRange[],
  pos: number,
  mode: 'backspace' | 'delete' | 'edit'
) => {
  if (mode === 'backspace') {
    return ranges.find((r) => pos > r.start && pos <= r.end)
  }
  if (mode === 'delete') {
    return ranges.find((r) => pos >= r.start && pos < r.end)
  }
  return ranges.find((r) => pos > r.start && pos < r.end)
}

const clampToTagBoundary = (ranges: TagRange[], pos: number) => {
  const hit = getRangeAtPosition(ranges, pos, 'edit')
  if (!hit) return pos
  return pos - hit.start < hit.end - pos ? hit.start : hit.end
}

const Inline = Quill.import('blots/inline')
const Delta = Quill.import('delta')

class TagBlot extends Inline {
  static blotName = 'tag'

  static tagName = 'span'

  static className = 'quill-tag'

  static create(value: string) {
    const node = super.create() as HTMLSpanElement
    node.setAttribute('data-tag', value)
    node.setAttribute('contenteditable', 'false')
    node.setAttribute('spellcheck', 'false')
    node.textContent = value
    return node
  }

  static formats(node: HTMLElement) {
    return node.getAttribute('data-tag') || undefined
  }
}

const quillRegistry = Quill as unknown as {
  imports?: Record<string, unknown>
  register: (path: unknown, target?: unknown) => void
}

if (!quillRegistry.imports?.['formats/tag']) {
  quillRegistry.register(TagBlot)
}

const getTrimmedValue = (value: string) => value.trim()

function AddEmailTemplateForm({
  show,
  handleEmailTemplateFormOpen,
  emailTemplateFormLabel,
  closeForm,
  handleDataRefetch,
  editData,
  mode = 'add',
}: EmailTemplateFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const quillRef = useRef<ReactQuill | null>(null)
  const isViewMode = mode === 'view'

  const [formData, setFormData] = useState<AddEmailTemplateRequest>({
    template_name: '',
    subject: '',
    body: '',
  })

  const [errors, setErrors] = useState<{
    template_name?: string
    subject?: string
    body?: string
  }>({})

  const [cancelForm, setCancelForm] = useState<boolean>(false)

  const [createEmailTemplate] = useAddEmailTemplateMutation()
  const [updateEmailTemplate] = useUpdateEmailTemplateMutation()
  const [checkDuplicateEmailTemplate] = useCheckDuplicateEmailTemplateMutation()
  const formLabel = isViewMode
    ? emailTemplateFormLabel || 'View Details'
    : emailTemplateFormLabel

  const debouncedTemplateName = useDebounce(formData.template_name, 800)
  const quillModules = useMemo(() => {
    const baseModules: {
      toolbar?: boolean
      clipboard: { matchers: [string, (node: Node) => unknown][] }
    } = {
      clipboard: {
        matchers: [
          [
            'span.quill-tag',
            (node) => {
              if (!(node instanceof HTMLElement)) return new Delta()
              const tagValue =
                node.getAttribute('data-tag') || node.textContent || ''
              return new Delta().insert(tagValue, { tag: tagValue })
            },
          ],
        ],
      },
    }

    if (isViewMode) {
      baseModules.toolbar = false
    }

    return baseModules
  }, [isViewMode])

  useEffect(() => {
    if (isViewMode) return
    if (!debouncedTemplateName?.trim()) return

    const trimmedTemplateName = getTrimmedValue(debouncedTemplateName)

    if (
      editData &&
      trimmedTemplateName.toLowerCase() ===
      editData.template_name?.trim().toLowerCase()
    ) {
      setErrors((prev) => ({
        ...prev,
        template_name: '',
      }))
      return
    }

    const checkTemplateName = async () => {
      try {
        const res = await checkDuplicateEmailTemplate({
          template_name: trimmedTemplateName,
        }).unwrap()

        if (res?.message === 'Template name already exists') {
          setErrors((prev) => ({
            ...prev,
            template_name: 'This template name is already in use',
          }))
        } else {
          setErrors((prev) => ({
            ...prev,
            template_name: '',
          }))
        }
      } catch (err) {
        console.error('Template name check failed', err)
      }
    }

    checkTemplateName()
  }, [debouncedTemplateName, checkDuplicateEmailTemplate, isViewMode, editData])

  useEffect(() => {
    if (editData && show) {
      setFormData({
        template_name: editData.template_name,
        subject: editData.subject,
        body: editData.body,
      })
    }
  }, [editData, show])

  useEffect(() => {
    if (isViewMode && show) {
      setErrors({})
    }
  }, [isViewMode, show])

  const resetForm = () => {
    setFormData({
      template_name: '',
      subject: '',
      body: '',
    })

    setErrors({})
    setCancelForm(false)
  }

  const handleConfirm = () => {
    resetForm()
    closeForm()
    setCancelForm(false)
  }

  const handleCancelFormClose = () => {
    setCancelForm(false)
    if (handleEmailTemplateFormOpen)
      handleEmailTemplateFormOpen('Add Email Template')
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (isViewMode) return
    const { name, value } = e.target

    const field = name as keyof AddEmailTemplateRequest
    const trimmedValue = getTrimmedValue(value)

    // Check limit
    if (limits[field] && trimmedValue.length > limits[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: `Maximum ${limits[field]} characters allowed`,
      }))
      return
    }
    // Clear error when valid
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleQuillChange = (value: string) => {
    if (isViewMode) return
    setFormData((prev) => ({
      ...prev,
      body: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      if (editData?.id) {
        await updateEmailTemplate({
          id: editData.id,
          template_name: formData.template_name,
          subject: formData.subject,
          body: formData.body,
        }).unwrap()
      } else {
        await createEmailTemplate({
          template_name: formData.template_name,
          subject: formData.subject,
          body: formData.body,
        }).unwrap()
      }

      handleDataRefetch()
      resetForm()
      closeForm()
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const saveEmailTemplate = () => {
    const { template_name, subject, body } = formData
    const newErrors: {
      template_name?: string
      subject?: string
      body?: string
    } = {}

    const trimmedTemplateName = getTrimmedValue(template_name)
    const trimmedSubject = getTrimmedValue(subject)
    const trimmedBodyText = getTrimmedValue(htmlToPlainText(body))

    if (!trimmedTemplateName) {
      newErrors.template_name = 'Template name is required'
    }
    if (!trimmedSubject) {
      newErrors.subject = 'Subject is required'
    }
    if (!trimmedBodyText) {
      newErrors.body = 'Body is required'
    }
    if (errors.template_name === 'This template name is already in use') {
      newErrors.template_name = errors.template_name
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      handleSubmit()
    }
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLSpanElement>,
    tag: string
  ) => {
    e.dataTransfer.setData('text/plain', tag)
  }

  const handleDragOver = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    if (isViewMode) return
    e.preventDefault()

    const tag = e.dataTransfer.getData('text/plain')

    const input = inputRef.current

    if (!input || !tag) return

    // Remove browser text selection
    window.getSelection()?.removeAllRanges()

    const ranges = getTagRanges(input.value)
    const rawStart = input.selectionStart ?? input.value.length
    const rawEnd = input.selectionEnd ?? input.value.length
    const start = clampToTagBoundary(ranges, rawStart)
    const end = clampToTagBoundary(ranges, rawEnd)

    const currentValue = formData.subject || ''
    const newValue = `${currentValue.slice(0, start) + tag} ${currentValue.slice(end)}`
    const nextLength = getTrimmedValue(newValue).length

    if (nextLength > limits.subject) {
      setErrors((prev) => ({
        ...prev,
        subject: `Maximum ${limits.subject} characters allowed`,
      }))
      return
    }

    setErrors((prev) => ({
      ...prev,
      subject: '',
    }))

    setFormData((prev) => ({
      ...prev,
      subject: newValue,
    }))

    // Restore cursor after render
    requestAnimationFrame(() => {
      input.focus()

      const pos = start + tag.length + 1

      input.setSelectionRange(pos, pos)
    })
  }

  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isViewMode) return
    const input = e.currentTarget
    const value = formData.subject
    const ranges = getTagRanges(value)

    if (!ranges.length) return

    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    const hasSelection = start !== end

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const keyMode = e.key === 'Backspace' ? 'backspace' : 'delete'
      const intersecting = hasSelection
        ? getIntersectingRanges(ranges, start, end)
        : []
      const hit = hasSelection
        ? intersecting[0]
        : getRangeAtPosition(ranges, start, keyMode)

      if (!hit && intersecting.length === 0) return

      e.preventDefault()

      const deleteStart = hasSelection
        ? Math.min(start, ...intersecting.map((r) => r.start))
        : (hit?.start ?? start)
      const deleteEnd = hasSelection
        ? Math.max(end, ...intersecting.map((r) => r.end))
        : (hit?.end ?? end)

      const newValue = value.slice(0, deleteStart) + value.slice(deleteEnd)

      setFormData((prev) => ({
        ...prev,
        subject: newValue,
      }))

      requestAnimationFrame(() => {
        input.focus()
        input.setSelectionRange(deleteStart, deleteStart)
      })
      return
    }

    const insideTag =
      getRangeAtPosition(ranges, start, 'edit') ||
      getRangeAtPosition(ranges, end, 'edit')

    if (insideTag) {
      e.preventDefault()
      const pos = clampToTagBoundary(ranges, start)
      requestAnimationFrame(() => {
        input.setSelectionRange(pos, pos)
      })
    }
  }

  const normalizeSubjectSelection = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    if (isViewMode) return
    const input = e.currentTarget
    const ranges = getTagRanges(input.value)
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0

    if (!ranges.length) return

    if (start === end) {
      const pos = clampToTagBoundary(ranges, start)
      if (pos !== start) {
        input.setSelectionRange(pos, pos)
      }
      return
    }

    const intersecting = getIntersectingRanges(ranges, start, end)
    if (intersecting.length) {
      const newStart = Math.min(start, ...intersecting.map((r) => r.start))
      const newEnd = Math.max(end, ...intersecting.map((r) => r.end))
      input.setSelectionRange(newStart, newEnd)
    }
  }

  const handleSubjectPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isViewMode) return
    const input = e.currentTarget
    const ranges = getTagRanges(input.value)
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    const intersects = getIntersectingRanges(ranges, start, end)
    if (intersects.length || getRangeAtPosition(ranges, start, 'edit')) {
      e.preventDefault()
    }
  }

  const handleQuillDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isViewMode) return
    e.preventDefault()
    e.stopPropagation()

    const tag = e.dataTransfer.getData('text/plain')
    e.dataTransfer.dropEffect = 'none'

    const editor = quillRef.current?.getEditor()

    if (!editor || !tag) return

    window.getSelection()?.removeAllRanges()

    let range = editor.getSelection()

    if (!range) {
      editor.focus()
      range = editor.getSelection()
    }

    const index = range?.index ?? editor.getLength()

    // Prevent Quill's default drop handler from also inserting
    setTimeout(() => {
      editor.insertText(index, `${tag} `, 'user')
      requestAnimationFrame(() => {
        editor.focus()
        editor.setSelection(index + tag.length + 1, 0)
      })
    }, 0)
  }

  return (
    <div className="add-email-template-form">
      <Modal
        show={show}
        onHide={closeForm}
        centered
        size="sm"
        dialogClassName="custom-modal"
        backdrop="static"
      >
        <Modal.Header className="border-0">
          <Modal.Title className="font18 font600 fontOnest">
            {formLabel}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={12} className="goalNameLabel">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="font14 font400 fontOnest mb-0">
                  Template Name
                </label>

                <span className="font12 font400 fontOnest">
                  {getTrimmedValue(formData.template_name).length}/
                  {limits.template_name}
                </span>
              </div>
              <CommonInput
                className="TitleInput"
                placeholder="Please enter template name"
                width="100%"
                value={formData.template_name}
                onChange={handleChange}
                name="template_name"
                id="titleInput"
                onDrop={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                readOnly={isViewMode}
                autoComplete="off"
              />

              {errors.template_name && (
                <div className="text-danger error-message">
                  {errors.template_name}
                </div>
              )}
            </Col>
          </Row>
          <Row className="py-3">
            <Col lg={12} className="goalNameLabel">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="font14 font400 fontOnest mb-0">Subject</label>

                <span className="font12 font400 fontOnest">
                  {getTrimmedValue(formData.subject).length}/{limits.subject}
                </span>
              </div>
              <CommonInput
                ref={inputRef}
                className="TitleInput"
                placeholder="Subject"
                width="100%"
                value={formData.subject}
                onChange={handleChange}
                name="subject"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onKeyDown={handleSubjectKeyDown}
                onMouseUp={normalizeSubjectSelection}
                onKeyUp={normalizeSubjectSelection}
                onPaste={handleSubjectPaste}
                readOnly={isViewMode}
                autoComplete="off"
              />
              {errors.subject && (
                <div className="text-danger error-message">
                  {errors.subject}
                </div>
              )}
            </Col>
          </Row>
          <Row className="py-1">
            <Col lg={isViewMode ? 12 : 9} className="goalNameLabel">
              <div
                className="d-flex justify-content-between align-items-center mb
                 -1"
              >
                <label
                  className="font14 font400 fontOnest mb-0"
                  htmlFor="bodyInput"
                >
                  Body
                </label>
              </div>
              <div
                className="quill-wrapper"
                onDrop={isViewMode ? undefined : handleQuillDrop}
                onDragOver={
                  isViewMode
                    ? undefined
                    : (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                }
              >
                <ReactQuill
                  ref={quillRef}
                  className="rich-text-editor fixed-height-editor"
                  theme="snow"
                  value={formData.body}
                  onChange={handleQuillChange}
                  id="bodyInput"
                  readOnly={isViewMode}
                  modules={quillModules}
                />
              </div>

              {errors.body && (
                <div className="text-danger error-message">{errors.body}</div>
              )}
            </Col>

            {!isViewMode && (
              <Col lg={3} className="goalNameLabel">
                <div
                  className="d-flex justify-content-between align-items-center mb
                   -1"
                >
                  <label
                    className="font14 font400 fontOnest mb-0"
                    htmlFor="bodyInput"
                  >
                    Tags
                  </label>
                </div>
                <div className="tags-area">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-chip"
                      draggable={!isViewMode}
                      onDragStart={(e) => {
                        if (isViewMode) return
                        handleDragStart(e, tag)
                      }}
                    >
                      <p className="tags-design">{tag}</p>
                    </span>
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-start">
          {isViewMode ? (
            <SharedButton label="Close" variant="outline" onClick={closeForm} />
          ) : (
            <>
              <SharedButton
                label="Cancel"
                variant="outline"
                onClick={() => {
                  setCancelForm(true)
                  // resetForm()
                  // closeForm()
                }}
              />
              <SharedButton label="Save" onClick={() => saveEmailTemplate()} />
            </>
          )}
        </Modal.Footer>
      </Modal>

      <CustomModal
        show={cancelForm}
        onConfirm={handleConfirm}
        onClose={handleCancelFormClose}
        image={CloseWhiteIcon}
        modalHeading={
          emailTemplateFormLabel === 'Edit email template'
            ? 'Cancel Edit Email Template'
            : 'Cancel Email Template'
        }
        modalDesc="Are you sure you want to cancel the email template?"
        type="Warning"
      />
    </div>
  )
}

export default AddEmailTemplateForm
