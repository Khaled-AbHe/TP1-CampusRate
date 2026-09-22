import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @Matches(/^plc_01J[A-Z]{3}\d{3}$/)
  @IsNotEmpty()
  placeId!: string;

  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @IsString()
  @IsNotEmpty()
  comment!: string;
}
