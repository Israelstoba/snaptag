// src/lib/db.js
import { openDB } from 'idb';

const DB_NAME = 'SnapTagDB';
const STORE_NAME = 'snaps';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    },
  });
};

export const addSnap = async (snap) => {
  const db = await initDB();
  await db.add(STORE_NAME, snap);
};

export const getSnaps = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteSnap = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const clearSnaps = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
