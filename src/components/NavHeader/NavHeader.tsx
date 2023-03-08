import authApi from '@Apis/auth.api'
import Popover from '@Components/Popover/index'
import { AppContext } from '@Contexts/app.contexts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchaseStatus'
import { getAvatarUrl } from '@Utils/utils'
import { useTranslation } from 'react-i18next'

export default function NavHeader() {
  const { i18n, t } = useTranslation()
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const logOutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const handleLogOut = () => {
    logOutMutation.mutate()
  }
  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }
  const language = localStorage.getItem('i18nextLng')

  useEffect(() => {
    if (i18n.language === 'en') {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('vi')
    }
  }, [i18n])

  return (
    <div className='flex items-center justify-end gap-6'>
      <Popover
        className='flex cursor-pointer items-center py-1 hover:text-gray-300'
        renderPopover={
          <div className='relative border border-gray-200 bg-white shadow-md'>
            <div className='flex flex-col py-2 px-3'>
              <button className='py-2 px-3 hover:text-orange' onClick={() => changeLanguage('vi')}>
                {t('home.txt_vietnamese')}
              </button>
              <button className='mt-2 py-2 px-3 hover:text-orange' onClick={() => changeLanguage('en')}>
                {t('home.txt_english')}
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>{language === 'vi' ? t('home.txt_vietnamese') : t('home.txt_english')}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='flex cursor-pointer items-center py-1 hover:text-gray-300'
          renderPopover={
            <div className='relative border border-gray-200 bg-white shadow-md'>
              <Link
                to={path.profile}
                className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                {t('home.txt_my_account')}
              </Link>
              <Link
                to={path.historyPurchase}
                className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                {t('home.txt_my_purchase')}
              </Link>
              <button
                className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                onClick={handleLogOut}
              >
                {t('home.txt_logout')}
              </button>
            </div>
          }
        >
          <div className='mr-2 h-6 w-6 flex-shrink-0'>
            <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='h-full w-full rounded-full object-cover' />
          </div>
          <div>{profile?.name ? profile?.name : profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            {t('home.txt_register')}
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40'></div>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            {t('home.txt_login')}
          </Link>
        </div>
      )}
    </div>
  )
}
