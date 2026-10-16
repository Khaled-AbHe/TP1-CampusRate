import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema.js';
import { USER_SCHEMA_OPTIONS } from './schema.js';

@Schema(USER_SCHEMA_OPTIONS)
export class Student extends User {}

export const StudentSchema: MongooseSchema<Student> =
  SchemaFactory.createForClass(Student);

StudentSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'student',
});
