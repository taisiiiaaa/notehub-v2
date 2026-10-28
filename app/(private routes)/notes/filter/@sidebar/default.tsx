import Link from 'next/link'
import styles from './SidebarNotes.module.css'
import { NoteTag } from '@/types/note'

const SidebarNotes = () => {
  const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

  return (
    <ul className={styles.menuList}>
      <li className={styles.menuItem}>
        <Link href={`/notes/filter/all`} className={styles.menuLink}>
          All notes
        </Link>
      </li>
      {tags.map(tag => (
        <li key={tag} className={styles.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={styles.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default SidebarNotes
