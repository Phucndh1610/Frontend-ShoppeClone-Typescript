import { useContext } from 'react'
import authApi from '@Apis/auth.api'
import Input from '@Components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { ErrorResponse } from '@Types/utils.type'
import { Schema, schema } from '@Utils/rules'
import { isAxiosUnprocessableEntityError } from '@Utils/utils'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import bg_register from '@Assets/images/bg_register.png'
import { AppContext } from '@Contexts/app.contexts'

type FormData = Omit<Schema, 'confirm_password'>
const schemaLogin = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({ resolver: yupResolver(schemaLogin) })

  const LoginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    LoginMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).map((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
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
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='sml:hidden lg:col-span-3 lg:col-start-1 lg:inline'>
            <img src={bg_register} alt='...' />
          </div>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Nhập</div>
              <div className='mt-8'>
                <Input
                  name='email'
                  register={register}
                  type='email'
                  placeholder='Email'
                  className='mt-8'
                  autoComplete='none'
                  errorMessage={errors.email?.message}
                />
                <Input
                  name='password'
                  register={register}
                  type='password'
                  placeholder='Password'
                  className='mt-3'
                  autoComplete='none'
                  errorMessage={errors.password?.message}
                />
              </div>
              <div className='mt-3'>
                <button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                >
                  Đăng nhập
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
