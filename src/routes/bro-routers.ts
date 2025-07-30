import express, { Response } from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'
import { CreateBroModel } from '../models/CreateBroModel'
import { GetBroModel } from '../models/GetBroQueryModel'
import { UpdateBroModel } from '../models/UpdateBroModel'
import { ViewBroModel } from '../models/ViewBroModel'
import { URIparamId } from '../models/URIParamIdModel'
import { HTTP_STATUSES } from '../utils'
import { body } from 'express-validator'
import { inputValidationMiddleWare } from '../middlewares/input-validation-mw'
import { brothersServise } from '../domain/brothers-servise'



export const broRouters = () => {

    const router = express.Router()
    const titleValidation = body('title').trim().isLength({ min: 2, max: 10 }).withMessage("title length should be from two to then symbols")

    router.post('/', titleValidation, inputValidationMiddleWare, async (req: RequestWithBody<CreateBroModel>, res: any) => {
        return res.status(HTTP_STATUSES.CREATED_201).send(await brothersServise.createBrother(req.body.title))
    })


    router.get('/', async (req: RequestWithQuery<GetBroModel>, res: Response<ViewBroModel[]>) => {
        const findedBro = await brothersServise.findBro(req.query.title?.toString())
        res.send(findedBro)
    })

    router.get('/:id', async (req: RequestWithParams<URIparamId>, res: Response) => {
        const findedBro = await brothersServise.getBroById(+req.params.id)

        if (findedBro) {
            res.json({ id: findedBro.id, title: findedBro.title })
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
    })



    router.put('/:id', titleValidation, inputValidationMiddleWare, async (req: RequestWithParamsAndBody<URIparamId, UpdateBroModel>, res) => {
        const isUpdated = await brothersServise.updateBrotherName(+req.params.id, req.body.title)

        if (isUpdated) {
            const bro = brothersServise.getBroById(+req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).send(bro)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.delete('/:id', async (req: RequestWithParams<URIparamId>, res) => {
        const broForDelete = await brothersServise.deleteBro(+req.params.id)

        if (!broForDelete) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).send(brothersServise.getBroById(+req.params.id))
        }
    })
    return router
}