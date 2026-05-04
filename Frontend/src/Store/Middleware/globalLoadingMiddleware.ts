import type { Middleware } from '@reduxjs/toolkit'

import {
  decrementLoading,
  incrementLoading,
} from '../Feature/LoadingSlice/LoadingSlice'

/**
 * RTK Query lifecycle actions for real network requests always have:
 *   meta.requestId     — unique ID for the request
 *   meta.requestStatus — 'pending' | 'fulfilled' | 'rejected'
 *   meta.arg           — the original query/mutation argument
 *
 * Internal RTK Query bookkeeping actions (cache subscriptions, unsubscribes, etc.)
 * carry meta.requestId but NOT meta.arg, so we exclude them to keep
 * the counter balanced and avoid showing a spinner for non-network activity.
 */
const isRealRtkRequest = (action: unknown): boolean => {
  const act = action as {
    meta?: {
      requestId?: string
      requestStatus?: string
      arg?: unknown
    }
  }
  return (
    typeof act?.meta?.requestId === 'string' &&
    typeof act?.meta?.requestStatus === 'string' &&
    act?.meta?.arg !== undefined
  )
}

const globalLoadingMiddleware: Middleware = (_store) => (next) => (action) => {
  // Call next first so the action is processed before we react to it
  const result = next(action)

  if (isRealRtkRequest(action)) {
    const status = (action as { meta: { requestStatus: string } }).meta
      .requestStatus

    if (status === 'pending') {
      _store.dispatch(incrementLoading())
    } else if (status === 'fulfilled' || status === 'rejected') {
      _store.dispatch(decrementLoading())
    }
  }

  return result
}

export default globalLoadingMiddleware
