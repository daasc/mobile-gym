export interface IPaymentDTO {
  _id?: string
  client_id: string
  createdAt: Date
  date: Date
  end_date: Date
  price: number
  status: string
  type: string
  updatedAt: Date | undefined
  user_id: string
}
