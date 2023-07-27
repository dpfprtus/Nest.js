import { Module, forwardRef } from '@nestjs/common';
import { CatsController } from './controller/cats.controller';
import { CatsService } from './service/cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './cats.schema';
import { CatsRepository } from './cats.repository';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { Comments, CommentsSchema } from 'src/comments/comments.schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema }, //Cat안에서 comment를 사용하기 때문에 추가
      { name: Cat.name, schema: CatSchema },
    ]),
    forwardRef(() => AuthModule),
  ],

  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
