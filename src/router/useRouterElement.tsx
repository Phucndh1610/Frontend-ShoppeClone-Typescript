import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from '@Pages/ProductList/index'
import Login from '@Pages/Login/index'
import Register from '@Pages/Register/index'
import RegisterLayout from '@Layouts/RegisterLayout/index'
import MainLayout from '@Layouts/MainLayout/index'
import Profile from '@Pages/Profile/index'
import { useContext } from 'react'
import { AppContext } from '@Contexts/app.contexts'
import path from 'src/constants/path'
import ProductDetail from '@Pages/ProductDetail/index'
import Cart from '@Pages/Cart/index'
import CartLayout from '@Layouts/CartLayout/index'

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
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
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
