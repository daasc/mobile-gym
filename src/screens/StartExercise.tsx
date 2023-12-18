import Button from '@components/Button'
import Input from '@components/Input'
import { useAuth } from '@contexts/AuthContext'
import { IExerciseDTO } from '@dtos/exercise.dto'
import { IWorkoutDTO } from '@dtos/workout.dto'
import NetInfo from '@react-native-community/netinfo'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { ResizeMode, Video } from 'expo-av'
import {
  Box,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import React, { useEffect, useRef, useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useMaskedInputProps } from 'react-native-mask-input'

import RemadaUnilateralComHalteresJPJ from '../assets/no-wifi.png'

type Params = {
  params: {
    workout: IWorkoutDTO
    exercise: IExerciseDTO
  }
}

export default function StartExercise() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const { user, updateUserData } = useAuth()
  const [visible, setVisible] = useState(false)
  const [time, setTime] = useState('')
  const [timeExercise, setTimeExercise] = useState('')
  const [series, setSeries] = useState('')
  const video = useRef(null)
  const [isConnect, setConnect] = useState(true)
  const [status, setStatus] = useState({})

  const openModal = () => {
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }

  function handleGoBack() {
    navigate('StartWorkout', { workout })
  }
  const route = useRoute<RouteProp<Params, 'params'>>()

  const exercise = route.params.exercise
  const workout = route.params.workout

  const maskedInputProps = useMaskedInputProps({
    value: time,
    onChangeText: setTime,
    mask: text => {
      if (text.replace(/\D+/g, '').length > 3) {
        return [/\d/, /\d/, ':', /\d/, /\d/]
      }
      return [/\d/, ':', /\d/, /\d/]
    },
    maskAutoComplete: false,
  })

  const maskedInputPropsSeries = useMaskedInputProps({
    value: series,
    onChangeText: setSeries,
    mask: [/\d/],
    maskAutoComplete: false,
  })

  const maskedInputPropsTimeExercise = useMaskedInputProps({
    value: timeExercise,
    onChangeText: setTimeExercise,
    mask: text => {
      if (text.replace(/\D+/g, '').length > 4) {
        return [/\d/, ':', /\d/, /\d/, ':', /\d/, /\d/]
      }
      if (text.replace(/\D+/g, '').length > 3) {
        return [/\d/, /\d/, ':', /\d/, /\d/]
      }
      return [/\d/, ':', /\d/, /\d/]
    },
    maskAutoComplete: false,
  })

  const convertToTime = (number: number) => {
    const hours = Math.floor(number / 60)
    const minutes = number % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  const showImage = () => {
    if (isConnect) {
      return (
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: exercise.video,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )
    }

    return (
      <Image
        w="full"
        h={40}
        source={RemadaUnilateralComHalteresJPJ}
        alt="Sem internet"
        mb={3}
        resizeMode="cover"
        rounded="lg"
      />
    )
  }

  const convertToSeconds = (value: string) => {
    const timeComponents = value.split(':').reverse()
    let totalSeconds = 0

    for (let i = 0; i < timeComponents.length; i++) {
      const timeValue = parseInt(timeComponents[i], 10)
      totalSeconds += timeValue * Math.pow(60, i)
    }

    return totalSeconds
  }

  const callModal = () => {
    setTime(convertToTime(exercise.rest))
    setSeries(exercise.series.toString())
    setTimeExercise(convertToTime(exercise.time))
    openModal()
  }

  const renderInputs = () => {
    if (exercise.repetitions === 0) {
      return (
        <VStack>
          <Text>Tempo de execução:</Text>
          <Input
            {...maskedInputPropsTimeExercise}
            placeholder="ex: 20:00"
            keyboardType="phone-pad"
            autoCapitalize="none"
            bg="gray.600"
          />
        </VStack>
      )
    }

    return (
      <VStack>
        <Text>Descanso:</Text>
        <Input
          {...maskedInputProps}
          placeholder="ex: 2:00"
          keyboardType="phone-pad"
          autoCapitalize="none"
          bg="gray.600"
        />
        <Text>Series:</Text>
        <Input
          {...maskedInputPropsSeries}
          placeholder="ex: 3"
          keyboardType="phone-pad"
          autoCapitalize="none"
          bg="gray.600"
        />
      </VStack>
    )
  }

  const startExercise = () => {
    const indexExercise = workout.exercises.findIndex(
      item => exercise._id === item._id,
    )

    const indexWorkout = user?.workout.findIndex(
      item => workout._id === item._id,
    )

    if (exercise.repetitions === 0) {
      workout.exercises[indexExercise].time = convertToSeconds(timeExercise)
    }
    workout.exercises[indexExercise].doing = true
    workout.exercises[indexExercise].series = parseInt(series)
    workout.exercises[indexExercise].rest = convertToSeconds(time)

    workout.exercises[indexExercise].working = { series: 1 }
    workout.doing = true
    const userData = { ...user }
    userData.working = true
    userData.workout[indexWorkout] = workout

    updateUserData(userData)
    closeModal()
  }

  const hasExerciseDoing = () => {
    const filter = workout.exercises.filter(item => exercise._id !== item._id)
    return filter.some(item => item.doing === true)
  }

  const titleButton = (exercise: IExerciseDTO) => {
    if (exercise.finished) {
      return 'Treino Finalizado!'
    }
    if (exercise.doing) {
      return 'Treinando...'
    }
    return 'Começar Treino'
  }

  function showRepetition() {
    if (exercise.repetitions !== 0) {
      return (
        <HStack justifyContent={'space-between'}>
          <HStack alignItems={'center'}>
            <Icon
              name="dumbbell"
              color={'#fb923c'}
              type="font-awesome-5"
            ></Icon>
            <Text color="gray.200" ml="2">
              {exercise.series} séries
            </Text>
          </HStack>
          <HStack alignItems={'center'}>
            <Icon name="sync" color={'#fb923c'} type="font-awesome-5"></Icon>
            <Text color="gray.200" ml="2">
              {exercise.repetitions} repetições
            </Text>
          </HStack>
        </HStack>
      )
    }
  }

  useEffect(() => {
    NetInfo.addEventListener(state => {
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
            Exercício
          </Heading>
          <Text></Text>
        </HStack>
      </VStack>
      <ScrollView mb={5}>
        <VStack p={8}>
          <View style={styles.container}>{showImage()}</View>

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack>
              <Text color="white" fontSize={17} fontWeight={'bold'} m="2">
                {exercise.name}
              </Text>
            </HStack>
            <VStack m={2} style={{ gap: 13 }}>
              {showRepetition()}
              <HStack alignItems={'center'}>
                <Icon
                  name="clock"
                  color={'#fb923c'}
                  type="font-awesome-5"
                ></Icon>
                <Text color="gray.200" ml="2">
                  {convertToTime(exercise.time)} Minutos Tempo de execução
                </Text>
              </HStack>
              <HStack alignItems={'center'}>
                <Icon
                  name="clock"
                  color={'#fb923c'}
                  type="font-awesome-5"
                ></Icon>
                <Text color="gray.200" ml="2">
                  {convertToTime(exercise.rest)} Minutos Tempo de descanso
                </Text>
              </HStack>
              <Button
                loading={false}
                disabled={
                  exercise.doing || hasExerciseDoing() || exercise.finished
                }
                title={titleButton(exercise)}
                onPress={callModal}
              ></Button>
            </VStack>
          </Box>
        </VStack>
        <VStack px={8}>
          <Text color="white" fontSize={17} fontWeight={'bold'} mb={3}>
            Descrição do Exercicio
          </Text>
          <Text color="gray.200" fontSize={14}>
            {exercise.info.description}
          </Text>
        </VStack>
        <VStack px={8}>
          <Text color="white" fontSize={17} fontWeight={'bold'} my={3}>
            Instruções
          </Text>
          {exercise.info.warning.map((item, index) => (
            <Box
              key={index}
              borderColor={'#fb923c'}
              borderWidth={0.5}
              my={2}
              p={2}
              borderRadius={8}
            >
              <Text color={'gray.200'}>{item.text}</Text>
            </Box>
          ))}
        </VStack>
      </ScrollView>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              width: '80%',
            }}
          >
            <HStack justifyContent={'space-between'}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                Alterar dados do exercicio
              </Text>
              <TouchableOpacity onPress={closeModal} style={{}}>
                <Icon name="close"></Icon>
              </TouchableOpacity>
            </HStack>
            <VStack>
              {renderInputs()}
              <Button
                loading={false}
                disabled={
                  exercise.doing || hasExerciseDoing() || exercise.finished
                }
                title={titleButton(exercise)}
                onPress={startExercise}
              ></Button>
            </VStack>
          </View>
        </View>
      </Modal>
    </VStack>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: 250,
  },
})
