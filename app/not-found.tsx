import styles from './page.module.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found | NoteHub',
  description:
    'Sorry, the page you are looking for does not exist. Please check the URL or return to the home page',
  openGraph: {
    title: 'Not Found | NoteHub',
    description:
      'Sorry, the page you are looking for does not exist. Please check the URL or return to the home page',
    url: `https://notehub.com/not-found`,
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

const NotFoundPage = () => {
  return (
    <>
      <h1 className={styles.title}>404 - Page not found</h1>
      <p className={styles.description}>Sorry, the page you are looking for does not exist.</p>
    </>
  )
}

export default NotFoundPage
