/**
 * Common utility functions used across the application
 */

/**
 * Normalizes a string by trimming whitespace, converting to lowercase,
 * and replacing multiple spaces with a single space
 * @param value - The string to normalize
 * @returns Normalized string
 */
export const normalizeString = (value: string = ''): string => {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Generates a unique key for an item based on its ID or name/type combination
 * @param item - Object with optional id/goalId and required goalName/goalType
 * @returns Unique key string
 */
export const generateUniqueKey = (item: {
  id?: string | null
  goalId?: string | null
  goalName: string
  goalType: string
}): string => {
  if (item.goalId) {
    return `id:${item.goalId}`
  }
  if (item.id) {
    return `id:${item.id}`
  }
  return `name:${normalizeString(item.goalName)}|type:${item.goalType}`
}

/**
 * Checks if a string is empty after trimming whitespace
 * @param value - The string to check
 * @returns True if empty or only whitespace
 */
export const isEmptyString = (value: string): boolean => {
  return !value || value.trim() === ''
}

/**
 * Formats a number to a fixed number of decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number as string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals)
}

/**
 * Truncates a string to a maximum length and adds ellipsis if needed
 * @param text - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength)}...`
}
