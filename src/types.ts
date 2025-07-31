import { WithId } from 'mongodb'

export type UserDBType = WithId<{
  userName:string
  bio:string
  addedAt:Date
}>