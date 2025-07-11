import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";


export const inputValidationMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() })
    } else {
        next()
    }
}