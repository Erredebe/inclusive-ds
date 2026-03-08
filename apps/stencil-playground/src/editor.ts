import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElement as defineIvButton } from '@inclusiv-ds/button/components/iv-button';
import { defineCustomElement as defineIvInput } from '@inclusiv-ds/input/components/iv-input';
import { defineCustomElement as defineIvBadge } from '@inclusiv-ds/badge/components/iv-badge';
import { defineCustomElement as defineIvSpinner } from '@inclusiv-ds/spinner/components/iv-spinner';
import { defineCustomElement as defineIvText } from '@inclusiv-ds/typography/components/iv-text';
import { defineCustomElement as defineIvLabel } from '@inclusiv-ds/typography/components/iv-label';
import { defineCustomElement as defineIvHeading } from '@inclusiv-ds/typography/components/iv-heading';
import { defineCustomElement as defineIvCheckbox } from '@inclusiv-ds/checkbox/components/iv-checkbox';
import { defineCustomElement as defineIvRadio } from '@inclusiv-ds/radio/components/iv-radio';
import { defineCustomElement as defineIvRadioGroup } from '@inclusiv-ds/radio/components/iv-radio-group';
import { defineCustomElement as defineIvToggle } from '@inclusiv-ds/toggle/components/iv-toggle';
import { defineCustomElement as defineIvFormField } from '@inclusiv-ds/form-field/components/iv-form-field';
import { defineCustomElement as defineIvDialog } from '@inclusiv-ds/dialog/components/iv-dialog';

type DsComponent =
  | 'iv-heading'
  | 'iv-text'
  | 'iv-button'
  | 'iv-input'
  | 'iv-badge'
  | 'iv-spinner'
  | 'iv-checkbox'
  | 'iv-radio-group'
  | 'iv-toggle'
  | 'iv-form-field'
  | 'iv-dialog';

const STORAGE_KEY = 'ids-editor-layout-v1';

if (!customElements.get('iv-button')) defineIvButton();
if (!customElements.get('iv-input')) defineIvInput();
if (!customElements.get('iv-badge')) defineIvBadge();
if (!customElements.get('iv-spinner')) defineIvSpinner();
if (!customElements.get('iv-text')) defineIvText();
if (!customElements.get('iv-label')) defineIvLabel();
if (!customElements.get('iv-heading')) defineIvHeading();
if (!customElements.get('iv-checkbox')) defineIvCheckbox();
if (!customElements.get('iv-radio')) defineIvRadio();
if (!customElements.get('iv-radio-group')) defineIvRadioGroup();
if (!customElements.get('iv-toggle')) defineIvToggle();
if (!customElements.get('iv-form-field')) defineIvFormField();
if (!customElements.get('iv-dialog')) defineIvDialog();

const palette = document.getElementById('palette');
const canvas = document.getElementById('drop-canvas');
const clearButton = document.getElementById('clear-canvas') as HTMLButtonElement | null;

if (!palette || !canvas) {
  throw new Error('Editor DOM no encontrado');
}

let layoutState: DsComponent[] = loadState();
renderCanvas(canvas, layoutState);

