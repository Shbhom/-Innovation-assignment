import "dotenv/config"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose"
import { userDocument } from "../models/user.schema"

const privateKey = process.env.PRIVATE_KEY as string
const publicKey = process.env.PUBLIC_KEY as string

export interface userPayload {
    user: userDocument
}
export interface userIdPayload {
    userId: ObjectId
}
export function signJwt(payload: userIdPayload | userPayload, expiryTime: string) {
    return jwt.sign(payload, privateKey,
        {
            algorithm: "RS256", expiresIn: expiryTime
        })
}
export function verfiyJwt(token: string) {
    try {
        const decode = jwt.verify(token, publicKey,
            {
                algorithms: ["RS256"]
            })
        return {
            decode, expired: false
        }
    } catch (error) {
        return {
            decode: null, expired: true
        }
    }
}