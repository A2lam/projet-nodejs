import joi from 'joi';
import { ObjectId } from 'mongodb';
import passwordHash from 'password-hash';
import clients from '../../clients';
import model, { modelForUpdate } from './model';
import errors from '../../enums/errors';

class UsersServices {
  constructor(collectionName) {
    this.COLLECTION_NAME = collectionName;
  }

  createOne(data) {
    return joi.validate(data, model).then((validatedData) => {
      validatedData.password = passwordHash.generate(validatedData.password);
      clients.mongodb()
        .then(db => db.collection(this.COLLECTION_NAME).insertOne(validatedData))
        .then(response => response.ops[0]);
    });
  }

  deleteOne(email) {
    return joi.validate(email, joi.string().email().required())
      .then(() => clients.mongodb())
      .then(db => db.collection(this.COLLECTION_NAME).deleteOne({ email }))
      .then((response) => {
        if (response.deletedCount === 0) throw errors.notFound();

        return response;
      });
  }

  find(first = 20, offset = 0, term) {
    return clients.mongodb()
      .then((db) => {
        return db
          .collection(this.COLLECTION_NAME)
          .find(term ? { $text: { $search: term } } : null)
          .skip(offset)
          .limit(first)
          .toArray();
      });
  }

  findOne(email) {
    return joi.validate(email, joi.string().email().required())
      .then(() => clients.mongodb())
      .then(db => db.collection(this.COLLECTION_NAME).findOne({ email }))
      .then((list) => {
        if (!list) throw errors.notFound();
        return list;
      });
  }

  updateOne(email, data) {
    return joi.validate(email, joi.string().email().required())
      .then(() => joi.validate(data, modelForUpdate))
      .then((validatedData) => {
        return clients.mongodb()
          .then(db => db
            .collection(this.COLLECTION_NAME)
            .updateOne(
              { email },
              { $set: validatedData },
            ));
      })
      .then((response) => {
        if (response.matchedCount === 0) throw errors.notFound();

        return response;
      })
      .then(() => this.findOne(email));
  }
}

export default new UsersServices('users');
