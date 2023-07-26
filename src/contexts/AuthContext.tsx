/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'


import { api } from '@/services/apiClient'

type AuthProviderProps = {
  children: ReactNode
}

type ResponseSessionData = {
  email: string
  username: string
  roles: {
    name: string
    description: string
    permissions: {
      name: string
      description: string
    }[]
  }[]
}

type ResponseSign = {
  data: {
    email: string
    username: string
    roles: {
      name: string
      description: string
      permissions: {
        name: string
        description: string
      }[]
    }[]

    token: string
  }
}

export type User = {
  email: string
  username: string
  roles: {
    name: string
    description: string
    permissions: {
      name: string
      description: string
    }[]
  }[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => void
  user: User | undefined
  isAuthenticated: boolean
  isLoading: boolean
  errorMessage: string | undefined
}

type ErrorSignInResponse = {
  error: string
}

const _optionsCookies = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
}

export function isAxiosError<ResponseType>(
  error: unknown,
): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error)
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const isAuthenticated = !!user

  const router = useRouter()

  useEffect(() => {
    try {
      const { 'rscore.token': token } = parseCookies()

      if (token) {
        setLoading(true)
        api
          .get('/session')
          .then((response) => {
            const { email, username, roles } =
              response.data as ResponseSessionData

            setUser({ email, username, roles })
          })
          .catch(() => {
            signOut()
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } catch (error) {}
  }, [])

  const signOut = () => {
    destroyCookie(undefined, 'rscore.token')
    // authChannel.postMessage('signOut')
    router.push('/')
  }

  async function signIn({ email, password }: SignInCredentials) {
    setLoading(true)
    try {
      const response = (await api.post('/session', {
        email,
        password,
      })) as ResponseSign

      const { username, roles, token } = response.data

      setCookie(undefined, 'rscore.token', token, _optionsCookies)

      setUser({
        email,
        username,
        roles,
      })

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      router.push('/dashboard')
      setLoading(false)
    } catch (err) {
      if (isAxiosError<ErrorSignInResponse>(err)) {
        setErrorMessage(err.response?.data.error)
        setLoading(false)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isAuthenticated,
        isLoading,
        errorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
