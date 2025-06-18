import { DataBaseType, DBType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'
import { CreateBroModel } from '../models/CreateBroModel'
import { GetBroModel } from '../models/GetBroQueryModel'
import { UpdateBroModel } from '../models/UpdateBroModel'
import { ViewBroModel } from '../models/ViewBroModel'
import { URIparamId } from '../models/URIParamIdModel'
import { Response} from 'express'
import { HTTP_STATUSES } from '../utils'
import express from 'express'
import { brothersRepoditory } from '../repositories/bro_repo'


const getBroViewModel = (bro: DataBaseType): ViewBroModel => {
    return {
        id: bro.id,
        title: bro.title,
        age: bro.age
    }
}

export const getBrothersRoutes = (db:DBType) => {

    const router = express.Router()


    router.get('/', (req: RequestWithQuery<GetBroModel>, res: Response<ViewBroModel[]>) => {
        const findedBro = brothersRepoditory.findBro(req.query.title?.toString())
        res.send(findedBro)
    })

    router.get('/:id', (req: RequestWithParams<URIparamId>, res: Response) => {
        const findedBro = brothersRepoditory.getBroById(+req.params.id)

        if (findedBro) {
            res.json({ id: findedBro.id, title: findedBro.title })
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
    })

    router.post('/', (req: RequestWithBody<CreateBroModel>, res: any) => {

        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        } else {
            return res.status(HTTP_STATUSES.CREATED_201).send(brothersRepoditory.createBrother(req.body.title))
        }
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIparamId, UpdateBroModel>, res) => {
        const isUpdated = brothersRepoditory.updateBrotherName(+req.params.id, req.body.title)

        if (isUpdated) {
            const bro = brothersRepoditory.getBroById(+req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).send(bro)
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


export const getIntrestingRouter = (db:DBType) => {

    const router = express.Router()

        router.get('/books', (req: RequestWithQuery<GetBroModel>, res) => {
        res.json({'title':'books'})
    })

    router.get('/:id', (req: RequestWithParams<URIparamId>, res) => {

        res.json({ title: 'request params id' + req.params.id })
    })


    return router

}