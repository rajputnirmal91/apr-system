import { useEffect, useRef, useState } from 'react'

interface UseUnsavedChangesGuardProps {
  hasUnsavedChanges: () => boolean
  onConfirmDiscard: () => void
}

// eslint-disable-next-line import/prefer-default-export
export const useUnsavedChangesGuard = ({
  hasUnsavedChanges,
  onConfirmDiscard,
}: UseUnsavedChangesGuardProps) => {
  const [showModal, setShowModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const isCustomActionRef = useRef(false)

  // Set to true right before replaying a click so the guard ignores it
  const skipNextClickRef = useRef(false)

  // True from the moment the user confirms until the replayed click has fired.
  // Prevents re-entry when React state (formData, Redux) hasn't flushed yet.
  const isConfirmingRef = useRef(false)

  // Stable ref for the listener — ensures cleanup removes the exact same
  // function reference even under React 18 Strict Mode double-invoke.
  const listenerRef = useRef<((e: MouseEvent) => void) | null>(null)

  // Refs so the single registered listener always reads the latest values
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges)
  const showModalRef = useRef(showModal)

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges
  }, [hasUnsavedChanges])

  useEffect(() => {
    showModalRef.current = showModal
  }, [showModal])

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Bail during the confirm → discard → replay window.
      // React setState calls in onConfirmDiscard are async, so hasUnsavedChanges
      // may still return true until the next render — this ref bridges that gap.
      if (isConfirmingRef.current) return

      // Bail if no unsaved changes, or modal already open, or another modal is visible
      if (
        !hasUnsavedChangesRef.current() ||
        showModalRef.current ||
        document.querySelector('.modal.show')
      )
        return

      // Skip one click after confirm-replay
      if (skipNextClickRef.current) {
        skipNextClickRef.current = false
        return
      }

      const target = event.target as HTMLElement

      // Allow native inputs / textareas / checkboxes
      if (target.closest('input, textarea, select')) return

      // Allow all dropdown interactions
      if (
        target.closest(
          '.p-dropdown, .p-dropdown-panel, .p-dropdown-item, .p-dropdown-trigger,' +
            ' .p-overlay-open, .dropdown-menu, .kra-selector, .kra-select-panel,' +
            ' .kra-dropdown, [class*="SharedDropDown"], [class*="sharedDropDown"],' +
            ' [class*="shared-dropdown"]'
        )
      )
        return

      const clickable = target.closest(
        'button, a, [role="button"], .page-item'
      ) as HTMLElement | null

      if (!clickable) return

      // Explicitly excluded elements — save/add/update/modal action buttons
      if (
        clickable.closest('[data-ignore-guard="true"]') ||
        clickable.getAttribute('data-ignore-guard') === 'true'
      )
        return

      // Skip if the clickable is inside any dropdown panel
      if (
        clickable.closest(
          '.p-dropdown, .p-dropdown-panel, .p-dropdown-trigger,' +
            ' .kra-select-panel, .kra-dropdown, [class*="shared-dropdown"]'
        )
      )
        return

      event.preventDefault()
      event.stopPropagation()

      // Store the element so we can replay the click after the user confirms discard
      const captured = clickable
      setPendingAction(() => () => {
        skipNextClickRef.current = true
        captured.click()
      })
      isCustomActionRef.current = false
      setShowModal(true)
    }

    // Store on a ref so the cleanup always removes the exact same function
    // reference — critical under React 18 Strict Mode which double-invokes effects.
    listenerRef.current = handleGlobalClick

    document.addEventListener('click', listenerRef.current, true)
    return () => {
      if (listenerRef.current) {
        document.removeEventListener('click', listenerRef.current, true)
        listenerRef.current = null
      }
    }
    // Registered once — refs keep values fresh
  }, [])

  const handleConfirm = () => {
    setShowModal(false)

    const action = pendingAction
    isCustomActionRef.current = false
    setPendingAction(null)

    // Discard form changes first (setState calls inside are async)
    onConfirmDiscard()

    // Block the listener immediately — React state from onConfirmDiscard hasn't
    // flushed yet, so hasUnsavedChanges would still return true for the next tick.
    isConfirmingRef.current = true

    if (action) {
      // Delay so React can flush state resets, then replay the captured click.
      setTimeout(() => {
        isConfirmingRef.current = false
        skipNextClickRef.current = true
        action()
      }, 50)
    } else {
      setTimeout(() => {
        isConfirmingRef.current = false
      }, 50)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setPendingAction(null)
    isCustomActionRef.current = false
  }

  /**
   * Programmatically trigger the modal with an optional custom confirm action.
   * Used by internal form buttons (e.g. KRA row expand when another panel is open).
   */
  const triggerModal = (onConfirmAction?: () => void) => {
    if (onConfirmAction) {
      setPendingAction(() => onConfirmAction)
      isCustomActionRef.current = true
    } else {
      setPendingAction(null)
      isCustomActionRef.current = false
    }
    setShowModal(true)
  }

  return {
    showModal,
    handleConfirm,
    handleClose,
    triggerModal,
  }
}
