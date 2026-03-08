import { newSpecPage } from '@stencil/core/testing';
import { InclusivToast } from './inclusiv-toast';

describe('iv-toast', () => {
  it('renders when open is true', async () => {
    const page = await newSpecPage({
      components: [InclusivToast],
      html: '<iv-toast open title="Listo" message="Guardado correctamente"></iv-toast>',
    });

    expect(page.root?.shadowRoot?.querySelector('.toast')).toBeTruthy();
  });

  it('dismisses through close button', async () => {
    const page = await newSpecPage({
      components: [InclusivToast],
      html: '<iv-toast open></iv-toast>',
    });

    const spy = jest.fn();
    page.root?.addEventListener('ivOpenChange', spy);

    const button = page.root?.shadowRoot?.querySelector('.toast__close') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(page.root?.open).toBe(false);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { open: false, reason: 'dismiss' } }),
    );
  });
});
