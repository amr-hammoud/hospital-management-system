import { User } from '@prisma/client';

export class Utils {
  RemovePassword(user: User) {
    const result = { ...user, password: undefined };
    return result;
  }

  RemoveToken(user: User) {
    const result = { ...user, token: undefined };
    return result;
  }

  RemovePassNToken(user: User) {
    const result = { ...user, password: undefined, token: undefined };
    return result;
  }
}
