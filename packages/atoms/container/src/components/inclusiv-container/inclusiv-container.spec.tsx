import { newSpecPage } from '@stencil/core/testing';
import { InclusivContainer } from './inclusiv-container';

describe('iv-container', () => {
  it('renders with default slot', async () => {
    const page = await newSpecPage({
      components: [InclusivContainer],
      html: '<iv-container><span>Hola</span></iv-container>',
    });

    expect(page.root).toEqualHtml(`
      <iv-container>
        <mock:shadow-root>
          <div class="container container--direction-column container--align-stretch container--justify-start" style="--container-gap: 12px; --container-padding: 16px;">
            <slot></slot>
          </div>
        </mock:shadow-root>
        <span>Hola</span>
      </iv-container>
    `);
  });

  it('renders with flex props', async () => {
    const page = await newSpecPage({
      components: [InclusivContainer],
      html: '<iv-container direction="row" align="center" justify="between" wrap gap="8" padding="10"></iv-container>',
    });

    expect(page.root).toEqualHtml(`
      <iv-container align="center" direction="row" gap="8" justify="between" padding="10" wrap="">
        <mock:shadow-root>
          <div class="container container--direction-row container--align-center container--justify-between container--wrap" style="--container-gap: 8px; --container-padding: 10px;">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </iv-container>
    `);
  });
});
