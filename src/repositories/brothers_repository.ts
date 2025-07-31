import { title } from "process";
import { ObjectId } from "mongodb";
import { UserDBType } from "../types";
import { brothersCollection } from "./db";


export const brothersRepoditory = {

  async getBrothers(): Promise<UserDBType[]> {
    return brothersCollection.find({}).toArray()
  },

  async getBroById(id: ObjectId): Promise<UserDBType | null> {
    return brothersCollection.findOne({ id })
  },

  async createBrother(newBrother: UserDBType): Promise<UserDBType> {
    const result = brothersCollection.insertOne(newBrother)
    return result
  },

  async updateBro(id:ObjectId, userName:string, bio:string): Promise<Boolean> {
    const result = await brothersCollection.updateOne({ id }, { $set: { userName, bio } })
    return result.matchedCount === 1
  },

  async deleteBro(id: ObjectId): Promise<Boolean> {
    const result = await brothersCollection.deleteOne({ id })
    return result.deletedCount === 1
  }
}