import { MstMenu } from './mst-menu';

describe('MstMenu', () => {
  it('should create an instance', () => {
    const menu: MstMenu = {
      menuNameEnglish: 'Dashboard',
      menuNameMarathi: 'Dashboard',
      isActive: 'Y'
    };

    expect(menu).toBeTruthy();
  });
});
