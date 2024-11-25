import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
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
  @IsString()
  birthdate: string;

  @IsString({ message: 'Telefone precisa ser um texto' })
  @IsNotEmpty({ message: 'Telefone não pode ser nulo' })
  @MinLength(10)
  phone: string;
}
