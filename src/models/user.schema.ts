import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt"
import { CustomError } from "../utils/error.utils";

export interface userDocument extends Document {
    name: string
    email?: string
    phone?: number
    password: string
    imageUrl: string
    type: string
    createdAt: Date
    updatedAt: Date
    validateUser(candidatePassword: string): Promise<Boolean>
}

function isLenght10(v: string) {
    return v.length === 10
}


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is a required field"]
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true,
        validate: [isLenght10, "phone Number must be of lenght 10"]
    },
    password: {
        type: String,
        required: true,
        max: [14, "password characters must not exceed 14 characters"]
    },
    imageUrl: {
        type: String,
    },
    type: {
        type: String,
        enum: {
            values: ["user", "admin"],
            message: '{VALUE} is not supported'
        },
        default: "user"
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    const user = this as unknown as userDocument
    if (!user.phone || !user.email) {
        throw new CustomError("no phoneNo or email found in the Document", 400)
    } else {
        return next()
    }
})

userSchema.pre("save", async function (next) {
    const user = this as unknown as userDocument
    if (!user.isModified("password")) {
        return next()
    } else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash
        return next()
    }
})


userSchema.methods.validateUser = async function (candidatePassword: string): Promise<Boolean> {
    try {
        const user = this as unknown as userDocument
        return await bcrypt.compare(candidatePassword, user.password)
        return true
    } catch (err: any) {
        console.log(err.message)
        return false
    }
}
const User = model<userDocument>("user", userSchema)
export default User