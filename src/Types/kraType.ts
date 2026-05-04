type GetKraListRequest = {
  page: number
  limit: number
  search?: string
  order_by?: 'asc' | 'desc'
}

type KraListItem = {
  id: string
  kra_name: string
  is_associated: boolean
  sub_kras: SubKraListItem[]
}
type SubKraListItem = {
  id: string
  kra_id: string
  sub_kra_name: string
  is_associated: boolean
}
type GetKraListResponse = {
  message: string
  total_count: number
  page: number
  kras: [
    {
      id: string
      kra_name: string
      is_associated: boolean
      sub_kras: [
        {
          id: string
          kra_id: string
          sub_kra_name: string
          is_associated: boolean
        },
      ]
    },
  ]
}

type AddNewKraRequest = {
  kra_name: string
  sub_kras: string[]
  created_by?: string
}

type AddNewKraResponse = {
  message: string
  kra: {
    id: string
    kra_name: string
    sub_kras: [
      {
        id: string
        kra_id: string
        sub_kra_name: string
      },
    ]
  }
}

type KraUpdateRequest = {
  id: string
  kra_name: string
  sub_kras: [
    {
      id: string
      kra_id: string
      sub_kra_name: string
      is_deleted: boolean | string
      is_associated: boolean
    },
  ]
}

type KraUpdateResponse = {
  message: string
  kra: {
    id: string
    kra_name: string
    sub_kras: [
      {
        id: string
        kra_id: string
        sub_kra_name: string
      },
    ]
  }
}

type DeleteKraRequest = {
  id: string
  is_deleted: boolean
}

type DeleteKraResponse = {
  message: string
}

export type {
  AddNewKraRequest,
  AddNewKraResponse,
  DeleteKraRequest,
  DeleteKraResponse,
  GetKraListRequest,
  GetKraListResponse,
  KraListItem,
  KraUpdateRequest,
  KraUpdateResponse,
  SubKraListItem,
}
