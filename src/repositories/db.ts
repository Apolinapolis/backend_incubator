import { UserDBType, AvatarDBType } from "../types"
import mongoose from "mongoose"


export const mongoUri = process.env.mongoURI || "mongodb://127.0.0.1:27017/mongoose-example"
const { Schema } = mongoose;

const avatarSchema = new Schema<AvatarDBType>({
  src: {type:String, required:true},
  addedAt: {type:Date, required:true}
});

const brotherSchema = new Schema<UserDBType>({
  userName: {type:String, required:true},
  bio: {type:String, required:true},
  addedAt: Date,
  avatars:{type:[avatarSchema], required: true}
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