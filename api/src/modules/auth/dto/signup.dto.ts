import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: string;

  @IsString({ message: 'Telefone precisa ser um texto' })
  @IsNotEmpty({ message: 'Telefone não pode ser nulo' })
  @MinLength(10)
  phone: string;

  role: string;

  @IsString({ message: 'Senha precisa ser um texto' })
  @IsNotEmpty({ message: 'Senha não pode ser nulo' })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número',
  })
  password: string;

  @IsString({ message: 'Confirmação de senha precisa ser um texto' })
  @IsNotEmpty({ message: 'Confirmação de senha não pode ser nulo' })
  @MinLength(8)
  confirmPassword: string;
}
