import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'
import SignIn from '@screens/SignIn'
import SignUp from '@screens/SignUp'
import VerifyPhone from '@screens/VerifyPhone'

const Stack = createStackNavigator()

type PublicRoutes = {
  VerifyPhone: undefined
  SignIn: {
    phone: string
    token: string
  }
  SignUp: {
    phone: string
    token: string
    clientId: string
  }
}

export type AuthNavigatorRoutesProps = StackNavigationProp<PublicRoutes>

export default function PublicRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="VerifyPhone"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="VerifyPhone" component={VerifyPhone} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}
