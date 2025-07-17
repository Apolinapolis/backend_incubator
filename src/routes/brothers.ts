import express, { Request, Response } from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'
import { CreateBroModel } from '../models/CreateBroModel'
import { GetBroModel } from '../models/GetBroQueryModel'
import { UpdateBroModel } from '../models/UpdateBroModel'
import { ViewBroModel } from '../models/ViewBroModel'
import { URIparamId } from '../models/URIParamIdModel'
import { HTTP_STATUSES } from '../utils'
import { brothersRepoditory } from '../repositories/brothers_repository'
import {body} from 'express-validator'
import { inputValidationMiddleWare } from '../middlewares/input-validation-mw'



export const getBrothersRoutes = () => {

    const router = express.Router()
    const titleValidation = body('title').trim().isLength({min:2, max:10}).withMessage("title length should be from two to then symbols")


    router.get('/', async (req: RequestWithQuery<GetBroModel>, res: Response<ViewBroModel[]>) => {
        const findedBro = await brothersRepoditory.findBro(req.query.title?.toString())
        res.send(findedBro)
    })

    router.get('/:id', async (req: RequestWithParams<URIparamId>, res: Response) => {
        const findedBro = await brothersRepoditory.getBroById(+req.params.id)

        if (findedBro) {
            res.json({ id: findedBro.id, title: findedBro.title })
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
    })

    router.post('/', titleValidation, inputValidationMiddleWare, async (req:RequestWithBody<CreateBroModel>, res: any) => {
            return res.status(HTTP_STATUSES.CREATED_201).send(await brothersRepoditory.createBrother(req.body.title))
    })

    router.put('/:id', titleValidation, inputValidationMiddleWare, async (req: RequestWithParamsAndBody<URIparamId, UpdateBroModel>, res) => {
        const isUpdated = await brothersRepoditory.updateBrotherName(+req.params.id, req.body.title)

        if (isUpdated) {
            const bro = brothersRepoditory.getBroById(+req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).send(bro)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.delete('/:id', async(req: RequestWithParams<URIparamId>, res) => {
        const broForDelete = await brothersRepoditory.deleteBro(+req.params.id)

        if (!broForDelete) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).send(brothersRepoditory.getBroById(+req.params.id))
        }
    })

    return router

}

export const getIntrestingRouter = () => {

    const router = express.Router()
        router.get('/books', (req: RequestWithQuery<GetBroModel>, res) => {
        res.json({'title':'books'})
    })

    router.get('/:id', (req: RequestWithParams<URIparamId>, res:Response) => {
        res.json({ title:'boom!' + req.params.id})
    })
    return router

}