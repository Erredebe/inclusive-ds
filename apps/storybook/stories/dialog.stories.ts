import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Dialog',
  parameters: {
    docs: {
      description: {
        component:
          'Componente basado en `<dialog>` nativo con modos modal, drawer, list y alert. Incluye metodos imperativos `show`, `showModal` y `close`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Modal: Story = {
  render: () => `
    <iv-dialog mode="modal" open aria-labelledby="dialog-modal-title">
      <h3 slot="title" id="dialog-modal-title" style="margin: 0;">Editar perfil</h3>
      <p style="margin: 0;">Este dialog usa internamente <code>showModal()</code> del elemento nativo.</p>
      <div slot="actions" style="display:flex; gap:8px; justify-content:flex-end; width:100%;">
        <iv-button variant="ghost">Cancelar</iv-button>
        <iv-button>Guardar</iv-button>
      </div>
    </iv-dialog>
  `,
};

export const Drawer: Story = {
  render: () => `
    <iv-dialog mode="drawer" placement="right" open aria-labelledby="drawer-title">
      <h3 slot="title" id="drawer-title" style="margin: 0;">Filtros</h3>
      <p style="margin: 0;">Drawer lateral usando posicionamiento de dialog nativo.</p>
      <iv-input version="v2" label="Buscar" placeholder="Nombre"></iv-input>
    </iv-dialog>
  `,
};

export const ListAnchored: Story = {
  render: () => `
    <div style="display:grid; gap:8px; min-width: 360px;">
      <iv-input id="search-anchor" version="v2" label="Buscar pais" placeholder="Escribe para sugerir"></iv-input>
      <iv-dialog mode="list" anchor="#search-anchor" open>
        <ul style="list-style:none; padding:0; margin:0; display:grid; gap:4px;">
          <li><button type="button" style="width:100%; text-align:left;">Argentina</button></li>
          <li><button type="button" style="width:100%; text-align:left;">Chile</button></li>
          <li><button type="button" style="width:100%; text-align:left;">Uruguay</button></li>
        </ul>
      </iv-dialog>
    </div>
  `,
};

export const Alert: Story = {
  render: () => `
    <iv-dialog mode="alert" open label="Confirmacion critica">
      <h3 slot="title" style="margin:0;">Eliminar cuenta</h3>
      <p style="margin:0;">Esta accion no se puede deshacer.</p>
      <div slot="actions" style="display:flex; gap:8px; justify-content:flex-end; width:100%;">
        <iv-button variant="ghost">Cancelar</iv-button>
        <iv-button version="v2" appearance="danger">Eliminar</iv-button>
      </div>
    </iv-dialog>
  `,
};
