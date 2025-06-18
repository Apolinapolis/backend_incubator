import { DBType } from "../types";


export const db: DBType = {
  courses: [
    { id: 1, title: 'roman', age: 35 },
    { id: 2, title: 'sergey', age: 36 },
    { id: 3, title: 'yurok', age: 37 },
    { id: 4, title: 'dimon', age: 34 }
  ]
}


export const brothersRepoditory = {

  findBro(searchTerm: string | null) {

    if (searchTerm) {
    let foundCourses = db.courses.filter(c => c.title.indexOf(searchTerm) > -1)
    return foundCourses
    } else {
      return db.courses
    }
  },

  getBroById(broId:number) {
    const foundBro = db.courses.find(b => b.id === broId)
    return foundBro
  },

  createBrother(title: string) {

    const createdCourse = {
      id: +(new Date()),
      title: title,
      age: Math.floor(Math.random() * 101)
    }

    db.courses.push(createdCourse);
    return createdCourse
  },

  updateBrotherName(id: number, name: string) {
    const bro = db.courses.find(b => b.id === id)
    if (bro) {
      bro.title = name
      return true
    } else {
      return false
    }

  }



}

