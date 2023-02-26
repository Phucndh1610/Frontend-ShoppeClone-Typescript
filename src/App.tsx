import useRouterElements from '../src/router/useRouterElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const routeElements = useRouterElements()
  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}
