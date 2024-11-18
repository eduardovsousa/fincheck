import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsString({ message: 'E-mail precisa ser um texto' })
  @IsNotEmpty({ message: 'E-mail não pode ser nulo' })
  @IsEmail()
  recipient_email: string;

  @IsString({ message: 'Senha não pode ser nula' })
  @IsNotEmpty({ message: 'Senha não pode ser nula' })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número',
  })
  password: string;
  
  @IsString({ message: 'Confirmação de senha não pode ser nula' })
  @IsNotEmpty({ message: 'Confirmação de senha não pode ser nula' })
  @MinLength(8)
  confirmPassword: string;
}
