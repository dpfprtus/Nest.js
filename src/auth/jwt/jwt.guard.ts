import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//AuthGuard('jwt')를 상속 -> strategy.ts를 자동으로 실행하는 기능 내제, strategy안의 validate함수 실행
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
