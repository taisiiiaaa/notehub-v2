import { cookies } from 'next/headers'
import { api } from './api'
import type { User } from '@/types/user'
import type { Note, NoteTag } from '@/types/note'
import type { AxiosResponse } from 'axios'

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

  const { data } = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      search,
      perPage: 12,
      ...(tag ? { tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  })

  return data
}

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const cookieStore = await cookies()

  const { data } = await api.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  })

  return data
}

export const checkSession = async (
  cookieHeader?: string
): Promise<AxiosResponse<{ message: string }>> => {
  const cookie = cookieHeader ?? (await cookies()).toString()

  return api.get<{ message: string }>('/auth/session', {
    headers: {
      Cookie: cookie,
    },
  })
}

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies()

  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  })

  return data
}
