import { describe, expect, it } from 'vitest';

import { colors, spacing } from './index';

describe('tokens', () => {
  it('exports primary color', () => {
    expect(colors.primary).toBe('#0f766e');
  });

  it('exports base spacing', () => {
    expect(spacing.md).toBe('1rem');
  });
});
