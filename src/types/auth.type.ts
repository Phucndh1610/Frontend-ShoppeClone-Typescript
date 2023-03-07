import { SuccessResponse } from '@Types/utils.type'
import { User } from '@Types/user.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expires_refresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string
}>
