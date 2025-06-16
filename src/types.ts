import {Request} from 'express'

export type DataBaseType = {
  id: number
  title: string
  age: number
}
export type DBType = { courses: DataBaseType[] }


export type RequestWithBody<T>= Request<{},{},T>
export type RequestWithQuery<T>= Request<{},{},{},T>
export type RequestWithParams<T>= Request<T>
export type RequestWithParamsAndBody<T,B>= Request<T,{},B>