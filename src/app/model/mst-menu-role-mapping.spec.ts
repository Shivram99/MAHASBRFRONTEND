import { MstMenuRoleMapping } from './mst-menu-role-mapping';
import { Role } from './user';

describe('MstMenuRoleMapping', () => {
  it('should create an instance', () => {
    const role = new Role();
    role.id = 1;
    role.name = 'ROLE_ADMIN';

    const mapping: MstMenuRoleMapping = {
      menuMapID: 1,
      isActive: 'Y',
      menuId: 1,
      roleId: 1,
      menu: {
        menuNameEnglish: 'Dashboard',
        menuNameMarathi: 'Dashboard',
        isActive: 'Y'
      },
      role
    };

    expect(mapping).toBeTruthy();
  });
});
