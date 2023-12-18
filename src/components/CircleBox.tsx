import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const CircleBox = ({ number }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.number}>{number}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#E1E1E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1A93F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
})

export default CircleBox
