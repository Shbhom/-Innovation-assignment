import { Request, Response, NextFunction } from "express"

export class CustomError {
    message: string
    statusCode: number
    constructor(message: string, statusCode: number) {
        this.message = message
        this.statusCode = statusCode
    }
}

export async function errorhandler(err: CustomError | TypeError, req: Request, res: Response, next: NextFunction) {
    let customError = err
    if (!(err instanceof CustomError)) {
        customError = new CustomError(err.message, 500)
    }
    return res.status((customError as CustomError).statusCode).json({
        customError
    })
}