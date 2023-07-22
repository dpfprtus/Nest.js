import { Cat } from '../cats.schema';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class ReadOnlyCatDto extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '32612',
    description: 'id',
  })
  id: string;
}
