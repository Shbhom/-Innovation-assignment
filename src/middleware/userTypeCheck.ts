import { NextFunction, Request, Response } from "express";

export async function AdminCheck(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user
        if (user?.type === "admin") {
            return next()
        }
        return res.status(403).json({
            message: "Admins allowed only route"
        })
    } catch (err: any) {
        return next(err)
    }
}