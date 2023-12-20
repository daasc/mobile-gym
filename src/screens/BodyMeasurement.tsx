import BodyPhoto from '@components/BodyPhoto'
import Button from '@components/Button'
import Input from '@components/Input'
import { useAuth } from '@contexts/AuthContext'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { api } from '@services/http'
import * as ImagePicker from 'expo-image-picker'
import {
  Heading,
  HStack,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base'
import React, { useCallback, useState } from 'react'
import { Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import MaskInput from 'react-native-mask-input'

import backImage from '../assets/human-body.jpg'
import frontImage from '../assets/human-body-frontal.jpg'
import sideImage from '../assets/human-body-side.jpg'

type Measurement = {
  photos: {
    front: string
    back: string
    side: string
  }
  date: Date
  objective: string
  weight: string
  height: string
  bodyFat: string
  neck: string
  shoulder: string
  chest: string
  waist: string
  biceps: string
  forearm: string
  wrist: string
  buttocks: string
  hip: string
  calf: string
  ankle: string
}

export default function BodyMeasurement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [frontPhoto, setUserPhotoFront] = useState()
  const [backPhoto, setUserPhotoBack] = useState()
  const [sidePhoto, setUserPhotoSide] = useState()
  const toast = useToast()
  const MASK_M = [/\d/, /\d/, /\d/, '.', /\d/]
  const MASK_G = [/\d/, /\d/, '.', /\d/]
  const PHOTO_SIZE = 33

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  const [measurement, setMeasurement] = useState<Measurement>({
    date,
    objective: '',
    height: '',
    weight: '',
    bodyFat: '',
    neck: '',
    shoulder: '',
    chest: '',
    waist: '',
    biceps: '',
    forearm: '',
    wrist: '',
    buttocks: '',
    hip: '',
    calf: '',
    ankle: '',
    photos: {
      front: '',
      back: '',
      side: '',
    },
  })

  const handleDateChange = (_: null, selectedDate: Date) => {
    const currentDate = selectedDate || date
    setDate(currentDate)
  }

  function handleGoBack() {
    navigate('Home')
  }

  const handleUserPhotoSelect = useCallback(async (typePhoto: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (typePhoto === 'front') {
        setUserPhotoFront(result.assets[0].uri)
      }
      if (typePhoto === 'back') {
        setUserPhotoBack(result.assets[0].uri)
      }
      if (typePhoto === 'side') {
        setUserPhotoSide(result.assets[0].uri)
      }
    }
  }, [])

  const urlFrontPhoto = () => {
    if (frontPhoto) {
      return { uri: frontPhoto }
    }
    return frontImage
  }

  const urlBackPhoto = () => {
    if (backPhoto) {
      return { uri: backPhoto }
    }
    return backImage
  }

  const urlSidePhoto = () => {
    if (sidePhoto) {
      return { uri: sidePhoto }
    }
    return sideImage
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanForm = () => {
    setUserPhotoFront(undefined)
    setUserPhotoBack(undefined)
    setUserPhotoSide(undefined)
    setMeasurement({
      date,
      objective: '',
      height: '',
      weight: '',
      bodyFat: '',
      neck: '',
      shoulder: '',
      chest: '',
      waist: '',
      biceps: '',
      forearm: '',
      wrist: '',
      buttocks: '',
      hip: '',
      calf: '',
      ankle: '',
      photos: {
        front: '',
        back: '',
        side: '',
      },
    })
  }

  const onSubmit = useCallback(async () => {
    try {
      let urlsPhoto = null
      setLoading(true)
      if (!measurement.weight || !measurement.height) {
        Alert.alert('Campos Peso e Altura são obrigatórios!')
        return
      }

      const formData = new FormData()
      if (frontPhoto) {
        formData.append('images', {
          uri: frontPhoto,
          type: 'image/jpeg',
          name: 'front.jpg',
        })
      }
      if (backPhoto) {
        formData.append('images', {
          uri: backPhoto,
          type: 'image/jpeg',
          name: 'back.jpg',
        })
      }
      if (sidePhoto) {
        formData.append('images', {
          uri: sidePhoto,
          type: 'image/jpeg',
          name: 'side.jpg',
        })
      }
      if (frontPhoto || backPhoto || sidePhoto) {
        urlsPhoto = await api.post('client/upload/body', formData)

        for (const photo of urlsPhoto.data.imagePaths) {
          if (photo.originalname.includes('front')) {
            measurement.photos.front = photo.originalname
          }
          if (photo.originalname.includes('side')) {
            measurement.photos.side = photo.originalname
          }
          if (photo.originalname.includes('back')) {
            measurement.photos.back = photo.originalname
          }
        }
      }

      await api.post('measurement', {
        ...measurement,
        user_id: user?.user_id,
        client_id: user?._id,
      })
      toast.show({
        title: 'Cadastrado com sucesso!',
      })
      cleanForm()
    } catch (error) {
      toast.show({
        title: 'Ups! Houve um problema',
        description: 'Não conseguimos atualizar suas informações de perfil',
      })
    } finally {
      setLoading(false)
    }
  }, [
    backPhoto,
    cleanForm,
    frontPhoto,
    measurement,
    sidePhoto,
    toast,
    user?._id,
    user?.user_id,
  ])
  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Icon
            name="chevron-left"
            color="#fff"
            size={30}
            onPress={handleGoBack}
          />

          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            Medidas Corporais
          </Heading>
          <HStack></HStack>
        </HStack>
      </VStack>

      <ScrollView pb={20}>
        <VStack px={8} py={8}>
          <ScrollView horizontal mb={5}>
            <TouchableOpacity onPress={() => handleUserPhotoSelect('front')}>
              <BodyPhoto
                source={urlFrontPhoto()}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
                marginRight={5}
              ></BodyPhoto>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUserPhotoSelect('side')}>
              <BodyPhoto
                source={urlSidePhoto()}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
                marginRight={5}
              ></BodyPhoto>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUserPhotoSelect('back')}>
              <BodyPhoto
                source={urlBackPhoto()}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              ></BodyPhoto>
            </TouchableOpacity>
          </ScrollView>
          <Text style={{ color: '#fff' }}>Data</Text>
          <DateTimePicker
            value={date}
            mode="date"
            locale="pt-BR"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            timeZoneName={'America/Sao_Paulo'}
            style={styles.datePicker}
            themeVariant="dark"
            onChange={() => handleDateChange}
          />
          <Input
            bg="gray.600"
            onChangeText={(text) =>
              setMeasurement({
                ...measurement,
                objective: text,
              })
            }
            value={measurement.objective}
            placeholder="Objetivo"
          ></Input>
          <MaskInput
            value={measurement.weight}
            placeholder="Peso, kg"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                weight: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.height}
            placeholder="Altura, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                height: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.bodyFat}
            placeholder="% de gordura coporal"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                bodyFat: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.chest}
            placeholder="Peito, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                chest: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.neck}
            placeholder="Pescosço, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                neck: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.shoulder}
            placeholder="Ombros, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                shoulder: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.waist}
            placeholder="Cintura, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                waist: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.biceps}
            placeholder="Bíceps, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                biceps: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.forearm}
            placeholder="Antebraço, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                forearm: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.wrist}
            placeholder="Punho, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                wrist: e,
              })
            }}
            mask={text => {
              // eslint-disable-next-line prettier/prettier
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.buttocks}
            placeholder="Glúteos, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                buttocks: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.hip}
            placeholder="Quadril, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                hip: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.calf}
            placeholder="Panturrilha, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                calf: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
          <MaskInput
            value={measurement.ankle}
            placeholder="Tornozelo, cm"
            placeholderTextColor={'#fff'}
            style={{
              fontSize: 16,
              backgroundColor: '#202024',
              color: '#fff',
              height: 45,
              padding: 8,
              marginVertical: 10,
            }}
            onChangeText={e => {
              setMeasurement({
                ...measurement,
                ankle: e,
              })
            }}
            mask={text => {
              if (text.replace(/\D+/g, '').length > 3) {
                return MASK_M
              } else {
                return MASK_G
              }
            }}
          />
        </VStack>
      </ScrollView>
      <HStack px={8} py={8}>
        <Button loading={loading} title="Finalizar" onPress={onSubmit}></Button>
      </HStack>
    </VStack>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  pickedDateContainer: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  pickedDate: {
    fontSize: 18,
    color: 'black',
  },
  btnContainer: {
    padding: 30,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: '#fff',
  },
})
