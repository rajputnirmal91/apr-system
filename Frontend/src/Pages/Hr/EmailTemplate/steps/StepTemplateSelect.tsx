import { useMemo, useState } from 'react'

import { Col, Form, Row } from 'react-bootstrap'

import SharedButton from '@project/Components/Button/SharedButton'
import { useGetHrEmailTemplatesQuery } from '@project/Store/Api/Hr/HrEmailTemplateApi'

import { EmailTemplateOption } from '../emailTemplate.mock'
import { useEmailTemplate } from '../EmailTemplateContext'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'

function StepTemplateSelect() {
  const {
    selectedTemplate,
    subject,
    body,
    setSelectedTemplate,
    setSubject,
    setBody,
    setStep,
  } = useEmailTemplate()
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useGetHrEmailTemplatesQuery({
    page: 1,
    limit: 100,
    search: '',
    order_by: 'asc',
    sort_by: 'template_name',
  })

  // Map API shape { id, template_name, subject, body } → EmailTemplateOption
  const templates: EmailTemplateOption[] = useMemo(
    () =>
      (data?.email_templates ?? []).map((t) => ({
        value: t.id,
        label: t.template_name,
        subject: t.subject,
        body: t.body,
      })),
    [data]
  )

  const filteredTemplates = useMemo(
    () =>
      templates.filter((t) =>
        t.label.toLowerCase().includes(search.toLowerCase())
      ),
    [templates, search]
  )

  const handleSelect = (t: EmailTemplateOption) => {
    setSelectedTemplate(t)
    setSubject(t.subject)
    setBody(t.body)
  }

  return (
    <div className="et-step-container">
      <Row className="g-4 align-items-stretch h-100">
        {/* Left Panel — Template List */}
        <Col xs={12} md={4} className="d-flex et-left-panel">
          <div className="et-panel-card">
            <h6 className="et-panel-title font16 font600 fontOnest textDark">
              Select Template
            </h6>
            <Form.Control
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="et-template-search mb-3 font14 fontOnest"
            />
            <ul className="et-template-list">
              {isLoading && (
                <li className="et-template-empty font14 fontOnest textLight">
                  Loading templates...
                </li>
              )}
              {isError && (
                <li
                  className="et-template-empty font14 fontOnest"
                  style={{ color: 'var(--danger)' }}
                >
                  Failed to load templates.
                </li>
              )}
              {!isLoading && !isError && filteredTemplates.length === 0 && (
                <NoRecordFound
                  heading="No Templates Found"
                  description="There are no email templates available. Please create one to get started."
                />
              )}
              {filteredTemplates.map((t) => {
                const isActive = selectedTemplate?.value === t.value
                return (
                  <li key={t.value}>
                    <button
                      type="button"
                      className={`et-template-item ${isActive ? 'et-template-item--active' : ''}`}
                      onClick={() => handleSelect(t)}
                      aria-pressed={isActive}
                    >
                      <span className="et-template-item__label font14 fontOnest">
                        {t.label}
                      </span>
                      {isActive && (
                        <span
                          className="et-template-item__check"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </Col>

        {/* Right Panel — Preview */}
        <Col xs={12} md={8} className="d-flex et-right-panel">
          <div className="et-panel-card et-preview-card">
            <h6 className="et-panel-title font16 font600 fontOnest textDark">
              Preview
            </h6>

            <Form.Group className="mb-3">
              <Form.Label className="et-label font14 font500 fontOnest">
                Subject
              </Form.Label>
              {selectedTemplate ? (
                <p className="et-preview-value font14 fontOnest textDark mb-0">
                  {subject}
                </p>
              ) : (
                <p className="et-preview-value et-preview-placeholder font14 fontOnest mb-0">
                  —
                </p>
              )}
            </Form.Group>

            <Form.Group>
              <div className="et-preview-body-scroll">
                <Form.Label className="et-label font14 font500 fontOnest">
                  Body
                </Form.Label>
                {selectedTemplate ? (
                  <div
                    className="et-preview-body font14 fontOnest textDark"
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                ) : (
                  <div className="et-preview-body et-preview-placeholder font14 fontOnest">
                    <p className="mb-2">Dear [Employee Name],</p>
                    <p className="mb-2"></p>
                    <p className="mb-2">
                      Regards,
                      <br />
                      HR Team
                    </p>
                  </div>
                )}
              </div>
            </Form.Group>
          </div>
        </Col>
      </Row>

      <div className="et-step-footer">
        <SharedButton
          label="Next"
          variant="primary"
          onClick={() => setStep(2)}
          disabled={!selectedTemplate}
        />
      </div>
    </div>
  )
}

export default StepTemplateSelect
