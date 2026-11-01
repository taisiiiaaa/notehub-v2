import type { CreateNote, Note, NoteTag } from '@/types/note'
import type { User } from '@/types/user'
import { api } from './api'

interface NotesResponse {
  notes: Note[]
  totalPages: number
}

interface AuthRequest {
  email: string
  password: string
}

interface AuthResponse {
  user: User
}

export interface UpdateUserRequest {
  username: string
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: NoteTag
): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      search,
      perPage: 12,
      ...(tag ? { tag } : {}),
    },
  })

  return data
}

export const createNote = async (newNote: CreateNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', newNote)
  return data
}

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${noteId}`)
  return data
}

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${noteId}`)
  return data
}

export const register = async (credentials: AuthRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials)

  return data
}

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials)

  return data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export interface SessionResponse {
  message: string
}

export const checkSession = async (): Promise<SessionResponse> => {
  const { data } = await api.get<SessionResponse>('/auth/session')
  return data
}

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me')
  return data
}

export const updateMe = async (userData: UpdateUserRequest): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', userData)
  return data
}
