import { title } from "process";
import { DataBaseType } from "../types";
import { brothersCollection } from "./db";


export const brothersRepoditory = {

  async findBro(name: string | null | undefined): Promise<DataBaseType[]> {

    const filter:any = {}

    if (name) {
      filter.title = { $regex: title }
    }

    return brothersCollection.find(filter).toArray()

  },

  async getBroById(id: number): Promise<DataBaseType | null> {
    const foundBro: DataBaseType | null = await brothersCollection.findOne({ id })

    if (foundBro) {
      return foundBro
    } else {
      return null
    }

  },

  async createBrother(name: string): Promise<DataBaseType> {

    const CreatedBrother = {
      id: +(new Date()),
      title: name,
      age: Math.floor(Math.random() * 101)
    }

    await brothersCollection.insertOne(CreatedBrother)
    return CreatedBrother
  },

  async updateBrotherName(id: number, name: string): Promise<Boolean> {
    const result = await brothersCollection.updateOne({ id }, { $set: { title: name } })
    return result.matchedCount === 1
  },

  async deleteBro(id: number): Promise<Boolean> {
    const result = await brothersCollection.deleteOne({ id })
    return result.deletedCount === 1
  }
}