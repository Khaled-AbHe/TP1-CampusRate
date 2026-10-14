import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Category } from '../enums/category.enum.js';
import { Status } from '../enums/status.enum.js';

@Schema({ timestamps: true })
export class Place extends Document {
  @ApiProperty({
    description:
      "Identifiant unique de l'endroit. (plc_01J[3 caractères majusticule][3 chiffres])",
    example: 'plc_01JABC123',
  })
  @Prop({ required: true, unique: true })
  id!: string;

  @ApiProperty({
    description: "Nom de l'endroit",
    example: 'Bibliothèque centrale',
  })
  @Prop({ required: true })
  name!: string;

  @ApiProperty({
    description: "Description de l'endroit",
    example: 'Grand espace de lecture calme avec prises électriques',
  })
  @Prop({ required: true })
  description!: string;

  @ApiProperty({
    description: "Catégorie de l'endroit",
    enum: Category,
    example: Category.LIBRARY,
  })
  @Prop({ required: true })
  category!: Category;

  @ApiProperty({
    description: "Adresse ou localisation de l'endroit sur le campus",
    example: 'Pavillon A, 2e étage',
  })
  @Prop({ required: true })
  address!: string;

  @ApiProperty({
    description: 'Services disponibles sur place',
    type: [String],
    required: false,
    example: ['Wi-Fi', 'Prises électriques'],
  })
  services?: string[];

  @ApiProperty({
    description: "Statut actuel de l'endroit",
    enum: Status,
    required: false,
    example: Status.ACTIVE,
  })
  @Prop({ default: null })
  status?: Status;

  @ApiProperty({
    description:
      'Note moyenne calculée à partir des avis, ou null si aucun avis',
    example: 4.5,
    nullable: true,
  })
  @Prop({ default: null })
  averageRating: number | null;

  @ApiProperty({
    description: "Nombre total d'avis associés à l'endroit",
    example: 12,
  })
  @Prop({ default: null })
  reviewCount: number;

  @ApiProperty({
    description: "Date de création l'endroit",
    example: '2026-01-15T10:30:00.000Z',
  })
  @Prop({ default: null })
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière modification de l'endroit",
    example: '2026-02-01T08:00:00.000Z',
  })
  @Prop({ default: null })
  updatedAt: Date;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
