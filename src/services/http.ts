import axios, { AxiosInstance } from 'axios'

import ResponseError from '../errors/ResponseError'

type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenInstance: (signOut: SignOut) => () => void
}

const baseURL = 'http://www.localhost:3000'

const api = axios.create({
  baseURL,
}) as APIInstanceProps

api.registerInterceptTokenInstance = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    (requestError) => {
      if (
        requestError?.response?.status === 403 ||
        requestError?.response?.status === 401
      ) {
        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new ResponseError(requestError))
      } else {
        return Promise.reject(requestError)
      }
    },
  )

  return () => {
    api.interceptors.request.eject(interceptTokenManager)
  }
}

export { api }
