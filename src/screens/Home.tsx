import Button from '@components/Button'
import HomeHeader from '@components/HomeHeader'
import WorkoutCard from '@components/WorkoutCard'
import { useAuth } from '@contexts/AuthContext'
import { IGymDTO } from '@dtos/gym.dto'
import { IMeasurementDTO } from '@dtos/measurement.dto'
import { IWorkoutDTO } from '@dtos/workout.dto'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { api } from '@services/http'
import { formatDate } from '@utils/format'
import { Box, HStack, ScrollView, Text, VStack } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [measurements, setMeasurements] = useState<IMeasurementDTO[]>([])
  const { user, updateUserData } = useAuth()
  const [gym, setGym] = useState<IGymDTO>()

  const handleGoToBody = useCallback(() => {
    navigate('BodyMeasurement')
  }, [navigate])

  const handleCreateWorkout = useCallback(() => {
    navigate('CreateWorkout')
  }, [navigate])

  const handleSelectWorkout = useCallback(() => {
    navigate('SelectWorkout')
  }, [navigate])

  const handleOpenExerciseDetails = (workout: IWorkoutDTO) => {
    navigate('StartWorkout', { workout })
  }
  const disableClick = (workout: IWorkoutDTO) => {
    const workoutDoing = user?.workout.some(workout => workout.doing)
    const workoutFinished = user?.workout.some(workout => workout.finished)
    if (workoutDoing) {
      if (!workout.doing) {
        return true
      }
    }

    if (workoutFinished) {
      const workoutFinished = user?.workout.filter(
        workout => workout.finished === true,
      )
      const result = workoutFinished?.some(
        item => formatDate(item.timeFinished) === formatDate(new Date()),
      )

      return workout.finished ? false : result
    }

    return false
  }
  const handleGoToReport = () => {
    navigate('Report', { measurement: measurements })
  }

  const showSeeMeasurement = () => {
    if (measurements.length) {
      return (
        <TouchableOpacity onPress={handleGoToReport}>
          <Box width="100%" bg="#20C79A" p="3" shadow={2} borderRadius={8}>
            <HStack alignItems={'center'}>
              <Icon name="body" type="ionicon" color="#fff" size={40} />
              <Text
                margin={3}
                flex={1}
                fontSize={16}
                color={'white'}
                flexWrap={'wrap'}
              >
                Veja sua evolução coporal
              </Text>
              <Icon name="chevron-right" color="#fff" size={30} />
            </HStack>
          </Box>
        </TouchableOpacity>
      )
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanWorkout = () => {
    if (!user?.workout) {
      return false
    }
    for (const workout of user?.workout) {
      if (workout.finished && !isDateFromCurrentWeek(workout.timeFinished)) {
        return true
      }
    }
    return false
  }

  const getBodyMeasurement = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      const response = await api.get(`measurement/by-client/${user._id}`)
      setMeasurements(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [user])

  const cleanWorkoutRequest = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      await api.put(`client/clean/workout/${user._id}`)
    } catch (error) {
      console.log(error)
    }
  }, [user])

  const getGym = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      const response = await api.get(`user/${user.user_id[0]}`)
      setGym(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [user])

  const getUserDate = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      if (cleanWorkout()) {
        await cleanWorkoutRequest()
      }
      const response = await api.get(`client/${user?._id}`)
      updateUserData(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [user, cleanWorkout, updateUserData, cleanWorkoutRequest])

  const disableButton = () => {
    if (user?.workout) {
      return user?.workout.some(workout => workout.doing)
    }
    return false
  }

  const isDateFromCurrentWeek = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    const now = new Date()

    // Calculate the start and end of the current week
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() + 6 - now.getDay()))

    // Compare the date with the start and end of the week
    return date >= startOfWeek && date <= endOfWeek
  }

  const showMsgEmptyWorkout = () => {
    if (user?.workout && user?.workout.length === 0) {
      return (
        <Text
          px={8}
          mb={5}
          flex={1}
          fontSize={16}
          color="white"
          fontWeight="bold"
        >
          Não possue treinos cadastrados
        </Text>
      )
    }
  }

  useEffect(() => {
    getUserDate()
    getBodyMeasurement()
    getGym()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />
      <ScrollView pb={20}>
        <VStack flex={1} px={8} mt={5} style={{ gap: 10 }}>
          <Box width="100%" bg="primary.500" p="3" shadow={2} borderRadius={8}>
            <HStack alignItems={'center'}>
              <Text
                margin={3}
                flex={1}
                fontSize={16}
                color={'white'}
                flexWrap={'wrap'}
              >
                Olá, {user?.name}! Bem-vindo ao <Text bold>Gym Officers</Text>.
                Você é cliente da {gym?.username}
              </Text>
            </HStack>
          </Box>
        </VStack>
        <VStack flex={1} px={8} my={5} style={{ gap: 10 }}>
          <TouchableOpacity onPress={handleGoToBody}>
            <Box width="100%" bg="#D5BB48" p="3" shadow={2} borderRadius={8}>
              <HStack alignItems={'center'}>
                <Icon name="badge" color="#fff" size={40} />
                <Text
                  margin={3}
                  flex={1}
                  fontSize={16}
                  color={'white'}
                  flexWrap={'wrap'}
                >
                  Atualize suas medidas Corporais
                </Text>
                <Icon name="chevron-right" color="#fff" size={30} />
              </HStack>
            </Box>
          </TouchableOpacity>
          {showSeeMeasurement()}
        </VStack>
        <HStack flex={1} justifyContent={'flex-end'}>
          <Text
            px={8}
            mb={5}
            fontSize={16}
            color="white"
            fontWeight="bold"
            onPress={handleSelectWorkout}
          >
            Selecione treinos prontos
          </Text>
        </HStack>
        <HStack px={8} flex={1} justifyContent={'flex-end'}>
          <Button
            loading={false}
            disabled={disableButton()}
            onPress={handleCreateWorkout}
            variant="outline"
            title="Crie seu treino"
            width={200}
          ></Button>
        </HStack>
        <Text
          px={8}
          mb={5}
          flex={1}
          fontSize={16}
          color="white"
          fontWeight="bold"
        >
          Seus treinos
        </Text>
        {showMsgEmptyWorkout()}
        {user?.workout?.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <View key={index} style={{ paddingHorizontal: 32 }}>
            <WorkoutCard
              key={index}
              disabled={disableClick(item)}
              workout={item}
              onPress={() => handleOpenExerciseDetails(item)}
            ></WorkoutCard>
          </View>
        ))}
      </ScrollView>
    </VStack>
  )
}
