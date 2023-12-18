import BodyPhoto from '@components/BodyPhoto'
import { IMeasurementDTO } from '@dtos/measurement.dto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { formatDate } from '@utils/format'
import { Heading, HStack, ScrollView, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

type Params = {
  measurement: {
    measurement: IMeasurementDTO[]
  }
}

export default function Report() {
  const route = useRoute<RouteProp<Params, 'measurement'>>()
  const measurements = route.params.measurement
  const PHOTO_SIZE = 33

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigate('Home')
  }
  function handleGoToReportDetails(measurement: IMeasurementDTO) {
    navigate('ReportDetails', { measurement, measurements })
  }
  const frontPhoto = (measurement: IMeasurementDTO) => {
    if (measurement.photos?.front) {
      return (
        <BodyPhoto
          source={{ uri: measurement.photos?.front }}
          alt="Foto do usuário"
          size={PHOTO_SIZE}
          marginRight={5}
        ></BodyPhoto>
      )
    }
  }
  const sidePhoto = (measurement: IMeasurementDTO) => {
    if (measurement.photos?.side) {
      return (
        <BodyPhoto
          source={{ uri: measurement.photos?.side }}
          alt="Foto do usuário"
          size={PHOTO_SIZE}
          marginRight={5}
        ></BodyPhoto>
      )
    }
  }
  const backPhoto = (measurement: IMeasurementDTO) => {
    if (measurement.photos?.back) {
      return (
        <BodyPhoto
          source={{ uri: measurement.photos?.back }}
          alt="Foto do usuário"
          size={PHOTO_SIZE}
          marginRight={5}
        ></BodyPhoto>
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
          {measurements.map((measurement, index) => (
            <VStack
              key={index}
              p={3}
              borderRadius={'md'}
              bg="transparent"
              borderColor={'gray.800'}
              borderWidth={2}
              style={{ gap: 3 }}
              mb={5}
            >
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <Text color={'#fff'} fontFamily="heading">
                  {formatDate(measurement.date)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleGoToReportDetails(measurement)}
                >
                  <HStack alignItems={'center'}>
                    <Text color={'#fff'}>Detalhes</Text>
                    <Icon name="chevron-right" color="#28E8B4" size={30} />
                  </HStack>
                </TouchableOpacity>
              </HStack>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <Text color={'#fff'} fontSize={17}>
                  Peso
                </Text>
                <Text color={'#fff'} fontSize={17}>
                  {measurement.weight}
                </Text>
              </HStack>
              <ScrollView horizontal mb={5}>
                {frontPhoto(measurement)}
                {sidePhoto(measurement)}
                {backPhoto(measurement)}
              </ScrollView>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  )
}
