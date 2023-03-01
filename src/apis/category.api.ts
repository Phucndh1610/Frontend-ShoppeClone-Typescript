import { Category } from '@Types/category.type'
import { SuccessResponse } from '@Types/utils.type'
import http from '@Utils/http'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}

export default categoryApi
