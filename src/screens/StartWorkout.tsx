// import Button from '@components/Button'
import CircularProgressBar from '@components/CircleProgress'
import { useAuth } from '@contexts/AuthContext'
import { IExerciseDTO } from '@dtos/exercise.dto'
import { IWorkoutDTO } from '@dtos/workout.dto'
import NetInfo from '@react-native-community/netinfo'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { Heading, HStack, Image, ScrollView, Text, VStack } from 'native-base'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

import RemadaUnilateralComHalteresJPJ from '../assets/remada-unilateral-com-halteres-600x600.jpg'

type Params = {
  workout: {
    workout: IWorkoutDTO
  }
}

export default function StartWorkout() {
  const route = useRoute<RouteProp<Params, 'workout'>>()
  const workout = route.params.workout
  const { user } = useAuth()
  const workoutParams = user?.workout.find(item => workout._id === item._id)
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [isConnect, setConnect] = useState(true)

  function handleGoBack() {
    navigate('Home')
  }
  const handleStartExercise = (exercise: IExerciseDTO) => {
    navigate('StartExercise', { exercise, workout })
  }

  const checkWorkout = () => {
    if (workoutParams.doing) {
      return '#fb923c'
    }
    if (workoutParams.finished) {
      return '#308005'
    }
    return '#29292E'
  }

  const showImage = (item: IExerciseDTO) => {
    if (isConnect) {
      return (
        <Image
          source={{ uri: item.image }}
          alt={item.name}
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="center"
        />
      )
    }

    return (
      <Image
        source={RemadaUnilateralComHalteresJPJ}
        alt="Sem internet"
        w={16}
        h={16}
        rounded="md"
        mr={4}
        resizeMode="center"
      />
    )
  }

  const countExerciseFinished = () => {
    const amount = workoutParams.exercises.length
    const finished = workoutParams.exercises.reduce(
      (accumulator, currentObject) => {
        if (currentObject.finished === true) {
          return accumulator + 1
        } else {
          return accumulator
        }
      },
      0,
    )

    return ((finished / amount) * 100).toFixed(0)
  }
  useEffect(() => {
    NetInfo.addEventListener((state) => {
      console.log('isConnected', state.isConnected)
      if (!state.isConnected) {
        setConnect(false)
      }
    })
  })

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
            Começar Treino
          </Heading>
          <HStack></HStack>
        </HStack>
      </VStack>
      <ScrollView pb={20}>
        <VStack flex={1} px={8} my={5}>
          <HStack
            bg="transparent"
            minH="20"
            p={2}
            pr={4}
            justifyContent="space-between"
            rounded="md"
            alignItems={'center'}
            flexWrap={'wrap'}
            borderColor={checkWorkout()}
            borderWidth={1}
            mb={3}
          >
            <VStack width={'1/5'}>
              <CircularProgressBar
                percent={countExerciseFinished()}
                color={checkWorkout()}
              ></CircularProgressBar>
            </VStack>
            <VStack width={'3/5'} flexWrap={'wrap'}>
              <Text
                flex={1}
                width={'full'}
                fontSize={16}
                color={'orange.500'}
                flexWrap={'wrap'}
              >
                {workoutParams.name}
              </Text>
              <Text
                flex={1}
                fontSize={16}
                color={'orange.300'}
                flexWrap={'wrap'}
              >
                {workoutParams.workoutDescription}
              </Text>
            </VStack>
            <VStack width={'1/5'} style={{ justifyContent: 'space-between' }}>
              <Text color={'white'} fontWeight={'bold'}>
                {Math.floor(workoutParams?.time / 3600)}h{' '}
                {Math.floor((workoutParams?.time % 3600) / 60)}m
              </Text>
            </VStack>
          </HStack>
          <Text my={5} flex={1} fontSize={16} color="white" fontWeight="bold">
            Seus exercícios
          </Text>
          {workoutParams?.exercises.map((item, index) => {
            let colorBorderDoing = item.doing ? '#1A93F2' : '#2C2E30'
            let percentage = ''
            if (item.doing) {
              percentage = `${(
                (item.working.series / item.series) *
                100
              ).toFixed(0)}%`
            }
            if (item.finished) {
              colorBorderDoing = '#308005'
              percentage = '100%'
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStartExercise(item)}
              >
                <HStack
                  bg="gray.500"
                  alignItems="center"
                  p={2}
                  pr={4}
                  rounded="md"
                  mb={3}
                  key={index}
                  borderColor={colorBorderDoing}
                  borderWidth={1}
                >
                  {showImage(item)}
                  <VStack flex={1}>
                    <Heading fontSize="sm" color="white" fontFamily="heading">
                      {item.name}
                    </Heading>

                    <Text
                      fontSize="sm"
                      color="gray.200"
                      mt={1}
                      numberOfLines={2}
                    >
                      {item.series} series x {item.repetitions} repetições
                    </Text>
                  </VStack>
                  <VStack ml={0.5}>
                    <Text color={'#fff'} fontFamily="heading">
                      {percentage}
                    </Text>
                    <Icon name="chevron-right" color="#fff" size={30} />
                  </VStack>
                </HStack>
              </TouchableOpacity>
            )
          })}
        </VStack>
      </ScrollView>
    </VStack>
  )
}
