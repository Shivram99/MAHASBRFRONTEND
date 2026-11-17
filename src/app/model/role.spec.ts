import { Role } from './role';

describe('Role', () => {
  it('should create an instance', () => {
    const role: Role = {
      id: 1,
      name: 'ROLE_ADMIN'
    };

    expect(role).toBeTruthy();
  });
});
