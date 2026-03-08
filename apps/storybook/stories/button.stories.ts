import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component:
          'Mismo tag (`iv-button`) con dos contratos visuales. `version="v1"` mantiene API actual, `version="v2"` habilita la nueva API.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const V1Primary: Story = {
  render: () => '<iv-button variant="primary">Guardar</iv-button>',
};

export const V1Ghost: Story = {
  render: () => '<iv-button variant="ghost">Cancelar</iv-button>',
};

export const V2Solid: Story = {
  render: () => '<iv-button version="v2" appearance="solid" size="md">Continuar</iv-button>',
};

export const V2Danger: Story = {
  render: () => '<iv-button version="v2" appearance="danger" size="lg">Eliminar</iv-button>',
};

export const V2Tertiary: Story = {
  render: () => '<iv-button version="v2" appearance="tertiary">Mas tarde</iv-button>',
};

export const V2Link: Story = {
  render: () => '<iv-button version="v2" appearance="link">Ver detalle</iv-button>',
};

export const V2Loading: Story = {
  render: () => '<iv-button version="v2" loading>Guardando</iv-button>',
};

export const V2IconOnly: Story = {
  render: () => '<iv-button version="v2" icon-only aria-label="Cerrar">✕</iv-button>',
};

export const V2FullWidth: Story = {
  render: () =>
    '<div style="width:280px;"><iv-button version="v2" full-width>Continuar</iv-button></div>',
};
