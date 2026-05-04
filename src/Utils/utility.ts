const REGEX_ONLY_NUMBERS = /^[0-9\b]+$/
const ALLOWED_KEYS = [
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'Enter',
  'Tab',
]

/**
 * Gives Random String of Defined Length
 * @param length - Length of String
 * @default - `length` is 4
 * @returns
 */
export const randomString = (length = 4) => {
  let text = ''
  const possible =
    '9876543210ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

/**
 * Gets Random Date from 2012 to till Date
 * @returns
 */
export const randomDate = () => {
  return new Date(
    new Date(2012, 0, 1).getTime() +
      (new Date().getTime() - new Date(2012, 0, 1).getTime())
  )
}

/**
 * Deep Copy
 * @param data
 * @returns
 */
export const makeDeepCopy = <T>(data: T): T => {
  const inString = JSON.stringify(data)
  return JSON.parse(inString) as T
}

export const isSameObject = <TObject1, TObject2>(
  obj1: TObject1,
  obj2: TObject2
) => JSON.stringify(obj1) === JSON.stringify(obj2)

export const mergeTwoArrObjectProperty = <TObject, Tb extends keyof TObject>(
  firstObj: TObject,
  secondObj: TObject,
  arrKeys: Tb[]
): TObject => {
  let newObj = { ...firstObj }
  arrKeys
    .filter((key) => firstObj[key] && secondObj[key])
    .forEach((key) => {
      const fir = firstObj[key] as Array<typeof firstObj>
      const sec = secondObj[key] as Array<typeof firstObj>
      newObj = {
        [key]: fir.concat(sec),
      } as typeof firstObj
    })
  return newObj
}

export const scrollTop = () => {
  window.scrollTo(0, 0)
}

export const removeKeysFromObject = <T extends object>(
  obj: T,
  keysToRemove?: (keyof T)[]
): Partial<T> => {
  const newObj: Partial<T> = {}
  Object.keys(obj).forEach((key) => {
    const objKey = key as keyof T
    if (!keysToRemove?.includes(objKey)) {
      newObj[objKey] = obj[objKey]
    }
  })
  return newObj
}

export const isNotEmptySpace = (value: string | undefined): boolean => {
  return !!value && !/^\s+$/.test(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trimFinalData = (data: any): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trimmedData: any = {}

  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string') {
      trimmedData[key] = data[key].trim()
    } else if (typeof data[key] === 'number') {
      trimmedData[key] = String(data[key]).trim()
    } else {
      trimmedData[key] = data[key]
    }
  })

  return trimmedData
}

export const capitalizeFirstLetter = (string: string | undefined) => {
  if (string)
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  return ''
}

export const removeUnderScore = (string: string | undefined) => {
  if (string) return string.replace('_', ' ')
  return ''
}

export const fileToDataUri = (file: unknown): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target) {
        resolve(String(event.target.result))
      } else {
        reject(new Error('error'))
      }
    }
    reader.readAsDataURL(file as Blob)
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFormData = (object: any) => {
  const formData = new FormData()
  Object.keys(object).forEach((key) => formData.append(key, object[key]))
  return formData
}

export const toLowerCase = (string: string | undefined) => {
  if (string) return string.toLowerCase()
  return ''
}

export const handleKeyDownOnlyNumbers = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (REGEX_ONLY_NUMBERS.test(event.key) || ALLOWED_KEYS.includes(event.key)) {
    return
  }
  event.preventDefault()
}

export const urlLastSegments = (string: string | undefined) => {
  if (string) {
    const segments = string.split('/')
    const last = segments[segments.length - 1]
    return last
  }
  return ''
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds - minutes * 60

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

export const SECRET_KEY = process.env.VITE_APP_SECRET_KEY

// Encryption function
export const encrypt = (id: string) => {
  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined!')
  }
  const encryptedId = btoa(id + SECRET_KEY) // Base64 encoding with key
  return encryptedId
}

