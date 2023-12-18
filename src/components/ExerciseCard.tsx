import { IExerciseDTO } from '@dtos/exercise.dto'
import { Heading, HStack, Image, Text, VStack } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import RemadaUnilateralComHalteresJPJ from '../assets/remada-unilateral-com-halteres-600x600.jpg'

interface ExerciseCardProps extends TouchableOpacityProps {
  exercise: IExerciseDTO
}
export default function ExerciseCard({ exercise, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={RemadaUnilateralComHalteresJPJ}
          alt="Homem fazendo remada unileteral"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="center"
        />
        <VStack flex={1}>
          <Heading fontSize="md" color="white" fontFamily="heading">
            {exercise.name}
          </Heading>

          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {exercise.series} series x {exercise.repetitions} repetições
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}
