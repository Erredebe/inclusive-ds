import { newSpecPage } from '@stencil/core/testing';

import { InclusivLabel } from './inclusiv-label';

describe('iv-label', () => {
  it('renders required state', async () => {
    const page = await newSpecPage({
      components: [InclusivLabel],
      html: '<iv-label required>Correo</iv-label>',
    });

    expect(page.root).toEqualHtml(`
      <iv-label required="">
        <mock:shadow-root>
          <label class="label label--required ">
            <slot></slot>
            <span class="label__required">*</span>
          </label>
        </mock:shadow-root>
        Correo
      </iv-label>
    `);
  });

  it('renders disabled class', async () => {
    const page = await newSpecPage({
      components: [InclusivLabel],
      html: '<iv-label disabled>Nombre</iv-label>',
    });

    const label = page.root?.shadowRoot?.querySelector('label');
    expect(label?.className).toContain('label--disabled');
  });
});
