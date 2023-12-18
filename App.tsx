import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins'
import { NativeBaseProvider } from 'native-base'
import React from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'

import Index from './src'
import { theme } from './src/theme'

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold })

  if (!fontsLoaded) {
    return <ActivityIndicator />
  }

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Index />
    </NativeBaseProvider>
  )
}
