import { IPaymentDTO } from '@dtos/payment.dto'
import { formatDate } from '@utils/format'
import { Heading, HStack, Text, VStack } from 'native-base'
import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface PaymentCardProps extends TouchableOpacityProps {
  payment: IPaymentDTO
}

export default function PaymentCard({ payment, ...rest }: PaymentCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        h={20}
        pr={4}
        rounded="md"
        mb={3}
      >
        <VStack flex={1}>
          <Heading fontSize="lg" color="white" fontFamily="heading">
            {payment.type}
          </Heading>

          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {formatDate(payment.date)} - {formatDate(payment.end_date)}
          </Text>
        </VStack>

        <Text
          fontSize="lg"
          color="white"
          fontWeight="bold"
          mt={1}
          numberOfLines={2}
        >
          R$ {payment.price.toFixed(2)}
        </Text>
      </HStack>
    </TouchableOpacity>
  )
}
