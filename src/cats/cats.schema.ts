import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SchemaOptions, Document } from 'mongoose';
import { Comments } from './../comments/comments.schema';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Cat extends Document {
  @ApiProperty({
    example: 'dpfprtus@gmail.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'meow',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '23810',
    description: 'password',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Prop() //default 값으로 초기 이미지 지정할 수 있다.
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
    Comments: Comments[];
  };

  readonly comments: Comments[];
}

const _CatSchema = SchemaFactory.createForClass(Cat);

//클라이언트에 보낼 데이터만 가상화해서 보내준다.(password 숨길라고)
_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

//comments virtual 필드
_CatSchema.virtual('comments', {
  ref: 'comments', //스키마 이름
  localField: '_id',
  foreignField: 'info', //외래 필드, 외래키같은거? info 기준으로 comments가져온다.
});

//populate: 다른 도큐먼트랑 이어주는 메소드, 그것을 위한 옵션 설정- object와 json으로 변환가능하다!
_CatSchema.set('toObject', { virtuals: true });
_CatSchema.set('toJSON', { virtuals: true });

export const CatSchema = _CatSchema;
