import { ObjectId } from "mongodb";
import { brothersRepoditory } from "../repositories/brothers_repository"
import { UserDBType } from "../types";

export const brothersServise = {

  async getBrothers():Promise<UserDBType[]> {
    return brothersRepoditory.getBrothers()
  },

  async getBroById(id:ObjectId):Promise<UserDBType | null> {
    return brothersRepoditory.getBroById(id)
  },

  async createBrother(userName:string, bio:string): Promise<UserDBType> {
    const newBrother:UserDBType = { 
      _id: new ObjectId(), 
      userName, 
      bio, 
      addedAt: new Date(), 
      avatars:[{src:"https://image.jpeg", addedAt:new Date()}] 
    }
   return brothersRepoditory.createBrother(newBrother)
  },

  async updateBro(id: ObjectId, userName: string, bio:string): Promise<Boolean> {
    return brothersRepoditory.updateBro(id, userName, bio)
  },

  async deleteBro(id:ObjectId): Promise<Boolean> {
    return brothersRepoditory.deleteBro(id)
  },

  async cleanDB(): Promise<number> {
    return brothersRepoditory.cleanDB()
  }
}