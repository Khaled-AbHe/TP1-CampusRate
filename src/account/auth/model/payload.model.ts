import { UserType } from '../../user/enum/user-type.enum.js';

export class Payload {
  sub: string;
  username: string;
  role: UserType;
}
