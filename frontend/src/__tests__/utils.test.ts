import { describe, it, expect } from 'vitest';
import { cn, formatSats, truncateMiddle } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should override conflicting tailwind classes', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });
});

describe('formatSats utility', () => {
  it('should format small numbers correctly', () => {
    const result = formatSats(100);
    expect(result).toBe('100 sats');
  });

  it('should format thousands with k suffix', () => {
    const result = formatSats(1500);
    expect(result).toBe('1.5k sats');
  });

  it('should format millions with M suffix', () => {
    const result = formatSats(1000000);
    expect(result).toBe('1.00M sats');
  });

  it('should format BTC for large amounts', () => {
    const result = formatSats(100000000);
    expect(result).toBe('1.00000000 BTC');
  });

  it('should handle zero', () => {
    const result = formatSats(0);
    expect(result).toBe('0 sats');
  });
});

describe('truncateMiddle utility', () => {
  it('should truncate long strings', () => {
    const result = truncateMiddle('abcdefghijklmnopqrstuvwxyz', 4, 4);
    expect(result).toBe('abcd...wxyz');
  });

  it('should not truncate short strings', () => {
    const result = truncateMiddle('abcdefgh', 4, 4);
    expect(result).toBe('abcdefgh');
  });
});
