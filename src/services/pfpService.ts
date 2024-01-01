import { userDocument } from "../models/user.schema";
import { supaClient } from "../utils/pfp.utils";
import { CustomError } from "../utils/error.utils";
import User from "../models/user.schema";

type pfpUploadReturn = {
    isUploaded: boolean,
    link: string
}

export async function updatePfp(user: userDocument, pfp: Express.Multer.File): Promise<pfpUploadReturn> {
    const isRemoved = await removePfp(user)

    if (!isRemoved) {
        throw new CustomError("Unable to remove pfp", 500)
    }
    const pfpName = pfp.originalname.replaceAll(' ', '-').split('.')
    let imageName = pfpName[0] + Date.now().toString() + `.${pfpName[1]}`
    const { data, error } = await supaClient.upload(`pfp/${imageName}`, pfp.buffer)
    let link;
    if (error) {
        throw new CustomError(error.message, 500)
    } else {
        link = supaClient.getPublicUrl(data.path)
    }
    if (!link.data.publicUrl) {
        throw new CustomError("Unable to generate public Url", 500)
    }
    let uploadedSucc = await User.findByIdAndUpdate(user._id, { imageUrl: link.data.publicUrl }) ? true : false
    if (uploadedSucc) {
        return { isUploaded: uploadedSucc, link: link.data.publicUrl }
    } else {
        return { isUploaded: false, link: "" }
    }
}

export async function removePfp(input: string | userDocument): Promise<boolean> {
    let isRemoved: boolean = false
    let newUrl: URL;
    if (typeof input === "string") {
        newUrl = new URL(input)
    } else {
        newUrl = new URL(input.imageUrl)
    }
    const previousImage = newUrl.pathname.split('/')

    const previousImageName = `pfp/${previousImage[previousImage.length - 1]}`

    await supaClient.remove([previousImageName]).then(() => {
        isRemoved = true
    })
    return isRemoved
}

export async function uploadPfp(pfp: Express.Multer.File): Promise<string> {
    const pfpName = pfp.originalname.replaceAll(' ', '-').split('.')
    let imageName = pfpName[0] + Date.now().toString() + `.${pfpName[1]}`
    const { data, error } = await supaClient.upload(`pfp/${imageName}`, pfp.buffer)
    let link;
    if (error) {
        throw new CustomError(error.message, 500)
    } else {
        link = supaClient.getPublicUrl(data.path)
    }
    if (!link.data.publicUrl) {
        throw new CustomError("Unable to generate public Url", 500)
    }
    return link.data.publicUrl
}