import { MongoClient } from "mongodb"
import { DataBaseType } from "../types"


const mongoUri = process.env.mongoURI || "mongodb://127.0.0.1:27017"

export const client = new MongoClient(mongoUri)

const db = client.db('brothers_DB')
export const brothersCollection = db.collection<DataBaseType>('brothers')

export async function runDB() {
    try {
        await client.connect()
        await client.db('bro_repo').command({ping:1})
        console.log('connected successfully to mongo server')
    } catch {
        console.log("can't connected to db")
        await client.close()
    }
}