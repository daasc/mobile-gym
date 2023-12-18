import { IPaymentDTO } from './payment.dto'
import { IWorkoutDTO } from './workout.dto'

export interface IUserDTO {
  _id?: string
  user_id: string
  name: string
  email: string
  age?: Date
  phoneNumber?: string
  photo?: string
  payment: IPaymentDTO[]
  workout: IWorkoutDTO[]
  working: boolean
}
