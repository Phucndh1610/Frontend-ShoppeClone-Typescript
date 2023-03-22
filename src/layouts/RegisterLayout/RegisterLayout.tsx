import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '@Components/Footer/index'
import RegisterHeader from '@Components/RegisterHeader/index'

interface Props {
  children?: React.ReactNode
}

function RegisterLayoutInner({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}

const RegisterLayout = memo(RegisterLayoutInner)
export default RegisterLayout
