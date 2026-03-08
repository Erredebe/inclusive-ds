import { newSpecPage } from '@stencil/core/testing';

import { InclusivRadioGroup } from './inclusiv-radio-group';

describe('iv-radio-group', () => {
  it('renders fieldset with legend', async () => {
    const page = await newSpecPage({
      components: [InclusivRadioGroup],
      html: '<iv-radio-group label="Tamano"></iv-radio-group>',
    });

    expect(page.root).toEqualHtml(`
      <iv-radio-group label="Tamano">
        <mock:shadow-root>
          <fieldset class="radio-group">
            <legend class="radio-group__label">Tamano</legend>
            <slot></slot>
          </fieldset>
        </mock:shadow-root>
      </iv-radio-group>
    `);
  });

  it('sets group name on child radios without explicit name', async () => {
    const page = await newSpecPage({
      components: [InclusivRadioGroup],
      html: '<iv-radio-group name="plan"><iv-radio value="free"></iv-radio></iv-radio-group>',
    });

    await page.waitForChanges();
    const radio = page.root?.querySelector('iv-radio');
    expect(radio?.getAttribute('name')).toBe('plan');
  });
});
