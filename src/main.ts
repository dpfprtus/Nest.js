import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public')); //css,js 바인딩 -> __dirname(현재 디렉토리)에서 상위폴더로 가서 public폴더를 찾는다.
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //view 바인딩
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe()); //class-validator
  await app.listen(3000);
}
bootstrap();
