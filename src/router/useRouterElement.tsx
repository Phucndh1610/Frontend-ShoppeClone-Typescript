import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from '@Pages/ProductList/index'
import Login from '@Pages/Login/index'
import Register from '@Pages/Register/index'
import RegisterLayout from '@Layouts/RegisterLayout/index'
import MainLayout from '@Layouts/MainLayout/index'
import Profile from '@Pages/Profile/index'
import { useContext } from 'react'
import { AppContext } from '@Contexts/app.contexts'

function ProtectedRoute() {
  const isAuthenticated = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const isAuthenticated = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouterElements() {
  const routerElements = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: 'profile',
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: 'register',
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
