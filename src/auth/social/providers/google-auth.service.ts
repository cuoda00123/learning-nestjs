import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../../config/jwt.config';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { UsersService } from '../../../users/providers/users.service';
import { GenerateTokenProvider } from '../../providers/generate-token.provider';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    //inject jwt configuration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // inject usersService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    //inject generate token provider
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    this.oauthClient = new OAuth2Client({
      clientId: this.jwtConfiguration.googleClientID,
      clientSecret: this.jwtConfiguration.googleClientSecret,
    });
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      //verify the google token sent by the user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // console.log(loginTicket);
      //Extract the payload from the google jwt
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload()!;
      //find the user in the database using the googleId
      const user = await this.usersService.findOneByGoogleId(googleId);
      //if googleId exists generate the token
      if (user) {
        return await this.generateTokenProvider.generateToken(user);
      }
      // if not, create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email: email!,
        firstName: firstName!,
        lastName: lastName!,
        googleId: googleId,
      });

      return this.generateTokenProvider.generateToken(newUser);
    } catch (error) {
      //throw unauthorised exception
      throw new UnauthorizedException('Something went wrong', {
        description: `Error in authenticating user, and error is ${error}`,
      });
    }
  }
}
