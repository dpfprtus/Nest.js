import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from './../cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService, //auth.module에서 Jwtmodule을 import했기에 사용가능
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    //해당하는 email이 있는지 check
    const cat = await this.catsRepository.findCatByEmail(email);
    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    //password 검사
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );
    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, sub: cat.id };
    return {
      token: this.jwtService.sign(payload, { secret: 'secretKey' }), //token 생성
    };
  }
}
