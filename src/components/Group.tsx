import { IPressableProps, Pressable, Text } from 'native-base'
import React from 'react'

type GroupProps = IPressableProps & {
  name: string
  isActive: boolean
}

export default function Group({ name, isActive, ...rest }: GroupProps) {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg="gray.600"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderColor: 'orange.500',
        borderWidth: 1,
      }}
      {...rest}
    >
      <Text
        color={isActive ? 'orange.500' : 'gray.200'}
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="bold"
      >
        {name}
      </Text>
    </Pressable>
  )
}
