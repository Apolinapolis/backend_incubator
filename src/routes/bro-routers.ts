import express, { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { HTTP_STATUSES } from '../utils'
import { body } from 'express-validator'
import { inputValidationMiddleWare } from '../middlewares/input-validation-mw'
import { brothersServise } from '../domain/brothers-servise'
import mongoose from 'mongoose'



export const broRouters = () => {

    const router = express.Router()
    const titleValidation = body('userName').trim().isLength({ min: 2, max: 100 })
    .withMessage("userName length should be more then one and less then 100 symbols")

    router.get('/',
        async (req: Request, res: Response) => {
            const findedBro = await brothersServise.getBrothers()
            res.send(findedBro)
        })

    router.get('/:id',
        async (req: Request<{ id: string }, { userName: string, bio: string }>, res: Response) => {
            const findedBro = await brothersServise.getBroById(new mongoose.Types.ObjectId(req.params.id))
            if (findedBro) {
                res.json(findedBro)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
        })

    router.post('/', titleValidation, inputValidationMiddleWare,
        async (req: Request<{}, {}, { userName: string, bio: string }>, res: Response) => {
            const newUser = await brothersServise.createBrother(req.body.userName, req.body.bio)
            res.status(HTTP_STATUSES.CREATED_201).send(newUser)
        })

    router.put('/:id', titleValidation, inputValidationMiddleWare,
        async (req: Request<{ id: string }, { userName: string, bio: string }>, res: Response) => {
            const isUpdated = await brothersServise.updateBro(new mongoose.Types.ObjectId(req.params.id), req.body.userName, req.body.bio,)

            if (isUpdated) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        })

    router.delete('/all',
        async (req: Request, res: Response) => {
            try {
                const deletedCount = await brothersServise.cleanDB()
                res.status(HTTP_STATUSES.OK_200).send({ message: `Deleted ${deletedCount} bros. Database is clean.` })
            } catch (error) {
                console.error("Failed to clean DB:", error);
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            }
        })

    router.delete('/:id',
        async (req: Request<{ id: string }>, res: Response) => {
            const isBroExist = await brothersServise.getBroById(new mongoose.Types.ObjectId(req.params.id))
            if (isBroExist) {
                brothersServise.deleteBro(new mongoose.Types.ObjectId(req.params.id))
                res.status(HTTP_STATUSES.OK_200).send({ message: `${isBroExist.userName} was deleted!` })
            } else {
                res.status(HTTP_STATUSES.NOT_FOUND_404)
            }
        })

    return router
}