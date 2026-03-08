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

  it('sets aria-busy and disables button while loading', async () => {
    const page = await newSpecPage({
      components: [InclusivButton],
      html: '<iv-button version="v2" loading>Guardando</iv-button>',
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  it('sets aria-label in icon-only mode', async () => {
    const page = await newSpecPage({
      components: [InclusivButton],
      html: '<iv-button version="v2" icon-only aria-label="Cerrar">✕</iv-button>',
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Cerrar');
  });

  it('emits ivClick on button press', async () => {
    const page = await newSpecPage({
      components: [InclusivButton],
      html: '<iv-button version="v2">Continuar</iv-button>',
    });

    const spy = jest.fn();
    page.root?.addEventListener('ivClick', spy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: { version: 'v2' } }));
  });

  it('does not emit ivClick when disabled by loading', async () => {
    const page = await newSpecPage({
      components: [InclusivButton],
      html: '<iv-button version="v2" loading>Guardando</iv-button>',
    });

    const spy = jest.fn();
    page.root?.addEventListener('ivClick', spy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
