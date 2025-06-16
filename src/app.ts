import express from 'express'
import { addBrothersRoutes } from '../routes/brothers'
import { addTestsRoutes } from '../routes/tests'
import { db } from './db/db'

export const app = express()


const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)


addBrothersRoutes(app, db)
addTestsRoutes(app, db)