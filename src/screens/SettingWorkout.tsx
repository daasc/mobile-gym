/* eslint-disable prettier/prettier */
import Button from '@components/Button'
import Input from '@components/Input'
import { useAuth } from '@contexts/AuthContext'
import { IExerciseDTO } from '@dtos/exercise.dto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { api } from '@services/http'
import { onlyNumbers } from '@utils/numbers'
import { Heading, HStack, ScrollView, useToast, VStack } from 'native-base'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Icon } from 'react-native-elements'
import { useMaskedInputProps } from 'react-native-mask-input'

type Params = {
  exercise: {
    exercises: IExerciseDTO[]
  }
}

export default function ExerciseInfo() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const { user, updateUserData } = useAuth()
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const route = useRoute<RouteProp<Params, 'exercise'>>()
  const exercises = route.params.exercises

  const uniqueTypes = [
    ...new Set(exercises.map((exercise: IExerciseDTO) => exercise.type)),
  ]
  const workoutDescription = uniqueTypes.join(' + ')
  const [time, setTime] = useState('')

  const { control, handleSubmit, resetField } = useForm({
    defaultValues: {
      name: '',
    },
  })

  const maskedInputProps = useMaskedInputProps({
    value: time,
    onChangeText: setTime,
    mask: [/\d/, ':', /\d/, /\d/],
    maskAutoComplete: false,
  })

  function convertToSeconds(hours: number, minutes: number) {
    const totalSeconds = hours * 3600 + minutes * 60
    return totalSeconds
  }

  function handleGoBack() {
    navigate('CreateWorkout')
  }

  const createWorkout = useCallback(
    async (data: { name: string }) => {
      const timeFormat = onlyNumbers(time)
      const stringValue = timeFormat.toString()

      const hour = parseInt(stringValue.substring(0, 1))
      const minutes = parseInt(stringValue.substring(1))

      try {
        if (!data.name || !time) {
          return
        }
        const workout = {
          workout: {
            name: data.name,
            time: convertToSeconds(hour, minutes),
            workoutDescription,
            exercises,
            start: false,
            finished: false,
            doing: false,
          },
        }
        setLoading(true)
        const response = await api.put(`client/${user?._id}`, workout)

        updateUserData(response.data)

        resetField('name')

        setTime('')

        toast.show({
          title: 'Treino Criado!',
          description: 'Treino criado aproveite seu treino!',
        })

        navigate('Home')
      } catch (error) {
        toast.show({
          title: 'Ups! Houve um problema',
          description: 'Não conseguimos atualizar suas informações de perfil',
        })
      } finally {
        setLoading(false)
      }
    },
    [exercises, navigate, resetField, time, toast, updateUserData, user?._id, workoutDescription],
  )

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
            Criar Treino
          </Heading>
        </HStack>
      </VStack>
      <ScrollView mb={5}>
        <VStack px={10} mt={12} mb={9}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome do treino"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
            defaultValue=""
          />
          <Input
            isReadOnly
            bg="gray.600"
            placeholder="ex: Peitoral + Biceps"
            value={workoutDescription}
          ></Input>
          <Input
            {...maskedInputProps}
            placeholder="O tempo do treino em horas: 1:20"
            keyboardType="phone-pad"
            autoCapitalize="none"
            bg="gray.600"
          />
          <Button
            title="Criar Treino"
            loading={loading}
            onPress={handleSubmit(createWorkout)}
          ></Button>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
