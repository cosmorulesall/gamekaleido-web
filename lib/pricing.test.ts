import { describe, it, expect } from 'vitest';
import { PRICING, type Edition } from './pricing';

describe('PRICING', () => {
  it('has digital edition at £40', () => {
    expect(PRICING.digital.price).toBe(40);
    expect(PRICING.digital.currency).toBe('GBP');
  });
  it('has physical edition at £150', () => {
    expect(PRICING.physical.price).toBe(150);
    expect(PRICING.physical.currency).toBe('GBP');
  });
  it('each edition has a name, description, and features list', () => {
    const editions: Edition[] = ['digital', 'physical'];
    for (const edition of editions) {
      expect(PRICING[edition].name).toBeTruthy();
      expect(PRICING[edition].description).toBeTruthy();
      expect(PRICING[edition].features.length).toBeGreaterThan(0);
    }
  });
});
