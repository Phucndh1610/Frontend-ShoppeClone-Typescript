import categoryApi from '@Apis/category.api'
import ProductApi from '@Apis/product.api'
import Pagination from '@Components/Pagination'
import { useQuery } from '@tanstack/react-query'
import { ProductListConfig } from '@Types/product.type'
import React, { useEffect, useState } from 'react'
import useQueryConfig from 'src/hooks/useQueryConfig'
import AsideFilter from './Components/AsideFilter'
import Product from './Components/Product/Product'
import SortProductList from './Components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return ProductApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
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
          </div>
        )}
      </div>
    </div>
  )
}
