import { UserRole } from '@prisma/client';

export class CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
}

export class UpdateUserDto {}

export class LoginUserResponseDto {
  user: {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    profileID?: number;
    departmentID?: number;
  }
  token: string;
}

export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
