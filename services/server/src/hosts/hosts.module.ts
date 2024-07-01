import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RequestsModule } from 'src/requests/requests.module';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { Host, HostSchema } from './schemas/host.schema';
import { SeedDataCommand } from './command/seed-data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Host.name, schema: HostSchema }]),
    CloudinaryModule,
    RequestsModule,
  ],
  controllers: [HostsController],
  providers: [HostsService, SeedDataCommand],
})
export class HostsModule {}
