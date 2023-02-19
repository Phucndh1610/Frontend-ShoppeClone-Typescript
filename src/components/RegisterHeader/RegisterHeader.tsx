import { Link } from 'react-router-dom'

export default function RegisterHeader() {
  return (
    <header className='py-'>
      <div className='mx-auto max-w-7xl px-4'>
        <nav className='flex items-end'>
          <Link to={'/'}></Link>
        </nav>
      </div>
    </header>
  )
}
