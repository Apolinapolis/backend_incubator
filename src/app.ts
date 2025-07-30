import express from 'express'
import {broRouters} from './routes/bro-routers'


export const app = express()
app.use(express.json())

app.use("/bro", broRouters())