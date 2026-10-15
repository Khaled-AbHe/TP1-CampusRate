import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
import { Review } from '../../reviews/models/review.schema.js';
import { User } from './user.schema.js';

@Schema({
  timestamps: true,
  versionKey: false,
  discriminatorKey: 'userType',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
      delete ret.password; // to hide the password
      return ret;
    },
  },
})
export class Student extends User {
  @ApiProperty({
    description: "Les appréciations de l'étudiant",
    type: () => [Review],
    required: false,
  })
  reviews?: Review[];
}

export const StudentSchema: MongooseSchema<Student> =
  SchemaFactory.createForClass(Student);
