import { Outlet } from 'react-router-dom'
import UserSideNav from '@Pages/User/components/UserSideNav/index'

export default function UserLayout() {
  return (
    <div className='bg-neutral-100 py-16 text-sm text-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='overflow-hidden md:col-span-3 lg:col-span-3'>
            <UserSideNav />
          </div>
          <div className='md:col-span-9 lg:scroll-m-9'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
