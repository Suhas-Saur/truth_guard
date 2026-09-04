import clientPromise from "../lib/mongodb";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_HISTORY_FILE = path.join(DATA_DIR, "history.json");

// Ensure local data dir exists
function ensureLocalFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_HISTORY_FILE)) {
      fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify([]), "utf-8");
    }
  } catch (e) {
    console.error("Failed to initialize local data directory:", e.message);
  }
}

// In-memory fallback if file system write is ever restricted
let memoryHistory = [];

export const HistoryModel = {
  /**
   * Fetch recent history scans (up to limit)
   */
  async getRecent(limit = 50) {
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db("truthguard");
        const items = await db
          .collection("history")
          .find({})
          .sort({ timestamp: -1 })
          .limit(limit)
          .toArray();
        return items.map((item) => ({
          id: item._id ? item._id.toString() : item.id,
          type: item.type,
          query: item.query,
          result: item.result,
          score: item.score,
          reason: item.reason,
          timestamp: item.timestamp || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn("MongoDB query failed, falling back to local file:", err.message);
    }

    // Local JSON File fallback
    try {
      ensureLocalFile();
      if (fs.existsSync(LOCAL_HISTORY_FILE)) {
        const data = fs.readFileSync(LOCAL_HISTORY_FILE, "utf-8");
        const list = JSON.parse(data || "[]");
        return list.slice(0, limit);
      }
    } catch (err) {
      console.warn("Local file read error, returning in-memory:", err.message);
    }

    return memoryHistory.slice(0, limit);
  },

  /**
   * Add a new scan record
   */
  async add({ type, query, result, score, reason }) {
    const record = {
      id: "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      type: type || "general",
      query: typeof query === "string" ? query.slice(0, 300) : "Media upload",
      result: result || "Uncertain",
      score: typeof score === "number" ? score : 50,
      reason: reason || "Analysis complete.",
      timestamp: new Date().toISOString(),
    };

    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db("truthguard");
        await db.collection("history").insertOne(record);
        return record;
      }
    } catch (err) {
      console.warn("MongoDB insert failed, saving to local file:", err.message);
    }

    // Local file fallback
    try {
      ensureLocalFile();
      let current = [];
      if (fs.existsSync(LOCAL_HISTORY_FILE)) {
        const data = fs.readFileSync(LOCAL_HISTORY_FILE, "utf-8");
        current = JSON.parse(data || "[]");
      }
      current.unshift(record);
      // keep max 200 items locally
      if (current.length > 200) current = current.slice(0, 200);
      fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify(current, null, 2), "utf-8");
    } catch (err) {
      console.warn("Local file write error, saving to memory:", err.message);
      memoryHistory.unshift(record);
    }

    return record;
  },

  /**
   * Clear all scan records
   */
  async clear() {
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db("truthguard");
        await db.collection("history").deleteMany({});
      }
    } catch (err) {
      console.warn("MongoDB clear failed:", err.message);
    }

    try {
      ensureLocalFile();
      fs.writeFileSync(LOCAL_HISTORY_FILE, JSON.stringify([]), "utf-8");
    } catch (err) {
      console.warn("File clear error:", err.message);
    }

    memoryHistory = [];
    return true;
  },
};

export default HistoryModel;
