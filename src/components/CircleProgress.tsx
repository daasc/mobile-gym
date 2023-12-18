import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
/**
 * Override styles that get passed from props
 **/
propStyle = (percent, base_degrees) => {
  const rotateBy = base_degrees + percent * 3.6
  return {
    transform: [{ rotateZ: `${rotateBy}deg` }],
  }
}

const renderThirdLayer = (percent, styleColor) => {
  if (percent > 50) {
    return (
      <View
        style={[
          styles.secondProgressLayer,
          propStyle(percent - 50, 45),
          styleColor,
        ]}
      ></View>
    )
  } else {
    return <View style={styles.offsetLayer}></View>
  }
}

const CircularProgress = ({
  percent,
  color,
}: {
  percent: string
  color: string
}) => {
  const styleColor = {
    borderRightColor: color,
    borderTopColor: color,
  }
  let firstProgressLayerStyle
  if (percent > 50) {
    firstProgressLayerStyle = propStyle(50, -135)
  } else {
    firstProgressLayerStyle = propStyle(percent, -135)
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.firstProgressLayer, firstProgressLayerStyle, styleColor]}
      ></View>
      {renderThirdLayer(percent, styleColor)}
      <Text style={{ color: '#fff' }}>{percent}%</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderRadius: 100,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstProgressLayer: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderRadius: 100,
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    // borderRightColor: '#1A93F2',
    // borderTopColor: '#1A93F2',
    transform: [{ rotateZ: '-135deg' }],
  },
  secondProgressLayer: {
    width: 50,
    height: 50,
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 100,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    // borderRightColor: '#1A93F2',
    // borderTopColor: '#1A93F2',
    transform: [{ rotateZ: '45deg' }],
  },
  offsetLayer: {
    width: 50,
    height: 50,
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 100,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'grey',
    borderTopColor: 'grey',
    transform: [{ rotateZ: '-135deg' }],
  },
})

export default CircularProgress
