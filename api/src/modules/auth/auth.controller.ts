import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { AuthService } from './auth.service';
import { NewPasswordDto } from './dto/newPassword';
import { ResetPasswordDto } from './dto/resetPassword';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  create(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('send_recovery_email')
  async requestOtp(
    @Body() body: { recipient_email: string },
    @Res() res,
  ): Promise<any> {
    try {
      const otp = this.generateOtp();

      await this.authService.sendMail({
        recipient_email: body.recipient_email,
        otpCode: otp,
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'OTP enviado com sucesso' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  @Post('verify_otp')
  async verifyOTP(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.verifyOTP(resetPassword);
  }

  @Post('change_pass')
  async updatePass(@Body() newPassword: NewPasswordDto) {
    return this.authService.updatePass(newPassword);
  }

  private generateOtp(): number {
    return Math.floor(Math.random() * 9000 + 100000);
  }
}
