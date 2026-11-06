/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

/** Chainable Mongoose query mock resolving to `result` via `.exec()` or `await`. */
export function mockQuery<T>(result: T): any {
  const query: any = {};
  ['sort', 'skip', 'limit', 'populate', 'lean', 'select'].forEach((method) => {
    query[method] = jest.fn(() => query);
  });
  query.exec = jest.fn().mockResolvedValue(result);
  query.then = (resolve: any, reject: any) => query.exec().then(resolve, reject);
  return query;
}

/** Model mock that can also be used with `new Model(data)`. */
export function mockModel(overrides: Record<string, any> = {}): any {
  const instances: any[] = [];
  const Model: any = jest.fn().mockImplementation((data: any) => {
    const doc = {
      _id: new Types.ObjectId(),
      messages: [],
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    };
    instances.push(doc);
    return doc;
  });
  Model.instances = instances;
  Object.assign(Model, overrides);
  return Model;
}
