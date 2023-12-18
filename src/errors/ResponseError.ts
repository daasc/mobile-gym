import { AxiosError } from 'axios'

export default class ResponseError {
  message: string
  code: number
  errorCode: string
  exception: string

  constructor({ response }: AxiosError) {
    console.log('LOG: ~ ResponseError ~ constructor ~ response', response)
    this.message = response?.data?.message || 'Erro inesperado'
    this.code = response?.status || 0
    this.errorCode = response?.data?.code || 0
    this.exception = response?.data?.exception || ''
  }
}
