import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../enums/category.enum.js';
import { Status } from '../enums/status.enum.js';

export class CreatePlaceDto {
  @ApiProperty({
    description: "Nom de l'endroit",
    example: 'Bibliothèque centrale',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "Description de l'endroit",
    example: 'Grand espace de lecture calme avec prises électriques',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: "Catégorie de l'endroit",
    enum: Category,
    example: Category.LIBRARY,
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;

  @ApiProperty({
    description: "Adresse ou localisation de l'endroit sur le campus",
    example: 'Pavillon A, 2e étage',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    description: 'Services disponibles sur place',
    type: [String],
    required: false,
    example: ['Wi-Fi', 'Prises électriques'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  services?: string[];

  @ApiProperty({
    description: "Statut actuel de l'endroit",
    enum: Status,
    required: false,
    example: Status.ACTIVE,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
