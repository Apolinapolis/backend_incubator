import { ObjectId } from "mongodb";
import { UserDBType } from "../types";
import { BrotherModel } from "./db";


export const brothersRepoditory = {

  async getBrothers(): Promise<UserDBType[]> {
    return BrotherModel.find({}).lean()
  },

  async getBroById(id: ObjectId): Promise<UserDBType | null> {
    return BrotherModel.findOne({ _id:id })
  },

  async createBrother(newBrother: UserDBType): Promise<UserDBType> {
    return BrotherModel.insertOne(newBrother)
  },

  async updateBro(id:ObjectId, userName:string, bio:string): Promise<Boolean> {
    const result = await BrotherModel.updateOne({ _id:id }, { $set: { userName, bio } })
    return result.matchedCount === 1
  },

  async deleteBro(id: ObjectId): Promise<Boolean> {
    const result = await BrotherModel.deleteOne({ _id:id })
    return result.deletedCount === 1
  }
}