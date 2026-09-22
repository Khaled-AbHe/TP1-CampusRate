import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceDto } from './create-place.dto.js';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {}
