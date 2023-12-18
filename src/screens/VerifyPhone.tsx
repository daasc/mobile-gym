import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import Button from '@components/Button'
import Input from '@components/Input'
import { useNavigation } from '@react-navigation/native'
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
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Masks, useMaskedInputProps } from 'react-native-mask-input'

export default function VerifyPhone() {
  const toast = useToast()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { navigate } = useNavigation<AuthNavigatorRoutesProps>()

  const maskedInputProps = useMaskedInputProps({
    value: phone,
    onChangeText: setPhone,
    mask: Masks.BRL_PHONE,
    maskAutoComplete: false,
  })

  const handleSignIn = async () => {
    const phoneNumber = onlyNumbers(phone)

    if (phoneNumber.length < 11) {
      toast.show({
        title: 'Número de telefone inválido',
      })
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/verify', {
        phoneNumber,
      })
      if (response.data.data.hasLogin) {
        navigate('SignIn', {
          phone,
          token: response.data.token,
        })
        return
      }
      navigate('SignUp', {
        token: response.data.token,
        clientId: response.data.data._id,
        phone,
      })
    } catch (error) {
      Alert.alert(
        'Não foi possivel encontrar o telefone!',
        'Tente novamente mais tarde. Ou fale com o administrador',
      )
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
            Digite seu telefone
          </Heading>

          <Input
            {...maskedInputProps}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Button loading={loading} onPress={handleSignIn} title="Verificar" />
        </Center>
      </VStack>
    </ScrollView>
  )
}
