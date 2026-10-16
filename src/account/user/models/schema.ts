import { SchemaOptions } from '@nestjs/mongoose';

export const USER_SCHEMA_OPTIONS: SchemaOptions = {
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
  toObject: { virtuals: true },
};
