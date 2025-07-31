import express, { Response } from 'express'
import { HTTP_STATUSES } from '../utils'
import { body } from 'express-validator'
import { inputValidationMiddleWare } from '../middlewares/input-validation-mw'
import { brothersServise } from '../domain/brothers-servise'



export const broRouters = () => {

    const router = express.Router()
    const titleValidation = body('userName').trim().isLength({ min: 2, max: 10 }).withMessage("userName length should be from two to then symbols")

    router.post('/', titleValidation, inputValidationMiddleWare,
        async (req: Request<{}, {}, { userName: string, bio: string }>, res: Response) => {
            const newUser = await brothersServise.createBrother(req.body.title)
            return res.status(HTTP_STATUSES.CREATED_201).send(newUser)
        })

    router.put('/:id', titleValidation, inputValidationMiddleWare,
        async (req: Request<{ id: string }, { userName: string, bio: string }>, res: Response) => {
            const isUpdated = await brothersServise.updateBro(+req.params.id, req.body.bio, req.body.userName) // check the order updateBre params

            if (isUpdated) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        })

    router.get('/',
        async (req: Request, res: Response) => {
            const findedBro = await brothersServise.findBro(req.query.title?.toString())
            res.send(findedBro)
        })

    router.get('/:id',
        async (req: Request<{ id: string }, { userName: string, bio: string }>, res: Response) => {
            const findedBro = await brothersServise.getBroById(+req.params.id)
            if (findedBro) {
                res.json(findedBro)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
        })

    router.delete('/:id',
        async (req: Request<{ id: string }>, res: Response) => {
            const isBroExist = await brothersServise.getBroById(+req.params.id)
            if (isBroExist) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).send(isBroExist)
                brothersServise.deleteBro(+req.params.id)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        })
    return router
}