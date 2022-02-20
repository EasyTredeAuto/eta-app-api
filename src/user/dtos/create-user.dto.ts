import {
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { AppRoles } from 'src/app.roles'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string

  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: `mush be a valid role value, ${JSON.stringify(AppRoles)}`,
  })
  roles: AppRoles
}
