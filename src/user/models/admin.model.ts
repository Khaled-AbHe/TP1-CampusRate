import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
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
export class Admin extends User {}

export const AdminSchema: MongooseSchema<Admin> =
  SchemaFactory.createForClass(Admin);
