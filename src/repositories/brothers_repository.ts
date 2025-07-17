import { title } from "process";
import { DataBaseType, DBType } from "../types";
import { client } from "./db";


export const db: DBType = {
  courses: [
    { id: 1, title: 'roman', age: 35 },
    { id: 2, title: 'sergey', age: 36 },
    { id: 3, title: 'yurok', age: 37 },
    { id: 4, title: 'dimon', age: 34 }
  ]
}


export const brothersRepoditory = {

  async findBro(searchTerm: string | null | undefined):Promise<DataBaseType[]> {

    if (searchTerm) {
      return client.db('shop').collection<DataBaseType>('girls').find({title: {$regex: title}}).toArray()
    } else {
      return client.db('shop').collection<DataBaseType>('girls').find({}).toArray()
    }
  },

  async getBroById(broId: number):Promise<DataBaseType | null> {
    const foundBro = db.courses.find(b => b.id === broId)
    if (foundBro) {
      return foundBro
    } else {
      return null
    }
  },

 async createBrother(name: string):Promise<DataBaseType> {

    const createdCourse = {
      id: +(new Date()),
      title: name,
      age: Math.floor(Math.random() * 101)
    }

    db.courses.push(createdCourse);
    return createdCourse
  },

  async updateBrotherName(id: number, name: string): Promise<Boolean> {
    const bro = db.courses.find(b => b.id === id)
    if (bro) {
      bro.title = name
      return true
    } else {
      return false
    }
  },

 async deleteBro(id:number):Promise<Boolean> {
    if (id) {
      db.courses = db.courses.filter(c => c.id !== +id)
      return true
    } else {
      return false
    }
  }

}

