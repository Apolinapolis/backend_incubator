import express, {Response} from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'
import { CreateBroModel } from './models/CreateBroModel'
import { GetBroModel } from './models/GetBroQueryModel'
import { UpdateBroModel } from './models/UpdateBroModel'
import { ViewBroModel } from './models/ViewBroModel'
import { URIparamId } from './models/URIParamIdModel'

export const app = express()
const port = 3000

type DataBaseType = {
  id: number
  title: string
  age: number
}

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

export const db: {courses: DataBaseType[]} = {
  courses: [
    { id: 1, title: 'roman', age: 35 },
    { id: 2, title: 'sergey', age: 36 },
    { id: 3, title: 'yurok', age: 37 },
    { id: 4, title: 'dimon', age: 34 }
  ]
}

const getBroViewModel = (bro:DataBaseType): ViewBroModel => {
  return {
    id: bro.id,
    title: bro.title
  }
}


app.get('/brothers', (req:RequestWithQuery<GetBroModel>, res:Response<ViewBroModel[]>) => {
  
  let foundCourses = db.courses
  if (req.query.title) {
    foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
  }
  res.json(foundCourses.map(getBroViewModel)) 
})

app.get('/brothers/:id', (req:RequestWithParams<URIparamId>, res:Response<ViewBroModel>) => {
  const foundCourse = db.courses.find(c => c.id === +req.params.id)

  if (!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return
  }

  res.json({id:foundCourse.id, title:foundCourse.title})
})

app.post('/brothers', (req:RequestWithBody<CreateBroModel>, res:Response<ViewBroModel>) => {
  
  if (!req.body.title){
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return 
  }

  const createdCourse = {
    id: +(new Date()),
    title: req.body.title,
    age: 0
  }

  db.courses.push(createdCourse);
  res.status(HTTP_STATUSES.CREATED_201).json(createdCourse)
})

app.put('/brothers/:id', (req:RequestWithParamsAndBody<URIparamId,UpdateBroModel>, res) => {

  const bro = db.courses.find(c => c.id === +req.params.id)

  if (bro) {
    bro.title = req.body.title
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }
})

app.delete('/brothers/:id', (req:RequestWithParams<URIparamId>, res) => {
  if (!db.courses.find(c => c.id === +req.params.id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return
  }
  db.courses = db.courses.filter(c => c.id !== +req.params.id)

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/__test__/data', (req, res) => {
  db.courses = []
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, '0.0.0.0',() => {
  console.log(`backend was started on port ${port}`)
}) 