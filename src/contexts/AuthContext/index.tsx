import FabButton from '@components/FabButton'
import { IUserDTO } from '@dtos/user.dto'
import { IWorkoutDTO } from '@dtos/workout.dto'
import NetInfo from '@react-native-community/netinfo'
import { api } from '@services/http'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageGetUser,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import { useToast } from 'native-base'
import {
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Alert } from 'react-native'

interface SignInData {
  phoneNumber: string
  password: string
  token: string
}

type AuthContextData = {
  user: IUserDTO | null
  signIn(data: SignInData): Promise<void>
  signOut(): void
  isLoadingUserStorageData: boolean
  updateUserData(user: IUserDTO): Promise<void>
  isAuthenticated: boolean
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const toast = useToast()
  const [user, setUser] = useState<IUserDTO | null>(null)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(false)

  const isAuthenticated = !!user

  const setUserAndAcessToken = async (
    userData: IUserDTO | null,
    accessToken: string | null,
  ) => {
    !accessToken
      ? (api.defaults.headers.common.Authorization = null)
      : (api.defaults.headers.common.Authorization = `Bearer "${accessToken}"`)
    setUser(userData)
    await storageUserSave(userData)
    await storageAuthTokenSave(accessToken)
  }

  const signIn = async ({ phoneNumber, password, token }: SignInData) => {
    setIsLoadingUserStorageData(true)
    try {
      const { data } = await api.post(
        'client/authenticate',
        {
          phoneNumber,
          password,
        },
        {
          headers: {
            Authorization: `Bearer "${token}"`,
          },
        },
      )

      setUserAndAcessToken(data.data, data.token)
    } catch (error) {
      toast.show({
        title: 'Erro ao fazer login',
        description: error.message,
      })
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)

      toast.show({
        description: 'Sua sessão expirou! Faça login novamente.',
      })
      api.defaults.headers.common.Authorization = null
      setUser(null)
      storageUserRemove()
      storageAuthTokenRemove()
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [toast])

  const updateUserData = async (userData: IUserDTO | null) => {
    setUser(userData)
    await storageUserSave(userData)
  }

  const loadData = useCallback(async () => {
    setIsLoadingUserStorageData(true)
    const user = await storageGetUser()
    const token = await storageAuthTokenGet()

    setUserAndAcessToken(user, token)
    setIsLoadingUserStorageData(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenInstance(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  const finishedWorkout = async (workout: IWorkoutDTO) => {
    const token = await storageAuthTokenGet()
    setIsLoadingUserStorageData(true)
    try {
      await api.put(`client/${user?._id}/finish/workout`, workout, {
        headers: {
          Authorization: `Bearer "${token}"`,
        },
      })
      toast.show({
        title: 'Treino finalizado!',
      })
    } catch (error) {
      toast.show({
        title: 'Erro ao fazer finalizar treino',
        description: 'Tente novamente mais tarde',
      })
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }
  const [seriesFinished, setSeriesFinished] = useState(1)

  const setSeries = (number: SetStateAction<number>) => {
    setSeriesFinished(number)
    if (user?.working) {
      const working = user.workout.find((item) => item.doing)
      const indexWorkout = user.workout.findIndex(
        item => working?._id === item._id,
      )
      const index = working.exercises.findIndex(item => item.doing === true)
      const exercise = working.exercises[index]
      const amount = working.exercises.length
      const finished = working.exercises.reduce(
        (accumulator, currentObject) => {
          if (currentObject.finished === true) {
            return accumulator + 1
          } else {
            return accumulator
          }
        },
        0,
      )
      if (seriesFinished === exercise.series) {
        exercise.finished = true
        exercise.doing = false
        user.working = false
        setSeriesFinished(1)
        if (amount === finished + 1) {
          user.workout[indexWorkout].doing = false
          user.workout[indexWorkout].finished = true
        }

        const userData = { ...user }

        updateUserData(userData)

        if (amount === finished + 1) {
          user.workout[indexWorkout].timeFinished = new Date()
          const userData = { ...user }

          updateUserData(userData)

          Alert.alert('Treino finalizado!')

          NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
              Alert.alert('Você está sem conexão com a internet!')
            }
          })

          finishedWorkout(user.workout[indexWorkout])
        } else {
          Alert.alert('Exercisio finalizado!', 'Inicie o novo exercisio')
        }
      } else {
        exercise.working = { series: seriesFinished + 1 }
        const userData = { ...user }

        updateUserData(userData)
      }
    }
  }

  const fabButton = () => {
    if (user?.working) {
      const working = user.workout.find((item) => item.doing)
      const index = working.exercises.findIndex((item) => item.doing === true)
      const exercise = working.exercises[index]

      return (
        <FabButton
          restTime={exercise.rest}
          setSeries={setSeries}
          series={exercise.series}
          repetitions={exercise.repetitions}
          seriesFinished={seriesFinished}
          timeCardio={exercise.time}
          typeExercise={exercise.type}
        ></FabButton>
      )
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUserData,
        isLoadingUserStorageData,
        isAuthenticated,
      }}
    >
      {children}
      {fabButton()}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
