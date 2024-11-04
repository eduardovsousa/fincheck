import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UsePipes(new ValidationPipe())
  authenticate(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticate(authenticateDto);
  }
}
