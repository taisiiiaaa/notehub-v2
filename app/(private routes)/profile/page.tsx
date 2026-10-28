import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getMe } from '@/lib/api/serverApi'
import styles from './ProfilePage.module.css'

export const metadata: Metadata = {
  title: 'My Profile | NoteHub',
  description:
    'View and manage your profile in NoteHub, a simple and efficient application for managing personal notes. Update your information and keep your account secure',
  openGraph: {
    title: 'My Profile | NoteHub',
    description:
      'View and manage your profile in NoteHub, a simple and efficient application for managing personal notes. Update your information and keep your account secure',
    url: `https://notehub.com/notes/action/create`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - A simple and efficient application for managing personal notes',
      },
    ],
  },
}

export default async function ProfilePage() {
  const user = await getMe()

  return (
    <main className={styles.mainContent}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.formTitle}>Profile Page</h1>

          <Link href='/profile/edit' className={styles.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={styles.avatarWrapper}>
          <Image
            src={user.avatar}
            alt='User Avatar'
            width={120}
            height={120}
            className={styles.avatar}
            loading='eager'
          />
        </div>

        <div className={styles.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  )
}
