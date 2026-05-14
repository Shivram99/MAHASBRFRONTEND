import { TitleCaseSafePipe } from './title-case-safe.pipe';

describe('TitleCaseSafePipe', () => {
  const pipe = new TitleCaseSafePipe();

  it('formats uppercase text to title case', () => {
    expect(pipe.transform('GLOBAL HOSPITAL AND RESEARCH CENTRE')).toBe('Global Hospital And Research Centre');
  });

  it('keeps numeric values unchanged', () => {
    expect(pipe.transform(12345)).toBe(12345);
    expect(pipe.transform('12345')).toBe('12345');
  });

  it('handles nullish and empty values safely', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('   ')).toBe('');
  });
});
