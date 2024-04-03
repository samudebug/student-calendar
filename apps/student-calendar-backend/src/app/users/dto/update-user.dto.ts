import { IsOptional, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsOptional()
  @IsString({message: "Name must be a valid string"})
  name?: string;

  @IsOptional()
  @IsString({message: 'photoUrl must be a valid string'})
  photoUrl?: string;

  @IsOptional()
  @IsString({message: "FCM token must be a valid string"})
  fcmToken?: string;
}
