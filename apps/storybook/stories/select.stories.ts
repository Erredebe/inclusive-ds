import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Select',
  parameters: {
    docs: {
      description: {
        component:
          'Selector single-choice con API alineada a formularios (`value`, `name`, `required`, `invalid`) y evento `ivChange`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const V1Basic: Story = {
  render: () => `
    <iv-select>
      <option value="">Selecciona un pais</option>
      <option value="ar">Argentina</option>
      <option value="cl">Chile</option>
      <option value="uy">Uruguay</option>
    </iv-select>
  `,
};

export const V2Default: Story = {
  render: () => `
    <iv-select version="v2" label="Pais" helper-text="Selecciona una opcion" value="ar">
      <option value="">Selecciona un pais</option>
      <option value="ar">Argentina</option>
      <option value="cl">Chile</option>
      <option value="uy">Uruguay</option>
    </iv-select>
  `,
};

export const V2Error: Story = {
  render: () => `
    <iv-select version="v2" label="Pais" helper-text="Debes seleccionar una opcion" state="error">
      <option value="">Selecciona un pais</option>
      <option value="ar">Argentina</option>
      <option value="cl">Chile</option>
      <option value="uy">Uruguay</option>
    </iv-select>
  `,
};

export const CallbackSimple: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '10px';
    wrap.style.minWidth = '320px';

    const select = document.createElement('iv-select');
    select.setAttribute('version', 'v2');
    select.setAttribute('label', 'Pais');
    select.setAttribute('helper-text', 'Selecciona para disparar callback');

    const options = [
      { value: '', label: 'Selecciona un pais' },
      { value: 'ar', label: 'Argentina' },
      { value: 'cl', label: 'Chile' },
      { value: 'uy', label: 'Uruguay' },
    ];

    options.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });

    const output = document.createElement('iv-text');
    output.textContent = 'Seleccion actual: -';

    select.addEventListener('ivChange', (event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      output.textContent = `Seleccion actual: ${detail.value || '-'}`;
    });

    wrap.append(select, output);
    return wrap;
  },
};
