import type { Id } from 'react-toastify'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

let toastId: Id = ''

export const showErrorToast = (errorMessage: string) => {
  if (!errorMessage) return
  if (!toast.isActive(toastId)) {
    toastId = toast.error(errorMessage, {
      position: 'top-right',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      autoClose: 4000,
    })
  }
}

// Toaster message for success
export const showSuccessToast = (message: string) => {
  if (!toast.isActive(toastId)) {
    toastId = toast.success(message, {
      position: 'top-right',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      autoClose: 4000,
    })
  }
}
