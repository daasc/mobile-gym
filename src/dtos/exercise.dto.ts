export interface IExerciseDTO {
  _id: string
  name: string
  recommendation: string
  repetitions: number
  series: number
  info: {
    description: string
    warning: object[]
    tags: string[]
  }
  time: number
  rest: number
  finished: boolean
  type: string
  selected: boolean
  doing: boolean
  working: {
    series: number
  }
  image: string
  video: string
}
