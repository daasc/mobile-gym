import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'
import React from 'react'

interface ButtonProps extends IButtonProps {
  title: string
  variant?: 'solid' | 'outline'
  loading: boolean
}

export default function Button({
  title,
  variant = 'solid',
  disabled = false,
  loading = false,
  ...rest
}: ButtonProps) {
  return (
    <NativeBaseButton
      w="full"
      h={14}
      disabled={disabled}
      bg={variant === 'outline' ? 'transparent' : 'orange.700'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="orange.500"
      rounded="sm"
      isLoading={loading}
      _pressed={{
        bg: variant === 'outline' ? 'gray.500' : 'orange.500',
      }}
      {...rest}
    >
      <Text
        color={variant === 'outline' ? 'orange.500' : 'white'}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}
