import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  private readonly logger = new Logger(SocketAuthGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    const token = client.handshake.auth?.token;
    if (!token) {
      this.logger.warn('No token provided in socket handshake');
      return false;
    }
    return true;

    // try {
    //   const decoded = this.jwtService.verify(token, {
    //     secret: this.configService.get<string>('JWT_SECRET'),
    //   });

    //   // Attach user info to the socket instance
    //   client.data.user = decoded;
    //   return true;
    // } catch (err) {
    //   this.logger.error(`Invalid socket token: ${err.message}`);
    //   return false;
    // }
  }
}
