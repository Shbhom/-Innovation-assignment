import express, { NextFunction, Request, Response } from "express"
import { loginUser, registerUser } from "../controller/auth.controller"
import verifyUser from "../middleware/verifyUser"
import { upload } from "../utils/pfp.utils"
import { AdminCheck } from "../middleware/userTypeCheck"
import { deleteUser, getCurrentUser, getUserById, updateCurrentUser, updateCurrentUserPfp, updateUserById, updateUserPfpById } from "../controller/user.controller"
const userRouter = express.Router()

userRouter.post("/register", upload.single('pfp'), registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/current", verifyUser, getCurrentUser)
userRouter.get("/ById/:Id", verifyUser, AdminCheck, getUserById)

userRouter.patch("/current", verifyUser, updateCurrentUser)
userRouter.put("/current", upload.single('pfp'), verifyUser, updateCurrentUserPfp)

userRouter.patch("/ById/:Id", verifyUser, AdminCheck, updateUserById)
userRouter.put("/ById/:Id", upload.single('pfp'), verifyUser, AdminCheck, updateUserPfpById)

userRouter.delete("/current",verifyUser,deleteUser)


export default userRouter