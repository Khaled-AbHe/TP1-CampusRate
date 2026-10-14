import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @ApiProperty({
    description:
      "Identifiant unique de l'appréciation. (rev_01J[3 caractères majusticule][3 chiffres])",
    example: 'rev_01JABC123',
  })
  @Prop({ required: true, unique: true })
  id!: string;

  @ApiProperty({
    description: "Identifiant de l'endroit concerné par l'appréciation",
    example: 'plc_01JABC123',
  })
  @Prop({ required: true })
  placeId!: string;

  @ApiProperty({
    description: "Nom de l'auteur de l'appréciation",
    example: 'Camille Tremblay',
  })
  @Prop({ required: true })
  authorName!: string;

  @ApiProperty({
    description: "Note attribuée à l'endroit, de 1 à 5",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @Prop({ required: true })
  rating!: number;

  @ApiProperty({
    description: "Commentaire laissé par l'auteur de l'appréciation",
    example: 'Endroit calme et bien situé, parfait pour étudier.',
  })
  @Prop({ required: true })
  comment!: string;

  @ApiProperty({
    description: "Date de création de l'appréciation",
    example: '2026-01-15T10:30:00.000Z',
  })
  @Prop({ default: null })
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière modification de l'appréciation",
    example: '2026-02-01T08:00:00.000Z',
  })
  @Prop({ default: null })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);