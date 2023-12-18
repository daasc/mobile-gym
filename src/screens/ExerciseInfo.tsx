import { IExerciseDTO } from '@dtos/exercise.dto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/private.routes'
import { ResizeMode, Video } from 'expo-av'
import { Box, Heading, HStack, ScrollView, Text, VStack } from 'native-base'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'

type Params = {
  exercise: {
    exercise: IExerciseDTO
  }
}

export default function ExerciseInfo() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute<RouteProp<Params, 'exercise'>>()
  const video = React.useRef(null)
  const [status, setStatus] = React.useState({})

  const exercise = route.params.exercise

  function handleGoBack() {
    navigate('CreateWorkout')
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
          <View style={styles.container}>
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
          </View>
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
                  {exercise.time / 60} Minutos Tempo de execução
                </Text>
              </HStack>
              <HStack alignItems={'center'}>
                <Icon
                  name="clock"
                  color={'#fb923c'}
                  type="font-awesome-5"
                ></Icon>
                <Text color="gray.200" ml="2">
                  {exercise.rest / 60} Minutos Tempo de descanso
                </Text>
              </HStack>
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
