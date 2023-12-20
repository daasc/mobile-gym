// import ExerciseCard from '@components/ExerciseCard'
import Button from '@components/Button'
import Group from '@components/Group'
import { IExerciseDTO } from '@dtos/exercise.dto'
import NetInfo from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { api } from '@services/http'
import { FlatList, Heading, HStack, Image, Text, VStack } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, SafeAreaView, TouchableOpacity } from 'react-native'
import { CheckBox, Icon } from 'react-native-elements'

import RemadaUnilateralComHalteresJPJ from '../assets/remada-unilateral-com-halteres-600x600.jpg'

export default function CreateWorkout() {
  const [selectedExercises, setSelected] = useState<IExerciseDTO[]>([])
  const [groups] = useState([
    'Costas',
    'Bíceps',
    'Pernas',
    'Peito',
    'Cardio',
    'Tríceps',
    'Ombro',
    'Antebraço',
    'Alongamento',
    'Abdômen',
  ])
  const [exercises, setExercises] = useState<IExerciseDTO[]>([])

  const [groupSelected, setGroupSelected] = useState('Costas')
  const [isConnect, setConnect] = useState(true)

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigate('Home')
    removeSelection()
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

  const handleOpenExerciseDetails = useCallback(
    (exercise: IExerciseDTO) => {
      navigate('ExerciseInfo', { exercise })
    },
    [navigate],
  )
  const removeSelection = useCallback(() => {
    const newExercises = [...exercises]
    const result = newExercises.map((item) => {
      if (item.selected) {
        item.selected = false
      }
      return item
    })
    setExercises(result)
    setSelected([])
  }, [exercises])

  const handleSettingWorkout = useCallback(() => {
    navigate('SettingWorkout', { exercises: selectedExercises })
    removeSelection()
  }, [navigate, removeSelection, selectedExercises])

  const setSelection = (exercise: IExerciseDTO) => {
    const newExercises = [...exercises]
    const result = newExercises.find((item) => item._id === exercise._id)
    result.selected = !result?.selected || false
    setSelected(newExercises.filter((item) => item.selected))
    setExercises(newExercises)
  }

  const getExercises = useCallback(async () => {
    try {
      const response = await api.get('exercise')
      const exercises = response.data.result
      setExercises(exercises)
    } catch (error) {}
  }, [setExercises])

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        Alert.alert('Você está sem internet')
        setConnect(false)
      }
    })
    getExercises()
  }, [getExercises])

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
            Crie seu Treino
          </Heading>
          <Text></Text>
        </HStack>
      </VStack>
      <SafeAreaView>
        <FlatList
          data={groups}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={
                groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
              }
              onPress={() => setGroupSelected(item)}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 8 }}
          my={10}
          maxH={10}
        />
      </SafeAreaView>

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Exercicios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {selectedExercises.length}
          </Text>
        </HStack>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={exercises.filter(
              (exercise) => exercise.type === groupSelected,
            )}
            keyExtractor={(item, index) => item._id + index.toString()}
            renderItem={(item) => (
              <TouchableOpacity
                onPress={() => handleOpenExerciseDetails(item.item)}
              >
                <HStack
                  bg="gray.500"
                  alignItems="center"
                  p={2}
                  pr={4}
                  rounded="md"
                  mb={3}
                >
                  {showImage(item.item)}
                  <VStack flex={1}>
                    <Heading fontSize="md" color="white" fontFamily="heading">
                      {item.item.name}
                    </Heading>

                    <Text
                      fontSize="sm"
                      color="gray.200"
                      mt={1}
                      numberOfLines={2}
                    >
                      {item.item.series} series x {item.item.repetitions}
                      repeticoes {item.item.selected}
                    </Text>
                  </VStack>

                  <CheckBox
                    checked={item.item.selected}
                    onPress={() => setSelection(item.item)}
                  />
                </HStack>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </SafeAreaView>

        <Button
          loading={false}
          isDisabled={selectedExercises.length === 0}
          mb={5}
          title="Criar treino"
          onPress={() => handleSettingWorkout()}
        ></Button>
      </VStack>
    </VStack>
  )
}
