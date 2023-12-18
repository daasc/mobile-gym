import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import Button from '@components/Button'
import Input from '@components/Input'
import { useAuth } from '@contexts/AuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/public.routes'
import { api } from '@services/http'
import { onlyNumbers } from '@utils/numbers'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormDataProps {
  password: string
  passwordConfirm: string
}

const SignUpSchema = yup.object({
  password: yup
    .string()
    .required('Informe a senha')
    .min(8, 'A senha deve ter pelo menos 8 digitos')
    .matches(/.*[A-Z].*/, 'A Senha deve conter pelo menos uma letra minúscula'),
  passwordConfirm: yup
    .string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password'), null], 'A confirmação da senha não confere'),
})

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(SignUpSchema),
  })
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const route = useRoute()
  const { signIn } = useAuth()

  const { navigate } = useNavigation<AuthNavigatorRoutesProps>()

  const handleReturnLogin = useCallback(() => {
    navigate('VerifyPhone')
  }, [navigate])

  const handleSignUp = async ({ password }: FormDataProps) => {
    setLoading(true)
    try {
      await api.put(
        `client/${route?.params?.clientId}`,
        {
          password,
        },
        {
          headers: {
            authorization: `Bearer "${route?.params?.token}"`,
          },
        },
      )

      await signIn({
        phoneNumber: onlyNumbers(route?.params?.phone),
        password,
        token: route?.params?.token,
      })
      toast.show({
        description: 'Senha criada com sucesso',
      })
    } catch (error) {
      console.log(error)
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
            Crie sua senha
          </Heading>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            loading={loading}
            title="Criar senha"
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>

        <Button
          loading={false}
          isDisabled={loading}
          title="Voltar para validação"
          variant="outline"
          mt={20}
          onPress={handleReturnLogin}
        />
      </VStack>
    </ScrollView>
  )
}
