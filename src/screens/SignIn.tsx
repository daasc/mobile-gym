import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import Button from '@components/Button'
import Input from '@components/Input'
import { useAuth } from '@contexts/AuthContext'
import { useRoute } from '@react-navigation/native'
import { onlyNumbers } from '@utils/numbers'
import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { Masks, useMaskedInputProps } from 'react-native-mask-input'

type FormData = {
  phone: string
  password: string
}

export default function SignIn() {
  const route = useRoute()
  const { signIn } = useAuth()
  const [phone, setPhone] = useState(route?.params?.phone)
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      phone: route?.params?.phone,
      password: '',
    },
  })
  const maskedInputProps = useMaskedInputProps({
    value: phone,
    onChangeText: setPhone,
    mask: Masks.BRL_PHONE,
    maskAutoComplete: false,
  })

  const handleSignIn = async ({ phone, password }: FormData) => {
    try {
      const phoneNumber = onlyNumbers(phone)
      setLoading(true)
      await signIn({ phoneNumber, password, token: route?.params?.token })
    } catch (error) {
      Alert.alert('Não foi possivel entrar!', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando em uma bicicleta"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse sua conta
          </Heading>

          <Input
            {...maskedInputProps}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Button
            loading={loading}
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
