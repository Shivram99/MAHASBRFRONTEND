import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('admin', 'password', 'admin@example.com', '9999999999', 1)).toBeTruthy();
  });
});
