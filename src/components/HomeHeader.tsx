import { useAuth } from '@contexts/AuthContext'
import { MaterialIcons } from '@expo/vector-icons'
import { Heading, HStack, Icon, Pressable, Text, VStack } from 'native-base'
import React from 'react'
import { Alert } from 'react-native'

import UserPhotoImage from '../assets/userPhotoDefault.png'
import UserPhoto from './UserPhoto'

export default function HomeHeader() {
  const { signOut, user } = useAuth()

  const handleSignOut = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Sair', onPress: () => signOut() },
    ])
  }

  const urlPhone = () => {
    if (user?.photo) {
      return { uri: user.photo }
    }
    return UserPhotoImage
  }

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto source={urlPhone()} size={16} alt="Imagem do usuario" mr={4} />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user?.name}
        </Heading>
      </VStack>

      <Pressable onPress={handleSignOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </Pressable>
    </HStack>
  )
}
