import Button from '@components/Button'
import { useAuth } from '@contexts/AuthContext'
import { IWorkoutDTO } from '@dtos/workout.dto'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { api } from '@services/http'
import { Heading, HStack, ScrollView, Text, VStack } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { CheckBox, Icon } from 'react-native-elements'

export default function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [workouts, setWorkouts] = useState<IWorkoutDTO[]>([])
  const [selectedWorkouts, setSelected] = useState<IWorkoutDTO[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const handleOpenExerciseDetails = (workout: IWorkoutDTO) => {
    navigate('ShowWorkout', { workout })
  }

  const handleGoBack = () => {
    navigate('Home')
  }

  const setSelection = (workout: IWorkoutDTO) => {
    const newWorkouts = [...workouts]
    const result = newWorkouts.find((item) => item._id === workout._id)
    result.selected = !result?.selected || false
    setSelected(newWorkouts.filter((item) => item.selected))
    setWorkouts(newWorkouts)
  }

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true)
      await api.put(`user/workout/selected/${user?._id}`, selectedWorkouts)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }, [selectedWorkouts, user?._id])

  const getWorkout = useCallback(async () => {
    try {
      const response = await api.get('workout')
      setWorkouts(response.data.result)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getWorkout()
  }, [])

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
            <TouchableOpacity onPress={() => handleOpenExerciseDetails(item)}>
              <HStack
                bg="transparent"
                minH="20"
                p={1}
                justifyContent="space-between"
                rounded="md"
                flexWrap={'wrap'}
                borderColor={'gray.500'}
                borderWidth={1}
                mb={3}
              >
                <VStack width={'1/4'} alignSelf={'center'}>
                  <Icon
                    name="dumbbell"
                    color={'#fff'}
                    type="font-awesome-5"
                  ></Icon>
                </VStack>
                <VStack width={'2/4'} flexWrap={'wrap'}>
                  <Text
                    flex={1}
                    width={'full'}
                    fontSize={16}
                    color={'orange.500'}
                    flexWrap={'wrap'}
                  >
                    {item.name}
                  </Text>
                  <Text
                    flex={1}
                    fontSize={16}
                    color={'orange.300'}
                    flexWrap={'wrap'}
                  >
                    {item.workoutDescription}
                  </Text>
                </VStack>
                <VStack width={'1/4'} alignSelf={'top'}>
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
