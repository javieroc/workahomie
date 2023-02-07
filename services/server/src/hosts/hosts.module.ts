import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { Host, HostSchema } from './schemas/host.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Host.name, schema: HostSchema }]),
    CloudinaryModule,
  ],
  controllers: [HostsController],
  providers: [HostsService],
})
export class HostsModule {}
