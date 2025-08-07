import { WithId } from 'mongodb'

export type UserDBType = WithId<{
  userName:string
  bio:string
  addedAt:Date
  avatars:AvatarDBType[]
}>

export type AvatarDBType = {
  src:string
  addedAt:Date
}


export type CreateBroModel = Omit<UserDBType, '_id' | 'addedAt' | 'avatars'>