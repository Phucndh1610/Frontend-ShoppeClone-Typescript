import { SuccessResponse } from '@Types/utils.type'
import { User } from '@Types/user.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>
