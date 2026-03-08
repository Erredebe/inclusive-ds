import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Feedback/Toast',
  parameters: {
    docs: {
      description: {
        component:
          'Notificaciones efimeras para feedback rapido. Incluye API imperativa (`show`, `dismiss`) y autocierre por duracion.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const BasicOpen: Story = {
  render: () =>
    '<iv-toast open title="Guardado" message="Los cambios fueron aplicados." appearance="success"></iv-toast>',
};

export const Warning: Story = {
  render: () =>
    '<iv-toast open title="Conexion inestable" message="Intentaremos reconectar automaticamente." appearance="warning" duration="0"></iv-toast>',
};

export const ErrorClosable: Story = {
  render: () =>
    '<iv-toast open title="Error de red" message="Vuelve a intentarlo en unos segundos." appearance="error"></iv-toast>',
};
