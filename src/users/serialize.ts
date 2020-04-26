import { MongooseUser } from "./model";
import { User } from "./User";

export interface UserSerialized extends Omit<User, "password"> {}

export function serializeUser(user: MongooseUser): UserSerialized {
  return {
    id: user.id as string,
    email: user.email,
    verified: user.verified,
    settings: user.settings,
  };
}
