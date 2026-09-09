import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const SEED_PATH = path.join(__dirname, 'data', 'products.seed.json');

function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/** Ensure products are seeded once */
export function initDb() {
  const db = readDb();
  if (!db.products || db.products.length === 0) {
    const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
    db.products = seed;
    if (!db.users) db.users = [];
    if (!db.orders) db.orders = [];
    writeDb(db);
    console.log(`[db] Seeded ${seed.length} products`);
  }
  return db;
}

export function getDb() {
  return readDb();
}

export function saveDb(db) {
  writeDb(db);
}

export function findUserByEmail(email) {
  const db = getDb();
  return db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id) {
  const db = getDb();
  return db.users.find((u) => u.id === id);
}
