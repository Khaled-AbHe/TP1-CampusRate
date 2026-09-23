import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Category } from '../../../places/enums/category.enum.js';
import { PageOptionsDto } from './page-options.dto.js';

export class PlacesPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: "Catégorie de l'endroit",
    enum: Category,
    example: Category.LIBRARY,
  })
  @IsEnum(Category)
  @IsOptional()
  readonly categoryFilter: Category;
}
