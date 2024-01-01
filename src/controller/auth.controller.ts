import { Request, Response, NextFunction } from "express"
import User, { userDocument } from "../models/user.schema"
import { CustomError } from "../utils/error.utils"
import { signJwt } from "../utils/jwt.utils"
import { removePfp, uploadPfp } from "../services/pfpService"
import mongoose from "mongoose"

interface registerBody {
    name: string
    email?: string
    phone?: string
    password: string
    type: string
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    let imageLink: string = "";
    try {
        const { name, email, phone, password, type }: registerBody = req.body
        const pfp = req.file
        if (!pfp) {
            throw new CustomError("No pfp file Provided", 400)
        }
        let createParams: any = {}
        createParams.name = name
        createParams.password = password
        if (phone) {
            createParams.phone = Number(phone)
        }
        if (email) {
            createParams.email = email
        }
        if (type) {
            createParams.type = type
        }
        imageLink = await uploadPfp(pfp)
        createParams.imageUrl = imageLink
        let user = await (await User.create(createParams)).save()
        const accessToken = signJwt({ user }, "15m")
        const refreshToken = signJwt({ userId: user.id }, "2d")
        res.cookie("accessToken", accessToken, { secure: true, httpOnly: true, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
        return res.status(201).json({
            message: `succesfully created new User ${user.name}`,
            user,
        })
    } catch (err: any) {
        try {
            if (err instanceof mongoose.Error) {
                await removePfp(imageLink)
            }
        } finally {
            return next(err)
        }
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phone, password } = req.body
        if (!email && !password || !phone && !password) {
            throw new CustomError("invalid req body", 400)
        }
        const user = email ? await User.findOne({ email }) : await User.findOne({ phone: Number(phone) })
        let isUser: Boolean;
        if (user) {
            isUser = await user.validateUser(password)
        } else {
            throw new CustomError("No user found with provided email or phone", 404)
        }
        if (!isUser) {
            throw new CustomError("invalid user credentials", 403)
        }
        const accessToken = signJwt({ user: user! }, "15m")
        const refreshToken = signJwt({ userId: user!.id }, "2d")
        res.cookie("accessToken", accessToken, { secure: true, httpOnly: true, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
        return res.status(201).json({
            message: `succesfully created new User ${user!.name}`,
            user,
        })
    } catch (err: any) {
        return next(err)
    }
}

