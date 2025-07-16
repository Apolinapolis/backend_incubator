import { MongoClient } from "mongodb"


const mongoUri = process.env.mongoURI || 'mongodb:0.0.0.0:27017/?maxPoolsize=20&w=majority'

export const client = new MongoClient(mongoUri)


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