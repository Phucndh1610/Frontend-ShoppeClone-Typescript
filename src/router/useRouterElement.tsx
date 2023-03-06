import { Suspense, useContext } from 'react'
import { AppContext } from '@Contexts/app.contexts'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constants/path'
// Layouts
import MainLayout from '@Layouts/MainLayout/index'
import RegisterLayout from '@Layouts/RegisterLayout/index'
import CartLayout from '@Layouts/CartLayout/index'
// components
import Login from '@Pages/Login/index'
import Register from '@Pages/Register/index'
import ProductList from '@Pages/ProductList/index'
import ProductDetail from '@Pages/ProductDetail/index'
import Cart from '@Pages/Cart/index'
import UserLayout from '@Pages/User/layouts/UserLayout/index'
import Profile from '@Pages/User/pages/Profile/index'
import ChangePassword from '@Pages/User/pages/ChangePassword/index'
import HistoryPurchase from '@Pages/User/pages/HistoryPurchase/index'

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
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
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
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
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
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])

  return routerElements
}
