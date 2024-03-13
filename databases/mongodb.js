import { MongoClient } from 'mongodb';

const db = await MongoClient.connect(process.env.DATABASE_URL)
  .then((client) => client.db())
  .catch(() => null);

if (db && !(await db.listCollections({ name: 'characters' }).next())) {
  db.createCollection('characters', { collation: { locale: 'ja', strength: 2 } });
  db.collection('characters').createIndex({ name: 1 }, { unique: true });
}

if (db && !(await db.listCollections({ name: 'googleUsers' }).next())) {
  db.createCollection('googleUsers', { collation: { locale: 'ja', strength: 2 } });
}

export default db;
