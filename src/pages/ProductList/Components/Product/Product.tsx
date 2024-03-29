import { Link } from 'react-router-dom'
import { Product as ProductType } from '@Types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from '@Utils/utils'
import ProductRating from '@Components/ProductRating/index'
import path from 'src/constants/path'
import { useTranslation } from 'react-i18next'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  const { t } = useTranslation()
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.03rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start gap-2'>
            <ProductRating rating={product.rating} />
            <div className='text-sm'>
              <span className='text-sm'>{formatNumberToSocialStyle(product.view)}</span>
              <span className='ml-1'>{t('home.txt_sold')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
