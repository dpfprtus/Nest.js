import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from '../dto/cats.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from '../cats.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from '../cats.repository';
import { ReadOnlyCatDto } from './../dto/cat.dto';

@Injectable() //provider로써 의존성 주입을 할수있따
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existsByEmail(email);
    if (isCatExist) {
      throw new UnauthorizedException('해당 고양이는 이미 존재합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    return cat.readOnlyData;
  }

  async getAllCat() {
    const allCat = await this.catsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    return readOnlyCats;
  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;
    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }
}
