import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn("MongoDB connection failed, using local storage fallback:", err.message);
        return null;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect().catch((err) => {
      console.warn("MongoDB connection failed, using local storage fallback:", err.message);
      return null;
    });
  }
} else {
  // Graceful fallback when MONGODB_URI is not set
  clientPromise = Promise.resolve(null);
}

/**
 * Returns a promise that resolves to a connected MongoClient or null if not configured.
 *
 * @returns {Promise<MongoClient|null>}
 */
export default clientPromise;
