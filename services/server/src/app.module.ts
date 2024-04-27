import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HostsModule } from './hosts/hosts.module';
import { AuthzModule } from './authz/authz.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SeedDataCommand } from './command/seed-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ),
    AuthzModule,
    HostsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedDataCommand],
})
export class AppModule {}
