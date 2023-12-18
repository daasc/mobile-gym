import { IUserDTO } from '@dtos/user.dto'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_STORAGE } from './storageConfig'

export async function storageUserSave(user: IUserDTO | null) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function storageGetUser() {
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  const user: IUserDTO = storage ? JSON.parse(storage) : null

  return user
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE)
}
