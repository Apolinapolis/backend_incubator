import { UserDBType } from "../types"
import mongoose from "mongoose"


const mongoUri = process.env.mongoURI || "mongodb://127.0.0.1:27017/mongoose-example"
const { Schema } = mongoose;
const brotherSchema = new Schema<UserDBType>({
  userName: String,
  bio: String,
  addedAt: Date
});

export const BrotherModel = mongoose.model('asd', brotherSchema)

export async function runDB() {
    try {
        await mongoose.connect(mongoUri);
        console.log('connected successfully to mongo server')
    } catch {
        console.log("can't connected to db")
        await mongoose.disconnect()
    }
}