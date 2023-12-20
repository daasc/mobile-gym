import { IExerciseDTO } from './exercise.dto'

export interface IWorkoutDTO {
  _id: number
  name: string
  workoutDescription: string
  time: number
  exercises: IExerciseDTO[]
  start: boolean
  finished: boolean
  doing: boolean
  timeFinished: Date
  selected: boolean
}
