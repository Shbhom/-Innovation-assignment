import { userDocument } from "../../models/user.schema";

declare global {
    namespace Express {
        export interface Request {
            user?: userDocument
        }
    }
}