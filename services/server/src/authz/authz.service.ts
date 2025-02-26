import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UserInfoDto } from './dto/userinfo.dto';

@Injectable()
export class AuthzService {
  private auth0Domain = process.env.AUTH0_ISSUER_URL;

  constructor(private readonly httpService: HttpService) {}

  async getUserInfo(accessToken: string) {
    const response = await this.httpService.axiosRef.get<UserInfoDto>(
      `${this.auth0Domain}userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }
}
