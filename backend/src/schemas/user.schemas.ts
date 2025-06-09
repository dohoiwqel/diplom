import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  surname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({required: true})
  alias: string;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);