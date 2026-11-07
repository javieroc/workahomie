import { Body, Controller, Delete, HttpCode, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/authz/jwt.guard';
import { CurrentUserId } from 'src/authz/current-user-id.decorator';
import { FirebaseService } from './firebase.service';
import { FcmTokenDto } from './dto/fcm-token.dto';

@UseGuards(JwtGuard)
@Controller('fcm-tokens')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Put()
  async updateFcmToken(@CurrentUserId() userId: string, @Body() { token }: FcmTokenDto) {
    return this.firebaseService.updateFcmToken(userId, token);
  }

  /** Unregister a device token (e.g. on logout). */
  @Delete()
  @HttpCode(204)
  async removeFcmToken(@CurrentUserId() userId: string, @Body() { token }: FcmTokenDto) {
    await this.firebaseService.removeFcmToken(userId, token);
  }
}
