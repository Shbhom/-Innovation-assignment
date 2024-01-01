import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./routes/user.routes";
import { errorhandler } from "./utils/error.utils";
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api/user", userRouter)
app.use(errorhandler)


export default app
