import { AuthProvider } from '@contexts/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import { Box } from 'native-base'
import React from 'react'

import AppRoutes from './routes'

export default function Index() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Box flex={1} bg="gray.700">
          <AppRoutes />
        </Box>
      </NavigationContainer>
    </AuthProvider>
  )
}
