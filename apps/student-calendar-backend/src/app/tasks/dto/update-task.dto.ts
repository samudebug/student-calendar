import {  IsOptional, IsString, MaxLength, MinDate } from "class-validator";
import { startOfDay } from "date-fns";
import { Transform } from 'class-transformer';


export class UpdateTaskDTO {
  @IsOptional()
  @MaxLength(200, { message: 'Name length cannot exceed 200 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a valid string' })
  @MaxLength(200, { message: 'Notes length cannot exceed 200 characters' })
  notes?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))

  @MinDate(startOfDay(new Date()), { message: 'Day cannot be before today' })
  deliverDate?: Date;
}
