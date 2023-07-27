import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { SchemaOptions, Document, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @ApiProperty({
    description: '작성한 고양이 id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId, //나중에 몽고디비에서 id값을 스트링으로 만들어준다.
    required: true,
    ref: 'cats', //cat.schema 의 class Cat에 대해서 몽고디비가 자동으로 cats 컬렉션을 생성한 것을 참조한다. option에서 따로 컬렉션이름을 설정해줄 수 도 있다.
  })
  @IsNotEmpty()
  author: Types.ObjectId;

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
    description: '댓글 컨텐츠',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  contents: string;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsPositive() //좋아요 갯수는 음수가 될 수 없다.
  likeCount: number;

  @ApiProperty({
    description: '작성 대상(게시물,정보글)',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'cats',
  })
  @IsNotEmpty()
  info: Types.ObjectId; //댓글을 누구한테 썻는지
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
