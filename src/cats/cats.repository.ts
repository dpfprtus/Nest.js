import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Cat } from './cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import { Comments, CommentsSchema } from './../comments/comments.schema';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async findAll() {
    const CommentsModel = mongoose.model('comments', CommentsSchema);
    const result = await this.catModel
      .find()
      .populate('comments', CommentsModel); //다른 도큐먼트(comment)랑 연결해준다. join같은거임 -> 게시글에 댓글까지 가져온다.
    return result;
  }

  async findCatByIdWithoutPassword(
    catId: string | Types.ObjectId,
  ): Promise<Cat | null> {
    const cat = await this.catModel.findById(catId).select('-password'); //select를 사용해 여러 개의 필드 중에서 password필드를 제거
    return cat;
  }

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id); //ID로 현재 로그인된 고양이 정보 받음
    cat.imgUrl = `http://localhost:8000/media/${fileName}`; //받아온 고양이의 imgUrl을 바꾼다.
    const newCat = await cat.save(); //update된것을 db에 저장
    console.log(newCat);
    return newCat.readOnlyData; //virtual 필드만 반환
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const user = await this.catModel.findOne({ email });
    return user;
  }

  async existsByEmail(email: string): Promise<any> {
    const result = await this.catModel.exists({ email });
    return result;
  }
  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}
