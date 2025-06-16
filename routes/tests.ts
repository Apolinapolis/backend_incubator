import {Express} from 'express'
import { DBType } from '../src/types'
import { HTTP_STATUSES } from './brothers'

export const addTestsRoutes = (app: Express, db:DBType) => {
    app.delete('/__test__/data', (req, res) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
}