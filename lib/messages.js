import sql from "better-sqlite3";
import { cache } from "react";
import { unstable_cache as nextCache } from "next/cache";

const db = new sql("messages.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
}

//here we are performing request deduplication by exporting {cache}
//also imported {unstable_cache} when we When you wrap a data fetching function with unstable_cache, Next.js will cache the result of the function based on the specified cache key and cache duration. This can significantly improve the performance of your application by reducing the number of redundant requests to your backend or external APIs.

export const getMessages = nextCache(
  cache(function getMessages() {
    console.log("Fetching messages from db");
    return db.prepare("SELECT * FROM messages").all();
  }),
  ["messages"],
  {
    tags: ["msg"],
  }
);
