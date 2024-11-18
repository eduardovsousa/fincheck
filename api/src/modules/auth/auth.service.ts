import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import * as mailgun from 'mailgun-js';
import { env } from 'src/shared/config/env';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { NewPasswordDto } from './dto/newPassword';
import { ResetPasswordDto } from './dto/resetPassword';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(authenticateDto: SigninDto) {
    const { email, password } = authenticateDto;

    const user = await this.userRepo.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválida');
    }

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    const {
      firstName,
      lastName,
      birthdate,
      phone,
      email,
      password,
      confirmPassword,
    } = signupDto;

    signupDto.role = 'user';

    const emailTaken = await this.userRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const phoneTaken = await this.userRepo.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (phoneTaken) {
      throw new ConflictException('Este telefone já está em uso.');
    }

    if (password !== confirmPassword) {
      throw new ConflictException('As senhas não coincidem');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.userRepo.create({
      data: {
        firstName,
        lastName,
        birthdate,
        phone,
        email,
        role: signupDto.role,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async sendMail({ recipient_email, otpCode }) {
    try {
      const findUserByEmail = await this.userRepo.findUnique({
        where: { email: recipient_email },
      });

      if (findUserByEmail) {
        await this.userRepo.update({
          where: { email: recipient_email },
          data: { otpCode },
        });

        const mg = mailgun({
          apiKey: env.mailgunToken,
          domain: env.mailgunDomain,
        });

        const data = {
          from: 'Código de Verificação <devevs@outlook.com.br>',
          to: recipient_email,
          subject: 'Reset de senha - fincheck',
          html: `<!doctype html>
            <html lang="pt-br">
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Resete de senha</title>
                <meta name="description" content="Reset de senha">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Código de verificação</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Segue o código de verificação para seguir com o processo de alteração de senha.<br/>Insira o código abaixo no navegador para continuar:</p>
            <span style="background:#1f3566;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;"> &nbsp; &nbsp;${otpCode} &nbsp; &nbsp;</span>
                                                  
                                                  <p style="color:#455056; font-size:15px;line-height:24px; margin-top:35px;font-style: italic;">Caso você não tenha solicitado, basta ignorar.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>fincheck &copy;</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
        };

        await mg.messages().send(data);
      } else {
        throw new NotFoundException('Usuário não encontrado');
      }
    } catch (error) {
      throw new BadRequestException('Erro ao enviar e-mail: ' + error);
    }

    setTimeout(async () => {
      await this.userRepo.update({
        where: { email: recipient_email },
        data: { otpCode: null },
      });
    }, 600000);
  }

  async verifyOTP(resetPassword: ResetPasswordDto): Promise<void> {
    const { recipient_email, otpCode } = resetPassword;

    const user = await this.userRepo.findUnique({
      where: { email: recipient_email },
    });

    if (!user) {
      throw new NotFoundException('Código não encontrado');
    }

    if (!user.otpCode) {
      throw new UnauthorizedException(
        'Limite de tentativas atingido ou código expirado. Tente novamente mais tarde',
      );
    }

    if (user.otpAttempts >= 2) {
      await this.userRepo.update({
        where: { email: recipient_email },
        data: { otpCode: null, otpAttempts: 0 },
      });
      throw new UnauthorizedException(
        'Limite de tentativas atingido ou código expirado. Tente novamente mais tarde',
      );
    }

    if (user.otpCode !== otpCode && user.otpCode !== null) {
      await this.userRepo.update({
        where: { email: recipient_email },
        data: { otpAttempts: user.otpAttempts + 1 },
      });

      throw new ConflictException(
        'Código incorreto. Verifique o código em seu e-mail',
      );
    }

    await this.userRepo.update({
      where: { email: recipient_email },
      data: { otpAttempts: 0, otpCode: null },
    });
  }

  async updatePass(newPassword: NewPasswordDto) {
    const email = newPassword.recipient_email;

    const newPass = newPassword.password;

    const hashedPassword = await hash(newPass, 12);

    if (newPassword.password !== newPassword.confirmPassword) {
      throw new ConflictException('As senhas devem ser iguais!');
    }

    try {
      await this.userRepo.update({
        where: { email: email },
        data: { password: hashedPassword },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}
