import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import RandExp from 'randexp';
import { UserType } from '../enum/user-type.enum.js';

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
export class User extends Document<string> {
  @ApiProperty({
    description:
      "Identifiant unique d'une utilisateur. (usr_01J[3 caractères majusticule][3 chiffres])",
    example: 'usr_01JABC123',
  })
  @Prop({
    type: String,
    default: () => new RandExp(/^usr_01J[A-Z]{3}\d{3}$/).gen(),
  })
  declare _id: string;

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Khaled',
  })
  @Prop({ required: true, unique: true })
  username!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'abc123',
  })
  @Prop({ required: true })
  password!: string;

  @ApiProperty({
    description: "Le type d'utilisateur",
    enum: UserType,
    example: UserType.ETUDIANT,
  })
  declare userType: UserType; // no prop bc mongoose can handle it

  @ApiProperty({
    description: "Date de création de l'utilisateur",
    example: '2026-01-15T10:30:00.000Z',
  })
  @Prop({ default: null })
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière modification de l'utilisateur",
    example: '2026-02-01T08:00:00.000Z',
  })
  @Prop({ default: null })
  updatedAt: Date;
}

export const UserSchema: MongooseSchema<User> =
  SchemaFactory.createForClass(User);
