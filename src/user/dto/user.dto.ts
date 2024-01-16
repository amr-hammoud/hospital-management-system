import { UserRole } from "@prisma/client";

export class CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
}

export class UpdateUserDto {}

export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
