import express from 'express'

export const getTestsRouter = (db:any) => {

    const router = express.Router()

    router.delete('/data', (req, res) => {
        db.courses = []
        res.sendStatus(204)
    })

    return router
}