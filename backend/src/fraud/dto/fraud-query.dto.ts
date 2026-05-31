import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { FraudReason } from '../fraud.types';

export class FraudQueryDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsIn(['HIGH_FREQUENCY', 'DAILY_AMOUNT_LIMIT', 'LOCATION_JUMP'])
  reason?: FraudReason;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 100;
}
