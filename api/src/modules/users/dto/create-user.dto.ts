import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode ser um campo vazio' })
  name: string;

  @IsString({ message: 'E-mail precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode ser um campo vazio' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode ser um campo vazio' })
  @MinLength(8, { message: 'A senha deve conter pelo menos 8 caracteres' })
  password: string;
}
