import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema.js';
import { USER_SCHEMA_OPTIONS } from './schema.js';

@Schema(USER_SCHEMA_OPTIONS)
export class Admin extends User {}

export const AdminSchema: MongooseSchema<Admin> =
  SchemaFactory.createForClass(Admin);
