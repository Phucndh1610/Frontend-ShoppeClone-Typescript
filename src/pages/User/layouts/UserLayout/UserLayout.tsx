import { Outlet } from 'react-router-dom'
import UserSideNav from '@Pages/User/components/UserSideNav/index'

export default function UserLayout() {
  return (
    <div>
      <UserSideNav />
      <Outlet />
    </div>
  )
}
