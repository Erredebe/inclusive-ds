import { newSpecPage } from '@stencil/core/testing';

import { InclusivHeading } from './inclusiv-heading';

describe('iv-heading', () => {
  it('renders h2 by default', async () => {
    const page = await newSpecPage({
      components: [InclusivHeading],
      html: '<iv-heading>Titulo</iv-heading>',
    });

    expect(page.root).toEqualHtml(`
      <iv-heading>
        <mock:shadow-root>
          <h2 class="heading heading--h2">
            <slot></slot>
          </h2>
        </mock:shadow-root>
        Titulo
      </iv-heading>
    `);
  });

  it('renders custom level', async () => {
    const page = await newSpecPage({
      components: [InclusivHeading],
      html: '<iv-heading level="h4">Subtitulo</iv-heading>',
    });

    const heading = page.root?.shadowRoot?.querySelector('h4');
    expect(heading?.className).toBe('heading heading--h4');
  });
});
