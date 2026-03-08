import { newSpecPage } from '@stencil/core/testing';
import { InclusivToggle } from './inclusiv-toggle';

describe('iv-toggle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivToggle],
      html: '<iv-toggle label="Notificaciones"></iv-toggle>',
    });

    expect(page.root).toBeTruthy();
  });
});
