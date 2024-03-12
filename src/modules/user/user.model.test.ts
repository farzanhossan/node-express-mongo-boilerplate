import { faker } from '@faker-js/faker';
import { NewCreatedUser } from './user.interfaces';
import User from './user.model';

describe('User model', () => {
  describe('User validation', () => {
    let newUser: NewCreatedUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 6 characters', async () => {
      newUser.password = '123';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if role is unknown', async () => {
      newUser.role = 'invalid';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });
});
