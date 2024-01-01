import { Request, Response, NextFunction } from "express"
import { signJwt, verfiyJwt } from "../utils/jwt.utils"
import User from "../models/user.schema"

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { accessToken, refreshToken } = req.cookies
        const { decode: accessDecode, expired: accessExpired } = verfiyJwt(accessToken)
        if (accessDecode) {
            //@ts-ignore
            req.user = accessDecode.user
            return next()
        }
        const { decode: refreshDecode, expired: refreshExpired } = accessExpired && refreshToken ? verfiyJwt(refreshToken) : { decode: null, expired: true }
        if (refreshDecode) {
            // @ts-ignore
            const user = await User.findById(refreshDecode.userId)
            const newAccessToken = signJwt({ user: user! }, "15m")
            const newUser = verfiyJwt(newAccessToken)
            //@ts-ignore
            req.user = newUser!.decode.user
            res.cookie("accessToken", newAccessToken, { secure: true, httpOnly: true, maxAge: 15 * 60 * 1000 })
            return next()
        }
        res.status(403).json({
            status: "Failed",
            message: "Tokens expired relogin to continue"
        })
        return next()

    } catch (error: any) {
        res.status(403).json({
            status: "Failed",
            message: error.message
        })
        return next()

    }
}

export default verifyUser