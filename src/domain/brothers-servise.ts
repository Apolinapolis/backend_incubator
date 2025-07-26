import { DataBaseType } from "../types";
import { brothersRepoditory } from "../repositories/brothers_repository"
import bcript from 'bcryptjs'

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

// export const userSevice = {
//   async createUser (login:string, email:string, password:string):Promise<DataBaseType> {
//     const passwordSalt = await bcript.genSalt(10)
//     const passwordHash = await this._generateHash(password, passwordSalt)
//     const newUser:DataBaseType = {id:1, title:'qwr', age:1}
//     return brothersRepoditory.createBrother(newUser)
//   },
//   async checkCredentials(login:string, password:string) {
//     const user = await brothersRepoditory.findBro(login)
//     if (!user) return false
//     const passwordHash = await this._generateHash(password, user.passwordSalt)
//     if (user.passwordHash !== passwordHash) return false
//   },


//   async _generateHash(password:string, salt:string) {
//     const hash = await bcript.hash(password, salt)
//     return hash
//   }
// }