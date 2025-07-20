import { DataBaseType } from "../types";
import { brothersRepoditory } from "../repositories/brothers_repository"

export const brothersServise = {

  async findBro(name: string | null | undefined): Promise<DataBaseType[]> {
    return brothersRepoditory.findBro(name)
  },

  async getBroById(id: number): Promise<DataBaseType | null> {
    return brothersRepoditory.getBroById(id)
  },

  async createBrother(name: string): Promise<DataBaseType> {

    const NewBrother = {
      id: +(new Date()),
      title: name,
      age: Math.floor(Math.random() * 101)
    }

    const CreatedBrother = await brothersRepoditory.createBrother(NewBrother)
    return CreatedBrother
  },

  async updateBrotherName(id: number, name: string): Promise<Boolean> {
    return brothersRepoditory.updateBrotherName(id, name)
  },

  async deleteBro(id: number): Promise<Boolean> {
    return brothersRepoditory.deleteBro(id)
  }
}