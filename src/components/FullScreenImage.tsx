import React from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Icon } from 'react-native-elements'

const FullScreenImageModal = ({ imageUrl, onRequestClose }) => {
  const closeModal = () => {
    onRequestClose && onRequestClose()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!imageUrl}
      onRequestClose={closeModal}
    >
      <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
        <Icon color={'#fff'} name="close"></Icon>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              resizeMode="contain"
              style={styles.fullScreenImage}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    zIndex: 10000,
    // Style for the close button
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
    resizeMode: 'contain',
    // Other styles for the full-screen image
  },
})

export default FullScreenImageModal
