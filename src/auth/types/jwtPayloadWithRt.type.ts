import { Payload } from './payload.interface';

export type JwtPayloadWithRt = Payload & { refreshToken: string };
