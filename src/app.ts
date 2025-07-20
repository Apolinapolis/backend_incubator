import express, { NextFunction, Response } from 'express'
import { getBrothersRoutes, getIntrestingRouter } from './routes/brothers'
import { getTestsRouter } from './routes/tests'

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use("/bro", getBrothersRoutes())
app.use('/int', getIntrestingRouter())
// app.use('/__test__', getTestsRouter(db))