import { newSpecPage } from '@stencil/core/testing';
import { InclusivDialog } from './inclusiv-dialog';

describe('iv-dialog', () => {
  it('renders with modal mode by default', async () => {
    const page = await newSpecPage({
      components: [InclusivDialog],
      html: '<iv-dialog></iv-dialog>',
    });

    const dialog = page.root?.shadowRoot?.querySelector('dialog');
    expect(dialog?.className).toContain('dialog--modal');
  });

  it('uses alertdialog role in alert mode', async () => {
    const page = await newSpecPage({
      components: [InclusivDialog],
      html: '<iv-dialog mode="alert"></iv-dialog>',
    });

    const dialog = page.root?.shadowRoot?.querySelector('dialog');
    expect(dialog?.getAttribute('role')).toBe('alertdialog');
  });

  it('exposes imperative show and close methods', async () => {
    const page = await newSpecPage({
      components: [InclusivDialog],
      html: '<iv-dialog></iv-dialog>',
    });

    await page.rootInstance.show();
    await page.waitForChanges();
    expect(page.root?.open).toBe(true);

    await page.rootInstance.close('done');
    await page.waitForChanges();
    expect(page.root?.open).toBe(false);
  });
});
