import express from 'express'

export const app = express()
const port = 3000

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

export const db = {
  courses: [
    { id: 1, title: 'Roman' },
    { id: 2, title: 'Sergey' },
    { id: 3, title: 'Yurok' },
    { id: 4, title: 'Dimon' }
  ]
}


app.get('/brothers', (req, res) => {
  let foundCourses = db.courses
  if (req.query.title) {
    foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
  }
  res.json(foundCourses) 
})

app.get('/brothers/:id', (req, res) => {
  const foundCourse = db.courses.find(c => c.id === +req.params.id)

  if (!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return
  }

  res.json(foundCourse)
})

app.post('/brothers', (req, res) => {
  
  if (!req.body.title){
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return 
  }

  const createdCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(createdCourse);
  res.status(HTTP_STATUSES.CREATED_201).json(createdCourse)
})

app.put('/brothers/:id', (req, res) => {
  const bro = db.courses.find(c => c.id === +req.params.id)

  if (bro) {
    bro.title = req.body.title
    res.send(bro)
  } else {
    res.send(HTTP_STATUSES.NOT_FOUND_404)
  }
})

app.delete('/brothers/:id', (req, res) => {
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