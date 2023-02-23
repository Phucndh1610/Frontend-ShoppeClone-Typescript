import { useRoutes } from 'react-router-dom'
import ProductList from '@Pages/ProductList/index'
import Login from '@Pages/Login/index'
import Register from '@Pages/Register/index'
import RegisterLayout from '@Layouts/RegisterLayout/index'

export default function useRouterElements() {
  const routerElements = useRoutes([
    {
      path: '/',
      element: <ProductList />
    },
    {
      path: '/login',
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: '/register',
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    }
  ])

  return routerElements
}
