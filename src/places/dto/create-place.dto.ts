export class CreatePlaceDto {
  name!: string;
  description!: string;
  category!: string;
  address!: string;
  services?: string[]; // string[] est temporaire
  status?: string;
}
