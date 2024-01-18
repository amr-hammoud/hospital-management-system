import { User } from '@prisma/client';

export class Utils {
  static RemovePassword(user: User) {
    const result = { ...user, password: undefined };
    return result;
  }

  static RemoveToken(user: User) {
    const result = { ...user, token: undefined };
    return result;
  }

  static RemovePassNToken(user: User) {
    const result = { ...user, password: undefined, token: undefined };
    return result;
  }
}
