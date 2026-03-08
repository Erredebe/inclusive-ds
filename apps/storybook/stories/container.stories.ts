import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Container',
  parameters: {
    docs: {
      description: {
        component:
          'Layout container con flex y slot default para componer bloques dentro del editor y del playground.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const RowWrap: Story = {
  render: () => `
    <iv-container direction="row" align="center" justify="between" gap="12" padding="14" wrap>
      <iv-badge>Resultados</iv-badge>
      <iv-input version="v2" label="Buscar" placeholder="Nombre"></iv-input>
      <iv-button version="v2" appearance="outline">Aplicar</iv-button>
    </iv-container>
  `,
};

export const Column: Story = {
  render: () => `
    <iv-container direction="column" align="stretch" gap="10" padding="16">
      <iv-heading level="h4">Perfil</iv-heading>
      <iv-input version="v2" label="Nombre" placeholder="Escribe tu nombre"></iv-input>
      <iv-input version="v2" label="Correo" placeholder="tu@email.com"></iv-input>
      <iv-button>Guardar</iv-button>
    </iv-container>
  `,
};
