import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Textarea',
  parameters: {
    docs: {
      description: {
        component:
          'Control multilínea para flujos de texto largo con contrato de eventos unificado (`ivInput` + `ivChange`).',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const V1Basic: Story = {
  render: () => '<iv-textarea placeholder="Descripcion breve"></iv-textarea>',
};

export const V2Default: Story = {
  render: () =>
    '<iv-textarea version="v2" label="Descripcion" placeholder="Escribe una descripcion" helper-text="Minimo 20 caracteres" rows="4"></iv-textarea>',
};

export const V2Error: Story = {
  render: () =>
    '<iv-textarea version="v2" label="Comentarios" placeholder="Describe el problema" helper-text="Este campo es obligatorio" state="error" rows="4"></iv-textarea>',
};

export const V2ClearableCounter: Story = {
  render: () =>
    '<iv-textarea version="v2" label="Bio" value="Me gusta construir productos inclusivos." clearable max-length="120" helper-text="Maximo 120 caracteres" rows="5"></iv-textarea>',
};

export const CallbackSimple: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '10px';
    wrap.style.minWidth = '340px';

    const textarea = document.createElement('iv-textarea');
    textarea.setAttribute('version', 'v2');
    textarea.setAttribute('label', 'Resumen');
    textarea.setAttribute('rows', '4');
    textarea.setAttribute('placeholder', 'Escribe aqui');

    const output = document.createElement('iv-text');
    output.textContent = 'Caracteres: 0';

    textarea.addEventListener('ivInput', (event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      output.textContent = `Caracteres: ${detail.value.length}`;
    });

    wrap.append(textarea, output);
    return wrap;
  },
};
