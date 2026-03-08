import { newSpecPage } from '@stencil/core/testing';

import { InclusivButton } from './inclusiv-button';

describe('iv-button', () => {
  it('renders v1 by default', async () => {
    const page = await newSpecPage({
      components: [InclusivButton],
      html: '<iv-button>Guardar</iv-button>',
    });

    expect(page.root).toEqualHtml(`
      <iv-button>
        <mock:shadow-root>
          <button class="button button-v1 button-v1--primary">
            <slot></slot>
          </button>
        </mock:shadow-root>
        Guardar
      </iv-button>
    `);
  });

  it('renders v2 when version is set', async () => {
    const page = await newSpecPage({
      components: [InclusivButton],
      html: '<iv-button version="v2" appearance="danger" size="lg">Eliminar</iv-button>',
    });

    expect(page.root).toEqualHtml(`
      <iv-button appearance="danger" size="lg" version="v2">
        <mock:shadow-root>
          <button class="button button-v2 button-v2--danger button-v2--lg">
            <slot></slot>
          </button>
        </mock:shadow-root>
        Eliminar
      </iv-button>
    `);
  });
});
