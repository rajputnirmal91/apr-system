/**
 * useDraftStorage — localStorage-backed draft persistence.
 * Designed for easy API replacement: swap the localStorage calls
 * with API calls (axios/fetch) inside saveDraft / getDrafts / deleteDraft.
 */

import { useCallback } from 'react'

import { DraftEmail, EmailTemplateOption, MockUser } from './emailTemplate.mock'

const STORAGE_KEY = 'hr_email_drafts'

export interface DraftSavePayload {
  to: string
  subject: string
  body: string
  step: number
  from?: string
  selectedTemplate: EmailTemplateOption | null
  selectedTemplateLabel?: string
  selectedUsers: MockUser[]
}

function readDrafts(): DraftEmail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DraftEmail[]) : []
  } catch {
    return []
  }
}

function writeDrafts(drafts: DraftEmail[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

export function useDraftStorage() {
  /** Save a draft with full resume state. Returns the saved draft. */
  const saveDraft = useCallback((data: DraftSavePayload): DraftEmail => {
    const drafts = readDrafts()
    const draft: DraftEmail = {
      id: `draft_${Date.now()}`,
      to: data.to || '—',
      subject: data.subject || '(No Subject)',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      from: data.from,
      resumeData: {
        step: data.step,
        subject: data.subject,
        body: data.body,
        selectedTemplateValue: data.selectedTemplate?.value ?? null,
        selectedTemplateLabel: data.selectedTemplateLabel ?? data.selectedTemplate?.label,
        selectedUserIds: data.selectedUsers.map((u) => u.id),
      },
    }
    writeDrafts([draft, ...drafts])
    return draft
  }, [])

  /** Retrieve all saved drafts from localStorage. */
  const getDrafts = useCallback((): DraftEmail[] => readDrafts(), [])

  /** Delete a draft by id. */
  const deleteDraft = useCallback((id: string): void => {
    writeDrafts(readDrafts().filter((d) => d.id !== id))
  }, [])

  return { saveDraft, getDrafts, deleteDraft }
}
