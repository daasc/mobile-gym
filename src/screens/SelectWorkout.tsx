import Button from '@components/Button'
import { useAuth } from '@contexts/AuthContext'
import { IWorkoutDTO } from '@dtos/workout.dto'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { api } from '@services/http'
import {
  Heading,
  HStack,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { CheckBox, Icon } from 'react-native-elements'

export default function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [workouts, setWorkouts] = useState<IWorkoutDTO[]>([])
  const [selectedWorkouts, setSelected] = useState<IWorkoutDTO[]>([])
  const [loading, setLoading] = useState(false)
  const { user, updateUserData } = useAuth()
  const toast = useToast()

  const handleOpenExerciseDetails = (workout: IWorkoutDTO) => {
    navigate('ShowWorkout', { workout })
  }

  const handleGoBack = () => {
    navigate('Home')
    removeSelection()
  }

  const makeFilter = useCallback(() => {
    const filteredArray = workouts.filter((item) => {
      return !user?.workout.some((obj) => obj._id === item._id)
    })
    console.log('filteredArray', filteredArray)
    setWorkouts(filteredArray)
  }, [user?.workout, workouts])

  const setSelection = (workout: IWorkoutDTO) => {
    const newWorkouts = [...workouts]
    const result = newWorkouts.find((item) => item._id === workout._id)
    result.selected = !result?.selected || false
    setSelected(newWorkouts.filter((item) => item.selected))
    setWorkouts(newWorkouts)
  }

  const removeSelection = useCallback(() => {
    const newWorkouts = [...workouts]
    const result = newWorkouts.map((item) => {
      if (item.selected) {
        item.selected = false
      }
      return item
    })
    setWorkouts(result)
    setSelected([])
  }, [workouts])

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true)
      const bodyRequest = {
        workout: selectedWorkouts,
      }
      const response = await api.put(
        `client/workout/selected/${user?._id}`,
        bodyRequest,
      )
      updateUserData(response.data)
      toast.show({
        title: 'Treino Adicionado!',
        description: 'Aproveite seu treino!',
      })
      makeFilter()
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      removeSelection()
    }
  }, [
    makeFilter,
    removeSelection,
    selectedWorkouts,
    toast,
    updateUserData,
    user?._id,
  ])

  const getWorkout = useCallback(async () => {
    try {
      const response = await api.get('workout')
      const filteredArray = response.data.result.filter((item) => {
        return !user?.workout.some((obj) => obj._id === item._id)
      })
      setWorkouts(filteredArray)
    } catch (error) {
      console.log(error)
    }
  }, [user?.workout])

  useEffect(() => {
    getWorkout()
  }, [getWorkout])

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
            onPress={() => handleGoBack()}
          />

          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            Treinos
          </Heading>
          <HStack></HStack>
        </HStack>
      </VStack>
      <ScrollView pb={20}>
        <HStack my={5} flex={1} px={8} justifyContent={'space-between'}>
          <Text flex={1} fontSize={16} color="white" fontWeight="bold">
            Treinos Prontos
          </Text>
          <Text fontSize={16} color="white" fontWeight="bold">
            {selectedWorkouts.length}
          </Text>
        </HStack>

        {workouts.map((item, index) => (
          <View key={index} style={{ paddingHorizontal: 32 }}>
            <TouchableOpacity
              key={index}
              onPress={() => handleOpenExerciseDetails(item)}
            >
              <HStack
                bg="transparent"
                alignItems="center"
                p={2}
                pr={4}
                rounded="md"
                mb={3}
                key={index}
                borderColor={'gray.500'}
                borderWidth={1}
              >
                <VStack width={'1/4'} alignSelf={'center'}>
                  <Icon
                    name="dumbbell"
                    color={'#fff'}
                    type="font-awesome-5"
                  ></Icon>
                </VStack>
                <VStack flex={1}>
                  <Heading
                    fontSize="sm"
                    color={'orange.500'}
                    fontFamily="heading"
                  >
                    {item.name}
                  </Heading>

                  <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
                    {item.workoutDescription}
                  </Text>
                </VStack>
                <VStack ml={0.5}>
                  <CheckBox
                    checked={item.selected}
                    onPress={() => setSelection(item)}
                  />
                </VStack>
              </HStack>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <HStack px={8} py={8}>
        <Button
          loading={loading}
          isDisabled={selectedWorkouts.length === 0}
          title="Adicionar"
          onPress={() => onSubmit()}
        ></Button>
      </HStack>
    </VStack>
  )
}
