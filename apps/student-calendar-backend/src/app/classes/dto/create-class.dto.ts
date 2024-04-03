import { IsNotEmpty, MaxLength } from 'class-validator';
export class CreateClassDTO {
  @IsNotEmpty({message: 'Name cannot be empty'})
  @MaxLength(200, {message: 'Name length cannot exceed 200 characters'})
  name: string;


}
