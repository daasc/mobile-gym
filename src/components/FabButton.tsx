import { Text, View } from 'native-base'
import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableNativeFeedback,
  Vibration,
} from 'react-native'
import { Icon } from 'react-native-elements'

export default class FabButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: 0,
      series: 1,
      countDown: props.restTime,
      cardio: props.timeCardio,
      isRest: false,
      typeExercise: props.typeExercise,
      repetitions: props.repetitions,
    }
    this.timer = null
    this.resetTimer = this.resetTimer.bind(this)
  }

  componentDidMount() {
    if (
      this.state.typeExercise === 'Cardio' &&
      this.state.repetitions === 0 &&
      this.props.series === 1
    ) {
      this.startCardio()
      return
    }
    this.startTimer()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  numberOfTime() {
    if (this.state.isRest) {
      return this.formatTime(this.state.countDown)
    }
    if (
      this.state.typeExercise === 'Cardio' &&
      this.state.repetitions === 0 &&
      this.props.series === 1
    ) {
      return this.formatTime(this.state.cardio)
    }

    return this.formatTime(this.state.seconds)
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        seconds: prevState.seconds + 1,
      }))
    }, 1000)
  }

  startCountdown() {
    this.timer = setInterval(() => {
      this.setState(
        prevState => ({
          countDown: prevState.countDown - 1,
        }),
        () => {
          if (this.state.countDown === 0) {
            clearInterval(this.timer)
            Vibration.vibrate(3000)
          }
        },
      )
    }, 1000)
  }

  startCardio() {
    this.timer = setInterval(() => {
      this.setState(
        prevState => ({
          cardio: prevState.cardio - 1,
        }),
        () => {
          if (this.state.cardio === 0) {
            clearInterval(this.timer)
            Vibration.vibrate(3000)
          }
        },
      )
    }, 1000)
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60)
    const secs = time % 60

    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  resetTimer(isRest) {
    clearInterval(this.timer)
    this.setState({ seconds: 0, isRest, countDown: this.props.restTime })
    if (isRest) {
      this.startCountdown()
    } else {
      this.setState(prevState => ({
        series: prevState.series + 1,
      }))
      this.props.setSeries(this.state.series + 1)
      this.startTimer()
    }
  }

  animation = new Animated.Value(0)
  toggleMenu = () => {
    const toValue = this.open ? 0 : 1

    Animated.spring(this.animation, {
      toValue,
      friction: 6,
      useNativeDriver: false,
    }).start()

    this.open = !this.open
  }

  render() {
    const IconButton = isRest => {
      if (isRest) {
        return <Icon name="play-arrow" color={'#fff'}></Icon>
      }
      return <Icon name="pause" color={'#fff'}></Icon>
    }
    const hours = {
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -60],
          }),
        },
      ],
    }
    const rest = {
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -120],
          }),
        },
      ],
    }
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableNativeFeedback
          onPress={() => this.resetTimer(!this.state.isRest)}
        >
          <Animated.View style={[styles.button, styles.submenu, rest]}>
            {IconButton(this.state.isRest)}
          </Animated.View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback>
          <Animated.View style={[styles.button, styles.submenu, hours]}>
            <Text color={'#fff'}>
              {this.state.series} x {this.props.series}
            </Text>
          </Animated.View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={this.toggleMenu}>
          <Animated.View style={[styles.button, styles.menu]}>
            <Text color={'#fff'}>{this.numberOfTime()}</Text>
          </Animated.View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 170,
    right: 40,
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    shadowRadius: 10,
    shadowColor: '#ea580c',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 10,
    },
  },
  menu: {
    backgroundColor: '#ea580c',
  },
  submenu: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: '#ea580c',
  },
})
