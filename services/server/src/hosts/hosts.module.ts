import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { Host, HostSchema } from './schemas/host.schema';
import { Place, PlaceSchema } from './schemas/place.schema';
import { SeedDataCommand } from './command/seed-data';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Host.name, schema: HostSchema },
      { name: Place.name, schema: PlaceSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [HostsController],
  providers: [HostsService, SeedDataCommand],
})
export class HostsModule {}
