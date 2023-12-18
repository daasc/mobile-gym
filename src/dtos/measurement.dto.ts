export interface IMeasurementDTO {
  photos?: {
    front: string
    back: string
    side: string
  }
  date: Date
  objective?: string
  weight?: string
  height?: string
  bodyFat?: string
  neck?: string
  shoulder?: string
  chest?: string
  waist?: string
  biceps?: string
  forearm?: string
  wrist?: string
  buttocks?: string
  hip?: string
  calf?: string
  ankle?: string
}
