import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PaginationDto } from './pagination.dto.js';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PaginationDto })
  readonly pagination: PaginationDto;

  constructor(data: T[], pagination: PaginationDto) {
    this.data = data;
    this.pagination = pagination;
  }
}