// Decryption function
export const decrypt = (encryptedId: string) => {
  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined!')
  }
  const decryptedId = atob(encryptedId) // Base64 decoding
  // Remove the key to get the original ID
  const originalId = decryptedId.replace(SECRET_KEY, '')
  return originalId
}

export const ensureHTTPS = (url: string) => {
  // Check if the URL has no protocol
  if (!url.match(/^https?:\/\//i)) {
    // Prepend 'https://'
    return `https://${url}`
  }
  return url
}

export const generateYears = () => {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 50 // Adjust the number of years in the past
  const endYear = currentYear + 5 // Adjust the number of years in the future

  const years = []

  for (let year = startYear; year <= endYear; year += 1) {
    years.push({
      id: year,
      name: String(year),
    })
  }

  return years
}

export const isEndDateAfterTwoDays = (targetDate: string): boolean => {
  const parsedTargetDate = new Date(targetDate)

  // Get the current date
  const currentDate = new Date()

  // Calculate the date after 7 days
  const twoDaysLater = new Date()
  twoDaysLater.setDate(currentDate.getDate() + 7)

  // Compare the target date with the date after 7 days
  return parsedTargetDate >= twoDaysLater
}

export const pastDate = () => {
  return new Date(new Date().setDate(new Date().getDate() - 1))
}

// copy to clip board
export const copyToClipBoard = (text: string) => {
  return window.navigator.clipboard.writeText(text)
}

export const calculateProfilePercentage = (
  values: { [x: string]: unknown },
  totalFields: number
) => {
  // Total number of fields in the form
  let filledFields = 0

  // Loop through each field in the form
  Object.keys(values).forEach((key) => {
    const value = values[key]

    // Check if the field is an array and iterate over its items
    if (Array.isArray(value)) {
      value.forEach((item) => {
        filledFields += Object.values(item).filter(
          (itemValue) => itemValue !== -1 && itemValue !== 0 && !!itemValue
        ).length
      })
    } else if (value !== -1 && value !== 0 && !!value) {
      // Check if the field has a truthy value

      filledFields += 1
    }
  })

  // Calculate the percentage
  const percentage = (filledFields / totalFields) * 100

  return Math.round(percentage)
}

export const createMarkup = (html: string) => {
  return { __html: html }
}

// Function to parse and replace URLs with clickable links
export const parseAndReplaceLinks = (text: string) => {
  return text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  })
}

export const handleDownload = () => {
  // Path to your local Excel file
  const excelFilePath =
    '/home/admin1/Desktop/lms/talent-locator/frontend/public/report.xlsx'

  // Create a temporary anchor element and trigger download
  const link = document.createElement('a')
  link.href = excelFilePath
  link.setAttribute('download', 'downloaded_file.xlsx') // Change the filename as needed
  document.body.appendChild(link)
  link.click()
  // Cleanup
  link?.parentNode?.removeChild(link)
}
interface NestedObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function countKeys(obj: NestedObject): number {
  let count = Object.keys(obj).length

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        // If the value is an array, count keys in each object within the array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj[key].forEach((item: any) => {
          if (typeof item === 'object') {
            count += countKeys(item)
          }
        })
      } else {
        // If the value is an object, recursively count its keys
        count += countKeys(obj[key])
      }
    }
  })

  return count
}

export const formatDate = (dateValue?: string | Date | null): string => {
  if (!dateValue) return '-'

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export const htmlToPlainText = (html: string): string => {
  if (!html) return ''

  const temp = document.createElement('div')
  temp.innerHTML = html

  return temp.textContent || temp.innerText || ''
}

export const addOneDay = (dateStr: Date | string): Date => {
  const date = new Date(dateStr)

  date.setDate(date.getDate() + 1)

  return date
}

export const normalize = (str: string = '') =>
  str.trim().replace(/\s/g, '').toLowerCase()
