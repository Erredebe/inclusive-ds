import { newSpecPage } from '@stencil/core/testing';
import { InclusivTextarea } from './inclusiv-textarea';

describe('iv-textarea', () => {
  it('renders v1 by default', async () => {
    const page = await newSpecPage({
      components: [InclusivTextarea],
      html: '<iv-textarea placeholder="Descripcion"></iv-textarea>',
    });

    const textarea = page.root?.shadowRoot?.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea?.getAttribute('placeholder')).toBe('Descripcion');
  });

  it('renders v2 with label and helper text association', async () => {
    const page = await newSpecPage({
      components: [InclusivTextarea],
      html: '<iv-textarea version="v2" label="Mensaje" helper-text="Maximo 300"></iv-textarea>',
    });

    const label = page.root?.shadowRoot?.querySelector('.field__label');
    const helper = page.root?.shadowRoot?.querySelector('.field__helper');
    const textarea = page.root?.shadowRoot?.querySelector('.field__textarea');

    expect(label?.textContent).toBe('Mensaje');
    expect(helper?.textContent).toBe('Maximo 300');
    expect(textarea?.getAttribute('aria-describedby')).toContain('helper');
  });

  it('emits ivInput and ivChange', async () => {
    const page = await newSpecPage({
      components: [InclusivTextarea],
      html: '<iv-textarea version="v2" value="hola"></iv-textarea>',
    });

    const ivInputSpy = jest.fn();
    const ivChangeSpy = jest.fn();
    page.root?.addEventListener('ivInput', ivInputSpy);
    page.root?.addEventListener('ivChange', ivChangeSpy);

    const textarea = page.root?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'nuevo valor';
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(ivInputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: 'nuevo valor' } }),
    );
    expect(ivChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: 'nuevo valor' } }),
    );
  });

  it('clears value when clearable button is pressed', async () => {
    const page = await newSpecPage({
      components: [InclusivTextarea],
      html: '<iv-textarea version="v2" clearable value="texto"></iv-textarea>',
    });

    const clearBtn = page.root?.shadowRoot?.querySelector('.field__clear') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    clearBtn.click();
    await page.waitForChanges();

    expect(page.root?.value).toBe('');
  });
});
