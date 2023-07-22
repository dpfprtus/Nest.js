import { PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

//Picktype을 통해 password를 제외한 원하는 객체들만 가져온다.
export class CatRequestDto extends PickType(Cat, [
  'email',
  'name',
  'password',
] as const) {}
