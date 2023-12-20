import { IWorkoutDTO } from '@dtos/workout.dto'
import { formatDate } from '@utils/format'
import { Heading, HStack, Text, VStack } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Icon } from 'react-native-elements'

interface WorkoutCardProps extends TouchableOpacityProps {
  workout: IWorkoutDTO
}

const WorkoutCard = ({ workout, ...rest }: WorkoutCardProps) => {
  const checkWorkout = () => {
    if (workout.doing) {
      return 'orange.500'
    }
    if (workout.finished) {
      return 'green.500'
    }
    return 'gray.500'
  }

  const checkText = () => {
    if (workout.doing) {
      return 'Treinando'
    }
    if (workout.finished) {
      return 'Finalizado!'
    }
    return ''
  }

  const dateFinished = () => {
    if (workout.finished) {
      return formatDate(workout.timeFinished)
    }
  }
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="transparent"
        alignItems="center"
        p={2}
        pr={4}
        minH="20"
        rounded="md"
        mb={3}
        borderColor={checkWorkout()}
        borderWidth={1}
      >
        <VStack width={'1/4'}>
          <Icon name="dumbbell" color={'#fff'} type="font-awesome-5"></Icon>
        </VStack>
        <VStack flex={1}>
          <Heading fontSize="sm" color="orange.500" fontFamily="heading">
            {workout.name}
          </Heading>

          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {workout.workoutDescription}
          </Text>
        </VStack>
        <VStack ml={0.5}>
          <Text color={'#fff'} fontFamily="heading">
            <Text color={'#fff'}>{checkText()}</Text>
          </Text>
          <Text color={'#fff'}>{dateFinished()}</Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}

export default WorkoutCard
