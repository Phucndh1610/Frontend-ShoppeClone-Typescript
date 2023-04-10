import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Schema, schema } from '@Utils/rules'
import { useMutation } from '@tanstack/react-query'
import bg_register from '@Assets/images/bg_register.png'
import Input from '@Components/Input/index'
import { yupResolver } from '@hookform/resolvers/yup'
import authApi from '@Apis/auth.api'
import omit from 'lodash/omit'
import { isAxiosUnprocessableEntityError } from '@Utils/utils'
import { ErrorResponse } from '@Types/utils.type'
import { AppContext } from '@Contexts/app.contexts'
import Button from '@Components/Button/index'
import path from 'src/constants/path'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { t } = useTranslation()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).map((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='bg-orange'>
      <Helmet>
        <title>Đăng ký | Shoppe clone</title>
        <meta
          name='description'
          content='Đăng ký tài khoản hôm nay và nhận ngay vô số deal và voucher độc quyền dành cho khách hàng mới trên Shopee Việt Nam!'
        />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='sml:hidden lg:col-span-3 lg:col-start-1 lg:inline'>
            <img src={bg_register} alt='...' />
          </div>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'> {t('auth.txt_register')}</div>
              <Input
                name='email'
                register={register}
                type='email'
                placeholder={`${t('auth.lbl_email')}`}
                className='mt-8'
                autoComplete='none'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                register={register}
                type='password'
                placeholder={`${t('auth.lbl_password')}`}
                className='relative mt-3'
                classNameEya='absolute right-[8px] top-[13px] h-5 w-5 cursor-pointer'
                autoComplete='none'
                errorMessage={errors.password?.message}
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                placeholder={`${t('auth.txt_confirm_password')}`}
                className='relative mt-3'
                classNameEya='absolute right-[8px] top-[13px] h-5 w-5 cursor-pointer'
                autoComplete='none'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  {t('auth.txt_register')}
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to={path.login}>
                  {t('auth.txt_login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
