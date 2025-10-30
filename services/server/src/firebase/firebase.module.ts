import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
