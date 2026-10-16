import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import * as mongoose from 'mongoose';

// Source: https://stackoverflow.com/a/73446419
@Catch(mongoose.mongo.MongoServerError)
export class DuplicateUsernameFilter implements ExceptionFilter {
  catch(exception: MongoServerError) {
    if (exception.code && exception.code === 11000)
      throw new ConflictException('Username is already taken');
  }
}
