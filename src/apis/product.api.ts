import { Product, ProductList, ProductListConfig } from '@Types/product.type'
import { SuccessResponse } from '@Types/utils.type'
import http from '@Utils/http'

const URL = 'products'

const ProductApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

export default ProductApi
