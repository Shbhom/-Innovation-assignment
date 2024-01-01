import mongoose from "mongoose"
import "dotenv/config"

const dbURI = process.env.DBURI as string

export default async function ConnectDB() {
    await mongoose.connect(dbURI)
        .then(() => { console.log('DB connected Successfully') })
        .catch((e) => { console.log(e.message) })
}