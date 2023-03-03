import { Purchase, PurchaseListStatus } from '@Types/purchase.type'
import { SuccessResponse } from '@Types/utils.type'
import http from '@Utils/http'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { buy_count: number; product_id: string }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  }
}

export default purchaseApi
