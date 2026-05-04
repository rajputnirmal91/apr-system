export type ApiResponse<T> = {
  data: T
  message: string
  status: number
  statusCode: number
  responseMessage: 'FAILED' | 'SUCCESS'
  totalRecords: number
  noOfRecords: number
  msg: string
  detail: string
}

export type PaginationPropType = {
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
