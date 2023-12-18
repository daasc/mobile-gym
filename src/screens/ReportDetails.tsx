import BodyPhoto from '@components/BodyPhoto'
import FullScreenImageModal from '@components/FullScreenImage'
import { IMeasurementDTO } from '@dtos/measurement.dto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { formatDate } from '@utils/format'
import { translateKey } from '@utils/translateKey'
import { Heading, HStack, ScrollView, Text, VStack } from 'native-base'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

type Params = {
  measurement: {
    measurement: IMeasurementDTO
    measurements: IMeasurementDTO[]
  }
}

export default function Report() {
  const route = useRoute<RouteProp<Params, 'measurement'>>()
  const measurement = route.params.measurement
  const measurements = route.params.measurements
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const keyFilter = [
    '_id',
    'photos',
    'objective',
    'date',
    'createdAt',
    'updatedAt',
    '__v',
    'user_id',
    'client_id',
  ]
  const keyArray = Object.keys(measurement).filter(
    item => !keyFilter.includes(item),
  )

  const PHOTO_SIZE = 33

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  const openModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
  }

  const closeModal = () => {
    setSelectedImageUrl(null)
  }

  const showObjective = () => {
    if (measurement.objective) {
      return (
        <HStack
          justifyContent={'space-between'}
          alignItems={'center'}
          borderColor={'gray.800'}
          borderWidth={2}
          borderRadius={'md'}
          p={3}
          mb={3}
        >
          <Text color={'#fff'} fontSize={17}>
            {measurement.objective}
          </Text>
        </HStack>
      )
    }
  }

  const showPhotos = () => {
    if (
      measurement.photos?.back ||
      measurement.photos?.front ||
      measurement.photos?.side
    ) {
      return (
        <VStack
          p={3}
          borderRadius={'md'}
          bg="transparent"
          borderColor={'gray.800'}
          borderWidth={2}
          style={{ gap: 3 }}
          mb={5}
        >
          <ScrollView horizontal mb={5}>
            {frontPhoto(measurement)}
            {sidePhoto(measurement)}
            {backPhoto(measurement)}
          </ScrollView>
        </VStack>
      )
    }
  }

  function handleGoBack() {
    navigate('Report', { measurement: measurements })
  }
  const frontPhoto = (measurement: IMeasurementDTO) => {
    if (measurement.photos?.front) {
      return (
        <TouchableOpacity onPress={() => openModal(measurement.photos?.front)}>
          <BodyPhoto
            source={{ uri: measurement.photos?.front }}
            alt="Foto do usuário"
            size={PHOTO_SIZE}
            marginRight={5}
          ></BodyPhoto>
        </TouchableOpacity>
      )
    }
  }
  const sidePhoto = (measurement: IMeasurementDTO) => {
    if (measurement.photos?.side) {
      return (
        <TouchableOpacity onPress={() => openModal(measurement.photos?.side)}>
          <BodyPhoto
            source={{ uri: measurement.photos?.side }}
            alt="Foto do usuário"
            size={PHOTO_SIZE}
            marginRight={5}
          ></BodyPhoto>
        </TouchableOpacity>
      )
    }
  }
  const backPhoto = (measurement: IMeasurementDTO) => {
    if (measurement.photos?.back) {
      return (
        <TouchableOpacity onPress={() => openModal(measurement.photos?.back)}>
          <BodyPhoto
            source={{ uri: measurement.photos?.back }}
            alt="Foto do usuário"
            size={PHOTO_SIZE}
            marginRight={5}
          ></BodyPhoto>
        </TouchableOpacity>
      )
    }
  }

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
            Relatório
          </Heading>
          <HStack></HStack>
        </HStack>
      </VStack>
      <ScrollView pb={20}>
        <VStack px={8} py={8}>
          <Text color={'#fff'} fontFamily="heading" marginBottom={5}>
            {formatDate(measurement.date)}
          </Text>
          {showPhotos()}
          {showObjective()}
          {keyArray.map((value, index) => {
            const dd = { ...measurement }
            if (dd[value]) {
              return (
                <HStack
                  key={index}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  borderColor={'gray.800'}
                  borderWidth={2}
                  borderRadius={'md'}
                  p={3}
                  mb={3}
                >
                  <Text color={'#fff'} fontSize={17}>
                    {translateKey({ key: value })}
                  </Text>
                  <Text color={'#fff'} fontSize={17}>
                    {dd[value]}
                  </Text>
                </HStack>
              )
            }
          })}
        </VStack>

        <FullScreenImageModal
          imageUrl={selectedImageUrl}
          onRequestClose={closeModal}
        />
      </ScrollView>
    </VStack>
  )
}
