import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Selection Controls',
};

export default meta;

type Story = StoryObj;

export const Checkbox: Story = {
  render: () => '<iv-checkbox label="Acepto terminos"></iv-checkbox>',
};

export const RadioGroup: Story = {
  render: () => `
    <iv-radio-group label="Tamano">
      <iv-radio name="size" value="s" label="Small"></iv-radio>
      <iv-radio name="size" value="m" label="Medium"></iv-radio>
      <iv-radio name="size" value="l" label="Large"></iv-radio>
    </iv-radio-group>
  `,
};

export const Toggle: Story = {
  render: () => '<iv-toggle label="Recibir notificaciones"></iv-toggle>',
};

export const FormField: Story = {
  render: () => `
    <iv-form-field label="Correo" helper-text="Usaremos este correo para contactarte" required>
      <iv-input version="v2" placeholder="tu@email.com"></iv-input>
    </iv-form-field>
  `,
};

export const CallbackComplex: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    wrap.style.minWidth = '360px';

    const checkbox = document.createElement('iv-checkbox');
    checkbox.setAttribute('label', 'Acepto terminos y condiciones');

    const toggle = document.createElement('iv-toggle');
    toggle.setAttribute('label', 'Recibir notificaciones por correo');

    const group = document.createElement('iv-radio-group');
    group.setAttribute('label', 'Prioridad');
    group.setAttribute('name', 'priority-story');

    const priorities = [
      { value: 'low', label: 'Baja' },
      { value: 'normal', label: 'Normal' },
      { value: 'high', label: 'Alta' },
    ];

    priorities.forEach((item) => {
      const radio = document.createElement('iv-radio');
      radio.setAttribute('name', 'priority-story');
      radio.setAttribute('value', item.value);
      radio.setAttribute('label', item.label);
      group.appendChild(radio);
    });

    const submit = document.createElement('iv-button');
    submit.setAttribute('version', 'v2');
    submit.textContent = 'Validar y guardar';

    const output = document.createElement('iv-text');
    output.textContent = 'Estado: pendiente';

    const state = {
      accepted: false,
      notifications: false,
      priority: '',
    };

    checkbox.addEventListener('ivChange', (event) => {
      state.accepted = (event as CustomEvent<{ value: boolean }>).detail.value;
    });

    toggle.addEventListener('ivChange', (event) => {
      state.notifications = (event as CustomEvent<{ value: boolean }>).detail.value;
    });

    group.querySelectorAll('iv-radio').forEach((radio) => {
      radio.addEventListener('ivChange', (event) => {
        state.priority = (event as CustomEvent<{ value: string }>).detail.value;
      });
    });

    submit.addEventListener('ivClick', () => {
      const hasErrors = !state.accepted || !state.priority;
      if (hasErrors) {
        output.textContent = 'Estado: faltan datos (aceptar terminos y elegir prioridad).';
        return;
      }

      output.textContent =
        'Estado: guardado. ' +
        `prioridad=${state.priority}, notificaciones=${state.notifications ? 'si' : 'no'}.`;
    });

    wrap.append(checkbox, toggle, group, submit, output);
    return wrap;
  },
};
