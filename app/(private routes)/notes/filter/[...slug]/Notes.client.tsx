'use client'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api/clientApi'
import SearchBox from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import Loader from '@/components/Loader/Loader'
import NoteList from '@/components/NoteList/NoteList'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import EmptyState from '@/components/EmptyState/EmptyState'
import styles from './Notes.module.css'
import { NoteTag } from '@/types/note'
import Link from 'next/link'

interface NotesClientProps {
  tag?: NoteTag
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, 300)

  const { data, isSuccess, isLoading, error, isError, isFetching } = useQuery({
    queryKey: ['notes', tag ?? 'all', searchQuery, currentPage],
    queryFn: () => fetchNotes(currentPage, searchQuery, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  })

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    debouncedSearch(value)
  }

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            updatePage={setCurrentPage}
          />
        )}

        <Link href='/notes/action/create' className={styles.button}>
          Create note +
        </Link>
      </header>

      <main>
        <section>
          {isLoading && !isError && <Loader />}

          {isSuccess && data.notes.length > 0 && (
            <div className={styles.notesContainer}>
              <NoteList notes={data.notes} />

              {isFetching && !isLoading && <Loader />}
            </div>
          )}

          {isError && (
            <ErrorMessage
              message={error instanceof Error ? error.message : 'Failed to load notes.'}
            />
          )}

          {isSuccess && data.notes.length === 0 && (
            <EmptyState searchQuery={searchQuery} tag={tag} />
          )}
        </section>
      </main>
    </div>
  )
}

export default NotesClient
