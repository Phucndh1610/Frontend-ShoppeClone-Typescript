import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse } from '@Types/auth.type'
import { clearAccessTokenFromLS, getAccessTokenFromLS, setAccessTokenToLS } from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // add response interceptors
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === 'login' || url === 'register') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          setAccessTokenToLS(this.accessToken)
        } else if (url === 'logout') {
          this.accessToken = ''
          clearAccessTokenFromLS()
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status != HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance

export default http
