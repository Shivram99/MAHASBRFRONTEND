import { District } from './district';

describe('District', () => {
  it('should create an instance without arguments', () => {
    const district = new District();
    expect(district).toBeTruthy();
    expect(district.name).toBeUndefined();
    expect(district.region).toBeUndefined();
  });
});
