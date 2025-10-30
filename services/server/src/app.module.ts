import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HostsModule } from './hosts/hosts.module';
import { AuthzModule } from './authz/authz.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RequestsModule } from './requests/requests.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ChatModule } from './chat/chat.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute in milliseconds
        limit: 60, // 60 requests
      },
    ]),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthzModule,
    HostsModule,
    CloudinaryModule,
    RequestsModule,
    ReviewsModule,
    ChatModule,
    WishlistsModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
