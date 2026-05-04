/**
 * Optimistic update handler for updateGoalWeightage mutation.
 *
 * Immediately patches all cached goalList / goalMappedList entries with the
 * new weightage values so the UI reflects changes the instant the modal closes,
 * without waiting for the server response.
 *
 * If the API call fails, all patches are rolled back automatically.
 */

import { GoalsResponse, UpdateGoalWeightageRequest } from '@project/Types/MasterGoals'

type GoalWeightageUpdate = UpdateGoalWeightageRequest['goals'][number]

/** A single RTK Query patch result that can be undone */
export type PatchResult = { undo: () => void }

/**
 * Finds all cached goalList / goalMappedList entries in the RTK Query state
 * and returns their endpoint name + originalArgs pairs.
 */
export function getCachedGoalListEntries(
  reducerState: { queries?: Record<string, { originalArgs?: unknown } | undefined> }
): Array<{ endpointName: 'goalList' | 'goalMappedList'; originalArgs: unknown }> {
  const queries: Record<string, { originalArgs?: unknown } | undefined> = reducerState?.queries ?? {}
  const entries: Array<{ endpointName: 'goalList' | 'goalMappedList'; originalArgs: unknown }> = []

  Object.keys(queries).forEach((key) => {
    const isGoalList = key.startsWith('goalList(')
    const isGoalMappedList = key.startsWith('goalMappedList(')
    if (!isGoalList && !isGoalMappedList) return

    const entry = queries[key]
    if (!entry?.originalArgs) return

    entries.push({
      endpointName: isGoalMappedList ? 'goalMappedList' : 'goalList',
      originalArgs: entry.originalArgs,
    })
  })

  return entries
}

/**
 * Applies the weightage updates to a draft GoalsResponse.
 * Used inside RTK Query's updateQueryData recipe.
 */
export function applyWeightageUpdates(
  draft: GoalsResponse,
  updates: GoalWeightageUpdate[]
): void {
  updates.forEach((updated) => {
    const goal = draft.goals?.find((g) => g.goal_id === updated.goal_id)
    if (goal) goal.goal_weightage = updated.goal_weightage
  })
}
