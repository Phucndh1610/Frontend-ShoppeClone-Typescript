import categoryApi from '@Apis/category.api'
import ProductApi from '@Apis/product.api'
import Pagination from '@Components/Pagination'
import { useQuery } from '@tanstack/react-query'
import { ProductListConfig } from '@Types/product.type'
import { Helmet } from 'react-helmet-async'
import useQueryConfig from 'src/hooks/useQueryConfig'
import AsideFilter from './Components/AsideFilter'
import Product from './Components/Product/Product'
import SortProductList from './Components/SortProductList'
import SkeletonProduct from './SkeletonProduct'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: productData, isLoading } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return ProductApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 6 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Trang chủ | Shoppe Clone</title>
        <meta
          name='description'
          content='Mua sắm trực tuyến hàng triệu sản phẩm ở tất cả ngành hàng. Giá tốt & Ưu đãi. Mua và bán online trong 30 giây. Shopee Đảm Bảo | Freeship Xtra | Hoàn Xu Xtra'
        />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
          </div>
          {productData && (
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='xl:grid-col-5 mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
                {productData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          )}
          {isLoading && (
            <div className='col-span-9'>
              <div className='h-[64px] w-full animate-pulse bg-gray-300/40 px-3 py-4'></div>
              <div className='xl:grid-col-5 mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
                {new Array(8).fill(null).map((_val, index) => (
                  <SkeletonProduct key={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
