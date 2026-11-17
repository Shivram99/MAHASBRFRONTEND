import { MstSubMenu } from './mst-sub-menu';

describe('MstSubMenu', () => {
  it('should create an instance', () => {
    const subMenu: MstSubMenu = {
      subMenuId: 1,
      subMenuNameEnglish: 'Dashboard',
      controllerName: 'dashboard',
      linkName: 'detailsPage',
      subMenuNameMarathi: 'Dashboard',
      isActive: 'Y',
      menuId: 1,
      menu: {
        menuNameEnglish: 'Dashboard',
        menuNameMarathi: 'Dashboard',
        isActive: 'Y'
      }
    };

    expect(subMenu).toBeTruthy();
  });
});
