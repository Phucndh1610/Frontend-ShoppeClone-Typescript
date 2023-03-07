import React, { Fragment } from 'react'
import purchaseApi from '@Apis/purchase.api'
import { createSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import path from 'src/constants/path'
import { PurchaseListStatus } from '@Types/purchase.type'
import { purchasesStatus } from 'src/constants/purchaseStatus'
import useQueryParams from 'src/hooks/useQueryParams'
import { formatCurrency, generateNameId } from '@Utils/utils'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hũy' }
]

export default function HistoryPurchase() {
  const queryParam: { status?: string } = useQueryParams()
  const status: number = Number(queryParam.status) || purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchaseInCart = purchasesInCartData?.data.data

  const purchaseTabLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  return (
    <div className='overflow-x-auto'>
      <div className='min-w-[700px]'>
        <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabLink}</div>
        <div>
          {purchaseInCart?.map((purchase) => (
            <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
              <Link
                to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                className='flex'
              >
                <div className='flex-shrink-0'>
                  <img src={purchase.product.image} className='h-20 w-20 object-cover' alt={purchase.product.name} />
                </div>
                <div className='ml-3 flex-grow overflow-hidden'>
                  <div className='truncate'>{purchase.product.name}</div>
                  <div className='mt-3'>x{purchase.buy_count}</div>
                </div>
                <div className='ml-3 flex flex-shrink-0 gap-2'>
                  <span className='truncate text-gray-500 line-through'>
                    ₫{formatCurrency(purchase.product.price_before_discount)}
                  </span>
                  <span className='truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                </div>
              </Link>
              <div className='flex justify-end'>
                <div>
                  <span>Tổng giá tiền</span>
                  <span className='ml-4 text-xl text-orange'>
                    ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
