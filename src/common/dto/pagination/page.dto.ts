import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageDataDto } from './page-data.dto.js';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageDataDto })
  readonly meta: PageDataDto;

  constructor(data: T[], meta: PageDataDto) {
    this.data = data;
    this.meta = meta;
  }
}
