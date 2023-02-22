import { ResponseApi } from '@Types/utils.type'
import { User } from '@Types/user.type'

export type AuthResponse = ResponseApi<{
  access_token: string
  expires: string
  user: User
}>
