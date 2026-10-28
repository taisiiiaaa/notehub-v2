import { CreateNote, Note, NoteTag } from '@/types/note'
import { api } from './api'
import { User } from '@/types/user'

interface Response {
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

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: NoteTag
): Promise<Response> => {
  const params = new URLSearchParams({
    page: String(page),
    search,
    perPage: '12',
  })

  if (tag) {
    params.set('tag', tag)
  }

  const response = await fetch(`/api/notes?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch notes: ${response.status}`)
  }

  return response.json()
}

export const createNote = async (newNote: CreateNote): Promise<Note> => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  })

  if (!response.ok) {
    throw new Error(`Failed to create note: ${response.status}`)
  }

  return response.json()
}

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete note: ${response.status}`)
  }

  return response.json()
}

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await fetch(`/api/notes/${noteId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch note: ${response.status}`)
  }

  return response.json()
}

export const register = async (credentials: AuthRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials)

  return data
}

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data: AuthResponse = await response.json()

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return data
}

export const logout = async (): Promise<void> => {
  await fetch('/api/auth/logout', {
    method: 'POST',
  })
}

export const checkSession = async (): Promise<void> => {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('No active session')
  }
}

export const getMe = async (): Promise<User> => {
  const response = await fetch('/api/users/me')

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }

  return response.json()
}

export interface UpdateUserRequest {
  username: string
  email: string
}

export interface UpdateUserRequest {
  username: string
  email: string
}

export const updateMe = async (userData: UpdateUserRequest): Promise<User> => {
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.status}`)
  }

  return response.json()
}
