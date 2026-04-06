// lib/db.ts
import { MongoClient, MongoClientOptions, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'plurse';

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

// Declare global types for caching
declare global {
    var _mongoClient: MongoClient | undefined;
    var _mongoDb: Db | undefined;
}

const options: MongoClientOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

let client: MongoClient;
let db: Db;

export const connectToDatabase = async () => {
    // Use cached connection in development
    if (process.env.NODE_ENV === 'development') {
        if (global._mongoClient && global._mongoDb) {
            return { client: global._mongoClient, db: global._mongoDb };
        }
        
        client = new MongoClient(MONGODB_URI, options);
        await client.connect();
        db = client.db(MONGODB_DB);
        
        global._mongoClient = client;
        global._mongoDb = db;
        
        return { client, db };
    }
    
    // Production: create new connection without caching
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    db = client.db(MONGODB_DB);
    
    return { client, db };
}

// Helper to get collection with type safety
export const getCollection = <T extends Document = any>(collectionName: string) => {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return db.collection<T>(collectionName);
}

export default connectToDatabase;