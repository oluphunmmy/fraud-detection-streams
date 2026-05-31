import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeoDto {
  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}

export class TransactionDto {
  @IsString()
  transactionId!: string;

  @IsString()
  userId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsDateString()
  timestamp!: string;

  @IsString()
  merchant!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoDto)
  geo?: GeoDto;
}
