import { IsOptional, IsString } from "class-validator";

export class UpdateClassDTO {
  @IsOptional()
  @IsString({message: "Inform a valid name"})
  name?: string;
}
