import { IsNotEmpty, IsString, MaxLength, MinDate,  } from "class-validator";
import { startOfDay } from "date-fns";
import { Transform } from 'class-transformer';

export class CreateTaskDTO {
  @IsNotEmpty({message: 'Name cannot be empty'})
  @MaxLength(200, { message: 'Name length cannot exceed 200 characters' })
  name: string;
  @IsString({message: 'Notes must be a valid string'})
  @MaxLength(200, {message: 'Notes length cannot exceed 200 characters'})
  notes: string;

  @Transform(({ value }) => new Date(value))
  @MinDate(startOfDay(new Date()), {message: 'Day cannot be before today'})
  deliverDate: Date;
}
