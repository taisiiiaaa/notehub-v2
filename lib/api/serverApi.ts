import { cookies } from 'next/headers'
import { api } from './api'
import type { User } from '@/types/user'
import axios from 'axios'
import { Note, NoteTag } from '@/types/note'

interface NotesResponse {
  notes: Note[]
  totalPages: number
}

export async function fetchNotes(
  page: number,
  search: string,
  tag?: NoteTag
): Promise<NotesResponse> {
  const cookieStore = await cookies()

  const { data } = await axios.get<NotesResponse>(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
    params: {
      page,
      search,
      perPage: 12,
      ...(tag && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  })

  return data
}

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await fetch(`/api/notes/${noteId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch note: ${response.status}`)
  }

  return response.json()
}

export const checkSession = async (cookieHeader?: string): Promise<void> => {
  const cookie = cookieHeader ?? (await cookies()).toString()

  await api.get('/auth/session', {
    headers: {
      Cookie: cookie,
    },
  })
}

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  console.log(
    'Authentication cookie names:',
    cookieStore.getAll().map(cookie => cookie.name)
  )

  console.log('Has access token:', cookieStore.has('accessToken'))
  console.log('Has refresh token:', cookieStore.has('refreshToken'))

  try {
    const { data } = await api.get<User>('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
    })

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Profile request status:', error.response?.status)
      console.error('Profile request response:', error.response?.data)
    }

    throw error
  }
}
