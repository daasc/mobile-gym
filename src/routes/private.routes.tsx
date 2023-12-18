import HistorySvg from '@assets/history.svg'
import HomeSvg from '@assets/home.svg'
import ProfileSvg from '@assets/profile.svg'
import { IExerciseDTO } from '@dtos/exercise.dto'
import { IMeasurementDTO } from '@dtos/measurement.dto'
import { IWorkoutDTO } from '@dtos/workout.dto'
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import BodyMeasurement from '@screens/BodyMeasurement'
import CreateWorkout from '@screens/CreateWorkout'
import Exercise from '@screens/Exercise'
import ExerciseInfo from '@screens/ExerciseInfo'
import History from '@screens/History'
import Home from '@screens/Home'
import Payment from '@screens/Payment'
import Profile from '@screens/Profile'
import Report from '@screens/Report'
import ReportDetails from '@screens/ReportDetails'
import SelectWorkout from '@screens/SelectWorkout'
import SettingWorkout from '@screens/SettingWorkout'
import ShowWorkout from '@screens/ShowWorkout'
import StartExercise from '@screens/StartExercise'
import StartWorkout from '@screens/StartWorkout'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import { Icon } from 'react-native-elements'

type PrivateRoutes = {
  Home: undefined
  Payment: undefined
  Historico: undefined
  Perfil: undefined
  Exercise: {
    workout: IWorkoutDTO
    exercise: IExerciseDTO
  }
  CreateWorkout: undefined
  SelectWorkout: undefined
  ShowWorkout: {
    workout: IWorkoutDTO
  }
  ExerciseInfo: {
    exercise: IExerciseDTO
  }
  SettingWorkout: {
    exercises: IExerciseDTO[]
  }
  StartWorkout: {
    workout: IWorkoutDTO
  }
  StartExercise: {
    workout: IWorkoutDTO
    exercise: IExerciseDTO
  }
  BodyMeasurement: undefined
  Report: {
    measurement: IMeasurementDTO[]
  }
  ReportDetails: {
    measurements: IMeasurementDTO[]
    measurement: IMeasurementDTO
  }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<PrivateRoutes>

const Stack = createBottomTabNavigator<PrivateRoutes>()

export default function PrivateRoutes() {
  const { sizes, colors } = useTheme()

  const iconsSize = sizes[6]

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.orange[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconsSize} height={iconsSize} />
          ),
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="money-check" color={color} type="font-awesome-5"></Icon>
          ),
        }}
      />

      <Stack.Screen
        name="Historico"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconsSize} height={iconsSize} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Stack.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconsSize} height={iconsSize} />
          ),
        }}
      />
      <Stack.Screen
        name="Exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Stack.Screen
        name="CreateWorkout"
        component={CreateWorkout}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Stack.Screen
        name="ExerciseInfo"
        component={ExerciseInfo}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Stack.Screen
        name="SettingWorkout"
        component={SettingWorkout}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Stack.Screen
        name="StartWorkout"
        component={StartWorkout}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Stack.Screen
        name="StartExercise"
        component={StartExercise}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Stack.Screen
        name="BodyMeasurement"
        component={BodyMeasurement}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Stack.Screen
        name="Report"
        component={Report}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Stack.Screen
        name="SelectWorkout"
        component={SelectWorkout}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Stack.Screen
        name="ShowWorkout"
        component={ShowWorkout}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Stack.Screen
        name="ReportDetails"
        component={ReportDetails}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Stack.Navigator>
  )
}
