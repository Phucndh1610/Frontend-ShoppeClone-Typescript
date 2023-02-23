import useRouterElements from '../src/router/useRouterElement'

export default function App() {
  const routeElements = useRouterElements()
  return <div>{routeElements}</div>
}
