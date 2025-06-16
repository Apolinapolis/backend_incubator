import { DataBaseType, DBType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../src/types'
import { CreateBroModel } from '../src/models/CreateBroModel'
import { GetBroModel } from '../src/models/GetBroQueryModel'
import { UpdateBroModel } from '../src/models/UpdateBroModel'
import { ViewBroModel } from '../src/models/ViewBroModel'
import { URIparamId } from '../src/models/URIParamIdModel'
import { Response} from 'express'
import { HTTP_STATUSES } from '../src/utils'
import express from 'express'


const getBroViewModel = (bro: DataBaseType): ViewBroModel => {
    return {
        id: bro.id,
        title: bro.title
    }
}

export const getBrothersRoutes = (db:DBType) => {

    const router = express.Router()


    router.get('/', (req: RequestWithQuery<GetBroModel>, res: Response<ViewBroModel[]>) => {

        let foundCourses = db.courses
        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
        }
        res.json(foundCourses.map(getBroViewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIparamId>, res: Response<ViewBroModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json({ id: foundCourse.id, title: foundCourse.title })
    })

    router.post('/', (req: RequestWithBody<CreateBroModel>, res: Response<ViewBroModel>) => {

        if (!req.body.title) {
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

    router.put('/:id', (req: RequestWithParamsAndBody<URIparamId, UpdateBroModel>, res) => {

        const bro = db.courses.find(c => c.id === +req.params.id)

        if (bro) {
            bro.title = req.body.title
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.delete('/:id', (req: RequestWithParams<URIparamId>, res) => {
        if (!db.courses.find(c => c.id === +req.params.id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router

}