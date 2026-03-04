import { IsInt, IsOptional, Max, Min } from 'class-validator';

// For each period: positive int = upsert, null = delete, missing = no change.
// @IsOptional() in class-validator skips further validators when value is null or undefined,
// so null passes through and gets handled as "delete" in the service.
export class UpsertTargetsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440) // 24h
  day?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10080) // 7 days
  week?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(44640) // 31 days
  month?: number | null;
}
