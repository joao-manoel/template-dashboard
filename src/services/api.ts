'use client'
import axios, { AxiosError } from 'axios'
import { GetServerSidePropsContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

type ResponseRefreshToken = {
  refreshToken: string
  token: string
}

let isRefreshing = false
let failedRequestsQueue: {
  onSuccess: (token: string) => void
  onFailure: (err: AxiosError<unknown, any>) => void
}[] = []

const _optionsCookies = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
}

export function setupAPIClient(
  ctx: GetServerSidePropsContext | undefined = undefined,
) {
  let cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['rscore.token']}`,
    },
  })

  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // console.log('>>', error)

      if (error.response?.status === 401) {
        if (error.code === 'token.expired') {
          cookies = parseCookies(ctx)

          const { 'rscore.refresh_token': refreshToken } = cookies
          const originalConfig = error.config

          if (!isRefreshing) {
            isRefreshing = true

            api
              .post<ResponseRefreshToken>('refresh-token', {
                refreshToken,
              })
              .then((response) => {
                const { token } = response.data as any

                setCookie(ctx, 'rscore.token', token, _optionsCookies)

                setCookie(
                  ctx,
                  'rscore.refresh_token',
                  response.data.refreshToken,
                  _optionsCookies,
                )

                api.defaults.headers.common.Authorization = `Bearer ${token}`

                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(token),
                )
                failedRequestsQueue = []
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) => request.onFailure(err))
                failedRequestsQueue = []

                if (process.browser) {
                  // signOut()
                } else {
                  return Promise.reject(new AuthTokenError())
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers.Authorization = `Bearer ${token}`

                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              },
            })
          })
        } else {
          // signOut()
        }
      }

      return Promise.reject(error)
    },
  )

  return api
}
