import { ObjectId } from "mongodb";
import { UserDBType } from "../types";
import { BrotherModel } from "./db";


export const brothersRepoditory = {

  async getBrothers(): Promise<UserDBType[]> {
    return BrotherModel.find({}).lean()
  },

  async getBroById(id: ObjectId): Promise<UserDBType | null> {
    return BrotherModel.findOne({ id })
  },

  async createBrother(newBrother: UserDBType): Promise<UserDBType> {
    const result = BrotherModel.insertOne(newBrother)
    return result
  },

  async updateBro(id:ObjectId, userName:string, bio:string): Promise<Boolean> {
    const result = await BrotherModel.updateOne({ id }, { $set: { userName, bio } })
    return result.matchedCount === 1
  },

  async deleteBro(id: ObjectId): Promise<Boolean> {
    const result = await BrotherModel.deleteOne({ id })
    return result.deletedCount === 1
  }
}