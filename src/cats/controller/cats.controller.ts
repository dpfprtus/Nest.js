import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from '../service/cats.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatRequestDto } from '../dto/cats.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/common/decoraters/user.decorator';
import { Cat } from '../cats.schema';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly CatsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard) //인증처리
  @Get()
  getCurrentCat(@CurrentUser() cat: Cat) {
    //커스텀 데코레이터 사용, cat === req.user
    return cat.readOnlyData;
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.CatsService.getAllCat();
  }

  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.CatsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout() {
    return 'logout';
  }
  @ApiOperation({ summary: '이미지 업로드' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats'))) //인터셉터를 이용한 파일업로드, 인자로 프론트에서 설정한 키가 와야함
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() cat: Cat,
  ) {
    console.log(files);
    // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
    return this.CatsService.uploadImg(cat, files);
  }
}
