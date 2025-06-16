import { DataBaseType, DBType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../src/types'
import { CreateBroModel } from '../src/models/CreateBroModel'
import { GetBroModel } from '../src/models/GetBroQueryModel'
import { UpdateBroModel } from '../src/models/UpdateBroModel'
import { ViewBroModel } from '../src/models/ViewBroModel'
import { URIparamId } from '../src/models/URIParamIdModel'
import { Response, Express } from 'express'


export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
}

export const addBrothersRoutes = (app: Express, db:DBType) => {

    const getBroViewModel = (bro: DataBaseType): ViewBroModel => {
        return {
            id: bro.id,
            title: bro.title
        }
    }


    app.get('/brothers', (req: RequestWithQuery<GetBroModel>, res: Response<ViewBroModel[]>) => {

        let foundCourses = db.courses
        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
        }
        res.json(foundCourses.map(getBroViewModel))
    })

    app.get('/brothers/:id', (req: RequestWithParams<URIparamId>, res: Response<ViewBroModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json({ id: foundCourse.id, title: foundCourse.title })
    })

    app.post('/brothers', (req: RequestWithBody<CreateBroModel>, res: Response<ViewBroModel>) => {

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

    app.put('/brothers/:id', (req: RequestWithParamsAndBody<URIparamId, UpdateBroModel>, res) => {

        const bro = db.courses.find(c => c.id === +req.params.id)

        if (bro) {
            bro.title = req.body.title
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    app.delete('/brothers/:id', (req: RequestWithParams<URIparamId>, res) => {
        if (!db.courses.find(c => c.id === +req.params.id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

}