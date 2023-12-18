import { Center, Heading } from 'native-base'
import React from 'react'

type ScreenHeaderProps = {
  title: string
}

export default function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading color="gray.100" fontSize="xl" fontFamily="heading">
        {title}
      </Heading>
    </Center>
  )
}
