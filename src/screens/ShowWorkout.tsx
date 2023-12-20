// import Button from '@components/Button'
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
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [isConnect, setConnect] = useState(true)

  function handleGoBack() {
    navigate('SelectWorkout')
  }
  const handleStartExercise = (exercise: IExerciseDTO) => {
    navigate('Exercise', { exercise, workout })
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

  useEffect(() => {
    NetInfo.addEventListener((state) => {
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
          <Text my={5} flex={1} fontSize={16} color="white" fontWeight="bold">
            Exercícios
          </Text>
          {workout?.exercises.map((item, index) => {
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
                  borderColor="#2C2E30"
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
