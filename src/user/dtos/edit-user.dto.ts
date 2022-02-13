import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dtos/create-user.dto";


export class EditUserDto extends PartialType(CreateUserDto) {}