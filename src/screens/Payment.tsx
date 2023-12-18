import CurrentPayment from '@components/CurrentPayment'
import HomeHeader from '@components/HomeHeader'
import PaymentCard from '@components/PaymentCard'
import { useAuth } from '@contexts/AuthContext'
import { IPaymentDTO } from '@dtos/payment.dto'
import { api } from '@services/http'
import { daysUntil } from '@utils/date'
import { dayMissing } from '@utils/dayUntil'
import { FlatList, Heading, HStack, VStack, Text } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'

export default function Payment() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<IPaymentDTO[]>([])

  const fetchPayments = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      const response = await api.get(`payment/by-client/${user?._id}`)
      const filterData = response.data.result.filter(
        (payment: { _id: string | undefined }) =>
          payment._id !== user?.payment[0]._id,
      )
      setPayments(filterData)
    } catch (error) {
      console.log(error)
    }
  }, [user])

  const showTheLastPayment = () => {
    if (user?.payment.length) {
      return (
        <CurrentPayment
          amountPaid={user?.payment[0].price}
          deadline={dayMissing(new Date(user?.payment[0].end_date))}
          msgDeadline={daysUntil(new Date(user?.payment[0].end_date))}
          type={user?.payment[0].type}
        />
      )
    }

    return (
      <Text color={'#fff'} fontSize={18} mb={5}>
        Sem Pagamento!
      </Text>
    )
  }

  const showHistory = () => {
    if (payments.length) {
      return (
        <FlatList
          data={payments}
          keyExtractor={(item, index) => item._id + index.toString()}
          renderItem={({ item }) => (
            <PaymentCard payment={item} onPress={() => {}} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )
    }

    return (
      <Text color={'#fff'} fontSize={18} mb={5}>
        Sem Histórico!
      </Text>
    )
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />
      <VStack flex={1} p={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Último Pagamento
          </Heading>
        </HStack>

        {showTheLastPayment()}
        <HStack>
          <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={3}>
            Histórioco
          </Heading>
        </HStack>
        <SafeAreaView style={{ flex: 1 }}>{showHistory()}</SafeAreaView>
      </VStack>
    </VStack>
  )
}
