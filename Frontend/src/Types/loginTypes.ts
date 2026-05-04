export type LoginType = {
  // username: string
  email: string
  password: string
}

export type LoginResType = {
  id: string
  user_role_id: string
  user_role: string
  email: string
  name: string
  access_token: string
  lms_id: string
  profile_image_url: string | null
}
