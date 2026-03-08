import { newSpecPage } from '@stencil/core/testing';
import { InclusivBadge } from './inclusiv-badge';

describe('iv-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivBadge],
      html: '<iv-badge>Nuevo</iv-badge>',
    });

    expect(page.root).toBeTruthy();
  });
});
