import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(96)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(96)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  @Matches(
    /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){2,}).{8,}$/,
    {
      message:
        'Password must contain at least 2 lowercase letters, 2 uppercase letters, 2 numbers and 2 special characters',
    },
  )
  password: string;
}
