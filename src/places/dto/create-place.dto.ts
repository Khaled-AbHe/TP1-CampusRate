import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../enums/category.enum.js';
import { Status } from '../enums/status.enum.js';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  services?: string[];

  @IsEnum(Status)
  @IsOptional()
  status?: string;
}
