import { ROLE } from 'src/helpers/role.enum';

export interface JwtPayload {
  email: string;
  role: ROLE;
}
