import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config"

const supaUrl = process.env.SUPA_URL as string
const supaKey = process.env.SUPA_KEY as string
const supaBucket = process.env.SUPA_BUCKET as string

export const supaClient = createClient(supaUrl, supaKey).storage.from(supaBucket)

export const upload = multer({
    storage: multer.memoryStorage(),
})

