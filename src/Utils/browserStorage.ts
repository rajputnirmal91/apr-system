/**
 * Set `Key-Value` pair in browser storage
 * @param {String} key
 * @param {Object} value
 * @returns {void}
 */
export const setLocalStorage = <TValue>(key: string, value: TValue) => {
  if (key === 'authData') {
    sessionStorage.setItem(key, JSON.stringify(value))
    localStorage.removeItem(key)
    return
  }

  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Get Object Data according to corresponding key
 * @param {String} key
 * @returns {undefined | Object}
 */
export const getLocalStorage = <TReturn>(key: string): TReturn | undefined => {
  if (!key) return undefined

  const data =
    key === 'authData'
      ? sessionStorage.getItem(key) || localStorage.getItem(key)
      : localStorage.getItem(key)
  if (!data) return undefined
  const parsedData = JSON.parse(data)
  return parsedData
}

/**
 * Removes an Object corresponding to it's key
 * @param {String} key
 */
export const removeLocalStorage = (key: string) => {
  if (key === 'authData') {
    sessionStorage.removeItem(key)
  }
  localStorage.removeItem(key)
}

/**
 * Clears Browsers's storage
 */
export const clearLocalStorage = () => {
  localStorage.clear()
}
