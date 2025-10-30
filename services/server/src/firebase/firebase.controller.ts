import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/authz/jwt.guard';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';
import { FirebaseService } from './firebase.service';

@Controller('fcm-tokens')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @UseGuards(JwtGuard)
  @Put()
  async updateFcmToken(@Req() req: RequestWithUser, @Body() body: { token: string }) {
    const userId = req.user.sub.split('|')[1];
    return this.firebaseService.updateFcmToken(userId, body.token);
  }
}
