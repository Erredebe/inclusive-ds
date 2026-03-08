import { newSpecPage } from '@stencil/core/testing';
import { InclusivAlert } from './inclusiv-alert';

describe('iv-alert', () => {
  it('renders title and description', async () => {
    const page = await newSpecPage({
      components: [InclusivAlert],
      html: '<iv-alert title="Atencion" description="Mensaje"></iv-alert>',
    });

    expect(page.root?.shadowRoot?.querySelector('.alert__title')?.textContent).toBe('Atencion');
    expect(page.root?.shadowRoot?.querySelector('.alert__description')?.textContent).toBe(
      'Mensaje',
    );
  });

  it('dismisses when closable button is clicked', async () => {
    const page = await newSpecPage({
      components: [InclusivAlert],
      html: '<iv-alert closable></iv-alert>',
    });

    const spy = jest.fn();
    page.root?.addEventListener('ivClose', spy);

    const button = page.root?.shadowRoot?.querySelector('.alert__close') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(page.root?.open).toBe(false);
    expect(spy).toHaveBeenCalled();
  });
});
