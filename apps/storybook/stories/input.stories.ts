import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Input',
  parameters: {
    docs: {
      description: {
        component:
          'Mismo tag (`iv-input`) con evolución por versión interna para facilitar migración gradual y documentación de API.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const V1Basic: Story = {
  render: () => '<iv-input placeholder="Tu correo"></iv-input>',
};

export const V2Default: Story = {
  render: () =>
    '<iv-input version="v2" label="Correo" placeholder="tu@email.com" helper-text="Obligatorio"></iv-input>',
};

export const V2Error: Story = {
  render: () =>
    '<iv-input version="v2" label="Correo" placeholder="tu@email.com" helper-text="Formato invalido" state="error"></iv-input>',
};

export const V2WithAffixes: Story = {
  render: () => `
    <iv-input version="v2" label="Monto" value="123" helper-text="Ingresa un valor valido">
      <span slot="prefix">$</span>
      <span slot="suffix">USD</span>
    </iv-input>
  `,
};

export const V2ClearableCounter: Story = {
  render: () =>
    '<iv-input version="v2" label="Usuario" value="inclusiv" clearable max-length="20" helper-text="Maximo 20 caracteres"></iv-input>',
};
