import { NextFunction, Request, Response } from "express";
import User from "../models/user.schema";
import { CustomError } from "../utils/error.utils";
import { removePfp, updatePfp } from "../services/pfpService";

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user
        return res.status(200).json({
            user
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const { Id } = req.params
        const user = Id ? await User.findById(Id) : null
        if (!user) {
            throw new CustomError("No User Found with provided Id", 404)
        }
        return res.status(200).json({
            user
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function updateCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body
        const user = req.user
        const newUser = await User.findByIdAndUpdate(user!._id, { name: name })
        return res.status(200).json({
            message: `user's name successfully updated to ${name}`,
            newUser
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function updateCurrentUserPfp(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user

        const pfp = req.file

        if (!user) {
            throw new CustomError("Not authorized", 403)
        }
        if (!pfp) {
            throw new CustomError("No pfp found invalid request", 400)
        }

        let { isUploaded, link } = await updatePfp(user, pfp)

        if (!isUploaded) {
            throw new CustomError("Unable to update user pfp", 500)
        }
        return res.status(200).json({
            message: "image updated successfully",
            link
        })
    } catch (err: any) {
        return next(err)
    }
}
export async function updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
        let { Id } = req.params
        const { name }: { name: string } = req.body
        const user = await User.findById(Id)
        if (!user) {
            throw new CustomError("No user found with given Id", 404)
        }
        user.name = name
        await user.save()
        return res.status(200).json({
            message: "updated successfully",
            user
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function updateUserPfpById(req: Request, res: Response, next: NextFunction) {
    try {
        const { Id } = req.params
        const pfp = req.file

        if (!pfp) {
            throw new CustomError("No pfp found invalid request", 400)
        }
        const user = await User.findById(Id)

        if (!user) {
            throw new CustomError("No user found with following Id", 404)
        }

        let { isUploaded, link } = await updatePfp(user, pfp)

        if (!isUploaded) {
            throw new CustomError("Unable to update user pfp", 500)
        }

        return res.status(200).json({
            message: "image updated successfully",
            link
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user
        const isRemoved = await removePfp(user!)
        if (!isRemoved) {
            throw new CustomError("Unable to remove pfp", 500)
        }
        await User.deleteOne({ id: user!._id }).then(() => { console.log("user Deleted Successfully") })
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(204).json({
            message: "deleted User successfully"
        })
    } catch (err: any) {
        return next(err)
    }
}