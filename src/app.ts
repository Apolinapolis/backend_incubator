import express from 'express'

import { db } from './db/db'
import { getBrothersRoutes, getIntrestingRouter } from './routes/brothers'
import { getTestsRouter } from './routes/tests'

export const app = express()


const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)
app.use("/brothers", getBrothersRoutes(db))
app.use('/__test__', getTestsRouter(db))
app.use('/int', getIntrestingRouter(db))