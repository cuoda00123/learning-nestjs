/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from '../../mail/providers/mail.service';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;
  let usersRepository: MockRepository<User>;

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: '7bNlI@example.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: MailService,
          useValue: {
            sendWelcomeMail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn().mockResolvedValue(user.password),
          },
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);

    usersRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createUser', () => {
    describe('when the user does not exist in the db', () => {
      it('should create a new user', async () => {
        usersRepository.findOne!.mockResolvedValue(null);
        usersRepository.create!.mockReturnValue(user);
        usersRepository.save!.mockResolvedValue(user);

        const newUser = await provider.createUser(user);

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: user.email,
          },
        });

        expect(usersRepository.create).toHaveBeenCalledWith({
          ...user,
          password: user.password,
        });

        expect(usersRepository.save).toHaveBeenCalledWith(user);
        expect(newUser).toEqual(user);
      });
    });

    describe('when the user already exists in the db', () => {
      it('should throw BadRequestException', async () => {
        usersRepository.findOne!.mockResolvedValue(user);

        await expect(provider.createUser(user)).rejects.toBeInstanceOf(BadRequestException);

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: user.email,
          },
        });
      });
    });
  });
});
