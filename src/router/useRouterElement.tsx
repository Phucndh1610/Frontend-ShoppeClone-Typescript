import { Suspense, useContext, lazy, Children } from 'react'
import { AppContext } from '@Contexts/app.contexts'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constants/path'
// Layouts
import MainLayout from '@Layouts/MainLayout/index'
import RegisterLayout from '@Layouts/RegisterLayout/index'
import CartLayout from '@Layouts/CartLayout/index'
import UserLayout from '@Pages/User/layouts/UserLayout/index'

// components
const Login = lazy(() => import('@Pages/Login/index'))
const Register = lazy(() => import('@Pages/Register/index'))
const ProductList = lazy(() => import('@Pages/ProductList/index'))
const ProductDetail = lazy(() => import('@Pages/ProductDetail/index'))
const NotFound = lazy(() => import('@Pages/NotFound/index'))
const Profile = lazy(() => import('@Pages/User/pages/Profile/index'))
const ChangePassword = lazy(() => import('@Pages/User/pages/ChangePassword/index'))
const HistoryPurchase = lazy(() => import('@Pages/User/pages/HistoryPurchase/index'))
const Cart = lazy(() => import('@Pages/Cart/index'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouterElements() {
  const routerElements = useRoutes([
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.home,
          index: true,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '*',
          index: true,
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchase,
                  element: (
                    <Suspense>
                      <HistoryPurchase />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    }
  ])

  return routerElements
}
