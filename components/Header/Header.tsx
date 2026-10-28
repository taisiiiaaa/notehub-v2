import Link from 'next/link'
import styles from './Header.module.css'
import AuthNavigation from '../AuthNavigation/AuthNavigation'

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href='/' aria-label='Home'>
        NoteHub
      </Link>
      <nav aria-label='Main Navigation'>
        <ul className={styles.navigation}>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/notes/filter/all'>Notes</Link>
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  )
}

export default Header