palette.querySelectorAll<HTMLElement>('.palette-item').forEach((item) => {
  item.addEventListener('dragstart', (event: DragEvent) => {
    const component = item.dataset.component as DsComponent | undefined;
    if (!component || !event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', component);
    event.dataTransfer.effectAllowed = 'copy';
  });
});

canvas.addEventListener('dragover', (event: DragEvent) => {
  event.preventDefault();
  canvas.classList.add('canvas--active');
});

canvas.addEventListener('dragleave', () => {
  canvas.classList.remove('canvas--active');
});

canvas.addEventListener('drop', (event: DragEvent) => {
  event.preventDefault();
  canvas.classList.remove('canvas--active');

  const component = event.dataTransfer?.getData('text/plain') as DsComponent | '';
  if (!component) return;

  layoutState = [...layoutState, component];
  saveState(layoutState);
  renderCanvas(canvas, layoutState);
});

clearButton?.addEventListener('click', () => {
  layoutState = [];
  saveState(layoutState);
  renderCanvas(canvas, layoutState);
});

function renderCanvas(target: HTMLElement, components: DsComponent[]) {
  target.innerHTML = '';

  if (components.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'canvas__empty';
    empty.textContent = 'Suelta aqui los componentes para empezar.';
    target.appendChild(empty);
    return;
  }

  components.forEach((component) => {
    const slot = document.createElement('div');
    slot.className = 'canvas-item';
    slot.appendChild(createComponentElement(component));
    target.appendChild(slot);
  });
}

function createComponentElement(component: DsComponent): HTMLElement {
  switch (component) {
    case 'iv-heading': {
      const el = document.createElement('iv-heading');
      el.setAttribute('level', 'h3');
      el.textContent = 'Titulo editable';
      return el;
    }
    case 'iv-text': {
      const el = document.createElement('iv-text');
      el.setAttribute('variant', 'body');
      el.textContent = 'Texto de ejemplo en el editor.';
      return el;
    }
    case 'iv-button': {
      const el = document.createElement('iv-button');
      el.setAttribute('version', 'v2');
      el.setAttribute('appearance', 'solid');
      el.textContent = 'Accion';
      return el;
    }
    case 'iv-input': {
      const el = document.createElement('iv-input');
      el.setAttribute('version', 'v2');
      el.setAttribute('label', 'Campo');
      el.setAttribute('placeholder', 'Escribe aqui');
      return el;
    }
    case 'iv-badge': {
      const el = document.createElement('iv-badge');
      el.setAttribute('variant', 'info');
      el.textContent = 'Nuevo';
      return el;
    }
    case 'iv-spinner': {
      const el = document.createElement('iv-spinner');
      el.setAttribute('size', 'md');
      return el;
    }
    case 'iv-checkbox': {
      const el = document.createElement('iv-checkbox');
      el.setAttribute('label', 'Acepto terminos');
      return el;
    }
    case 'iv-radio-group': {
      const group = document.createElement('iv-radio-group');
      group.setAttribute('label', 'Selecciona una opcion');

      const radioA = document.createElement('iv-radio');
      radioA.setAttribute('name', 'editor-radio');
      radioA.setAttribute('value', 'a');
      radioA.setAttribute('label', 'Opcion A');

      const radioB = document.createElement('iv-radio');
      radioB.setAttribute('name', 'editor-radio');
      radioB.setAttribute('value', 'b');
      radioB.setAttribute('label', 'Opcion B');

      group.append(radioA, radioB);
      return group;
    }
    case 'iv-toggle': {
      const el = document.createElement('iv-toggle');
      el.setAttribute('label', 'Activar opcion');
      return el;
    }
    case 'iv-form-field': {
      const field = document.createElement('iv-form-field');
      field.setAttribute('label', 'Correo');
      field.setAttribute('helper-text', 'Usaremos este correo para contactarte');

      const input = document.createElement('iv-input');
      input.setAttribute('version', 'v2');
      input.setAttribute('placeholder', 'tu@email.com');
      field.appendChild(input);

      return field;
    }
    case 'iv-dialog': {
      const dialog = document.createElement('iv-dialog');
      dialog.setAttribute('mode', 'modal');
      dialog.setAttribute('open', '');

      const title = document.createElement('h3');
      title.setAttribute('slot', 'title');
      title.textContent = 'Dialog del editor';

      const content = document.createElement('p');
      content.textContent = 'Contenido de ejemplo dentro de iv-dialog.';

      dialog.append(title, content);
      return dialog;
    }
    default: {
      const fallback = document.createElement('div');
      fallback.textContent = component;
      return fallback;
    }
  }
}

function saveState(components: DsComponent[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
}

function loadState(): DsComponent[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDsComponent);
  } catch {
    return [];
  }
}

function isDsComponent(value: unknown): value is DsComponent {
  const allowed: DsComponent[] = [
    'iv-heading',
    'iv-text',
    'iv-button',
    'iv-input',
    'iv-badge',
    'iv-spinner',
    'iv-checkbox',
    'iv-radio-group',
    'iv-toggle',
    'iv-form-field',
    'iv-dialog',
  ];
  return typeof value === 'string' && allowed.includes(value as DsComponent);
}
