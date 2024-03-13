import express from 'express';
import createError from 'http-errors';
import { ObjectId } from 'mongodb';
import db from '../databases/mongodb.js';
import { preprocessing } from '../middlewares/middlewares.js';

const router = express.Router();
const characters = 'characters';

router.get('/', async (req, res, next) => {
  try {
    return res.json(await db.collection(characters).find().toArray());
  } catch (error) {
    return next(createError(409, error));
  }
});

router.get('/:_id', async (req, res, next) => {
  const { _id } = req.params;
  try {
    return res.json(
      await db.collection(characters).findOne({ _id: new ObjectId(_id) })
    );
  } catch (error) {
    return next(createError(409, error));
  }
});

router.post('/', preprocessing, async (req, res, next) => {
  try {
    const { insertedId } = await db.collection(characters).insertOne(req.body);
    const character = await db.collection(characters).findOne({ _id: insertedId });
    return res.status(201).json(character);
  } catch (error) {
    return next(createError(409, error));
  }
});

router.patch('/:_id', preprocessing, async (req, res, next) => {
  const { _id } = req.params;
  try {
    return res.json(
      await db
        .collection(characters)
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: req.body },
          { returnDocument: 'after' }
        )
    );
  } catch (error) {
    return next(createError(409, error));
  }
});

router.delete('/:_id', async (req, res, next) => {
  const { _id } = req.params;
  try {
    await db.collection(characters).deleteOne({ _id: new ObjectId(_id) });
    return res.status(204).json();
  } catch (error) {
    return next(createError(409, error));
  }
});

export default router;
