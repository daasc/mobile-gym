import { Badge, HStack } from 'native-base'
import React from 'react'
import { Dimensions, StyleSheet, Text } from 'react-native'

const CurrentPayment = ({ amountPaid, deadline, msgDeadline, type }) => {
  let deadlineColor
  let borderColor
  let textColor
  const price = `R$ ${amountPaid.toFixed(2)}`
  if (deadline > 10) {
    deadlineColor = '#93C5FD'
    borderColor = '#3B82F6'
    textColor = '#1E40AF'
  } else if (deadline > 1 && deadline <= 10) {
    deadlineColor = '#FCD34D'
    borderColor = '#FACC15'
    textColor = '#854D0E'
  } else {
    deadlineColor = '#FCA5A5'
    borderColor = '#DC2626'
    textColor = '#991B1B'
  }
  return (
    <HStack
      bg="gray.500"
      h="1/5"
      p={2}
      pr={4}
      justifyContent="space-around"
      rounded="md"
      flexDirection="column"
      mb={3}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text style={styles.amount}>{price}</Text>
        <Badge
          boxSize="1/2"
          height={10}
          padding={0}
          color="white"
          bgColor={deadlineColor}
          borderColor={borderColor}
        >
          <Text style={{ color: textColor, fontWeight: 'bold' }}>
            {msgDeadline}
          </Text>
        </Badge>
      </HStack>
      <HStack>
        <Text style={styles.info}>Assinatura {type}</Text>
      </HStack>
    </HStack>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    height: height * 0.2,
    borderRadius: 20,
    padding: 16,
  },
  info: {
    fontSize: 19,
    marginBottom: 8,
    fontWeight: 'semibold',
    color: '#fff',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  deadline: {
    fontSize: 16,
  },
})

export default CurrentPayment
