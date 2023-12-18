import Button from '@components/Button'
import Input from '@components/Input'
import ScreenHeader from '@components/ScreenHeader'
import UserPhoto from '@components/UserPhoto'
import { useAuth } from '@contexts/AuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/http'
import { onlyNumbers } from '@utils/numbers'
import * as ImagePicker from 'expo-image-picker'
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from 'native-base'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity } from 'react-native'
import { Masks, useMaskedInputProps } from 'react-native-mask-input'
import * as yup from 'yup'

import UserPhotoImage from '../assets/userPhotoDefault.png'

const PHOTO_SIZE = 33

type Password = {
  newPassword: string
  oldPassword: string
  passwordConfirm: string
}

const SignUpSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Informe a senha')
    .min(8, 'A senha deve ter pelo menos 8 digitos')
    .matches(/.*[A-Z].*/, 'A Senha deve conter pelo menos uma letra minúscula'),
  newPassword: yup
    .string()
    .required('Informe a senha')
    .min(8, 'A senha deve ter pelo menos 8 digitos')
    .matches(/.*[A-Z].*/, 'A Senha deve conter pelo menos uma letra minúscula'),
  passwordConfirm: yup
    .string()
    .required('Confirme a senha')
    .oneOf(
      [yup.ref('newPassword'), null],
      'A confirmação da senha não confere',
    ),
})

export default function Profile() {
  const { user, updateUserData } = useAuth()
  const [phone, setPhone] = useState(user?.phoneNumber)
  const [loading, setLoading] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors },
    reset
  } = useForm<Password>({
    resolver: yupResolver(SignUpSchema),
  })

  const { control, handleSubmit } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  })
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [, setUserPhoto] = useState('https://github.com/HTM1000.png')

  const userId = user?._id

  const toast = useToast()

  const urlPhone = () => {
    if (user?.photo) {
      return { uri: user.photo }
    }
    return UserPhotoImage
  }
  const maskedInputProps = useMaskedInputProps({
    value: phone,
    onChangeText: setPhone,
    mask: Masks.BRL_PHONE,
    maskAutoComplete: false,
  })

  const changePassword = useCallback(
    async ({ newPassword, oldPassword }: Password) => {
      try {
        setLoadingPassword(true)
        await api.put(`client/password/${userId}`, { newPassword, oldPassword })
        toast.show({ title: 'Senha Atualizada com sucesso!' })
        reset()
      } catch (error) {
        toast.show({ title: error.message })
      } finally {
        setLoadingPassword(false)
      }
    },
    [reset, toast, userId],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    async (data: any) => {
      const phoneNumber = onlyNumbers(phone)

      if (phoneNumber.length < 11) {
        toast.show({
          title: 'Número de telefone inválido',
        })
        return
      }
      const requestData = {
        ...data,
        phoneNumber,
      }

      try {
        setLoading(true)
        const response = await api.put(`client/${userId}`, requestData)

        const userData = { ...user }

        userData.name = response.data.name
        userData.email = response.data.email
        userData.phoneNumber = response.data.phoneNumber

        updateUserData(userData)

        toast.show({
          title: 'Perfil atualizado!',
        })
      } catch (error) {
        toast.show({
          title: 'Ups! Houve um problema',
          description: 'Não conseguimos atualizar suas informações de perfil',
        })
      } finally {
        setLoading(false)
      }
    },
    [phone, toast, updateUserData, user, userId],
  )

  const handleUserPhotoSelect = useCallback(async () => {
    setPhotoIsLoading(true)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        setUserPhoto(result.assets[0].uri)
      }
      const formData = new FormData()

      formData.append('image', {
        uri: result.assets[0]?.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      })

      const urlPhoto = await api.put(`client/upload/${userId}`, formData)
      const userData = { ...user }

      userData.photo = urlPhoto.data.imageUrl

      updateUserData(userData)

      toast.show({
        title: 'Foto atualizada!',
      })
    } catch (e) {
      toast.show({
        title: 'Ups! Houve um problema',
        description: 'Não conseguimos atualizar suas informações de perfil',
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }, [toast, updateUserData, user, userId])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView pb={20}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={urlPhone()}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={() => handleUserPhotoSelect()}>
            <Text
              color="orange.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                placeholder="Name"
              />
            )}
            name="name"
            rules={{ required: 'Nome é Campo Obrigatório.' }}
          />
          {errors.name && (
            <Text fontWeight="bold" fontSize="md" color={'red.500'}>
              {errors.name.message}
            </Text>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                placeholder="Email"
              />
            )}
            rules={{
              required: 'Email é Campo Obrigatório.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalido!',
              },
            }}
          />
          {errors.email && (
            <Text fontWeight="bold" fontSize="md" color={'red.500'}>
              {errors.email.message}
            </Text>
          )}

          <Input
            {...maskedInputProps}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            autoCapitalize="none"
            bg="gray.600"
          />

          <Button
            loading={loading}
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(onSubmit)}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Alterar Senha
          </Heading>

          <Controller
            control={controlPassword}
            name="oldPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha Atual"
                secureTextEntry
                textContentType={'oneTimeCode'}
                onChangeText={onChange}
                bg="gray.600"
                value={value}
                errorMessage={errors.oldPassword?.message}
              />
            )}
          />
          <Controller
            control={controlPassword}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nova Senha"
                secureTextEntry
                textContentType={'oneTimeCode'}
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.newPassword?.message}
              />
            )}
          />
          <Controller
            control={controlPassword}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a Senha"
                secureTextEntry
                onChangeText={onChange}
                bg="gray.600"
                value={value}
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            loading={loadingPassword}
            title="Atualizar Senha"
            mt={4}
            onPress={handleSubmitPassword(changePassword)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
