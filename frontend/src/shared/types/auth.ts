export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}
