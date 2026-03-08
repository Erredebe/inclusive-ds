import { describe, expect, it } from 'vitest';

import { breakpoints, colors, motion, shadows, spacing, zIndex } from './index';

describe('tokens', () => {
  it('exports primary color', () => {
    expect(colors.primary).toBe('#0f766e');
  });

  it('exports base spacing', () => {
    expect(spacing.md).toBe('1rem');
  });

  it('exports foundation shadows', () => {
    expect(shadows.md).toContain('0 8px 20px');
  });

  it('exports motion tokens', () => {
    expect(motion.durationFast).toBe('120ms');
  });

  it('exports z-index layers and breakpoints', () => {
    expect(zIndex.modal).toBe(1100);
    expect(breakpoints.lg).toBe('64rem');
  });
});
