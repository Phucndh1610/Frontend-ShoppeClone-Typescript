import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '@Components/Footer'
import Header from '@Components/Header'

interface Props {
  children?: React.ReactNode
}

function MainLayoutInner({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}

const MainLayout = memo(MainLayoutInner)
export default MainLayout
