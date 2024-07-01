import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request, RequestSchema } from './schemas/request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }])],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
