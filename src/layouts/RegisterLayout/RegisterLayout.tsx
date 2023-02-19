// import Footer from '../../components/Footer/index'
import Footer from '@Components/Footer/index'
import RegisterHeader from '../../components/RegisterHeader/index'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}
