import { newSpecPage } from '@stencil/core/testing';
import { InclusivBadge } from './inclusiv-badge';

describe('iv-badge', () => {
  it('renders default variant', async () => {
    const page = await newSpecPage({
      components: [InclusivBadge],
      html: '<iv-badge>Nuevo</iv-badge>',
    });

    const badge = page.root?.shadowRoot?.querySelector('.badge');
    expect(badge?.className).toContain('badge--default');
  });

  it('renders custom variant class', async () => {
    const page = await newSpecPage({
      components: [InclusivBadge],
      html: '<iv-badge variant="success">Ok</iv-badge>',
    });

    const badge = page.root?.shadowRoot?.querySelector('.badge');
    expect(badge?.className).toContain('badge--success');
  });
});
