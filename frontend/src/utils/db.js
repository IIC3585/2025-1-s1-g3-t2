import { openDB } from 'idb';

export const initDB = async () => {
  return await openDB('imagesDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
};

export const saveImageToDB = async (name, blob) => {
  const db = await initDB();
  await db.add('images', {
    name,
    date: new Date(),
    blob
  });
};

export const getAllImages = async () => {
  const db = await initDB();
  return await db.getAll('images');
};

export const clearImagesFromDB = async () => {
  const db = await initDB();
  const tx = db.transaction('images', 'readwrite');
  await tx.objectStore('images').clear();
  await tx.done;
};
