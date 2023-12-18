import Loading from '@components/Loading'
import { useAuth } from '@contexts/AuthContext'
import { DefaultTheme } from '@react-navigation/native'
import { useTheme } from 'native-base'
import React from 'react'

import PrivateRoutes from './private.routes'
import PublicRoutes from './public.routes'

export default function AppRoutes() {
  const { isAuthenticated, isLoadingUserStorageData } = useAuth()
  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  if (isLoadingUserStorageData) {
    return <Loading />
  }
  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />
}
