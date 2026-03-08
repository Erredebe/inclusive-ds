import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElement as defineIvBadge } from '@inclusiv-ds/badge/components/iv-badge';
import { defineCustomElement as defineIvButton } from '@inclusiv-ds/button/components/iv-button';
import { defineCustomElement as defineIvCheckbox } from '@inclusiv-ds/checkbox/components/iv-checkbox';
import { defineCustomElement as defineIvDialog } from '@inclusiv-ds/dialog/components/iv-dialog';
import { defineCustomElement as defineIvFormField } from '@inclusiv-ds/form-field/components/iv-form-field';
import { defineCustomElement as defineIvInput } from '@inclusiv-ds/input/components/iv-input';
import { defineCustomElement as defineIvRadio } from '@inclusiv-ds/radio/components/iv-radio';
import { defineCustomElement as defineIvRadioGroup } from '@inclusiv-ds/radio/components/iv-radio-group';
import { defineCustomElement as defineIvSpinner } from '@inclusiv-ds/spinner/components/iv-spinner';
import { defineCustomElement as defineIvToggle } from '@inclusiv-ds/toggle/components/iv-toggle';
import { defineCustomElement as defineIvHeading } from '@inclusiv-ds/typography/components/iv-heading';
import { defineCustomElement as defineIvLabel } from '@inclusiv-ds/typography/components/iv-label';
import { defineCustomElement as defineIvText } from '@inclusiv-ds/typography/components/iv-text';

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

type PropValue = string | number | boolean;
type FieldType = 'text' | 'textarea' | 'select' | 'boolean' | 'number';

interface PropField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface ContentField {
  key: string;
  label: string;
  multiline?: boolean;
}

interface EditorItem {
  id: string;
  type: DsComponent;
  props: Record<string, PropValue>;
  content: Record<string, string>;
  layout: {
    colSpan: number;
    rowSpan: number;
  };
}

interface EditorState {
  version: 2;
  selectedItemId: string | null;
  grid: {
    columns: number;
    gap: number;
    rowHeight: number;
    showOverlay: boolean;
  };
  items: EditorItem[];
}

interface ComponentSchema {
  title: string;
  defaultProps: Record<string, PropValue>;
  defaultContent: Record<string, string>;
  propFields: PropField[];
  contentFields: ContentField[];
  createElement: (item: EditorItem) => HTMLElement;
}

const STORAGE_KEY_V2 = 'ids-editor-layout-v2';
const STORAGE_KEY_V1 = 'ids-editor-layout-v1';

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
const inspectorFields = document.getElementById('inspector-fields');
const inspectorSubtitle = document.getElementById('inspector-subtitle');
const toggleGrid = document.getElementById('toggle-grid') as HTMLInputElement | null;
const gapSlider = document.getElementById('grid-gap') as HTMLInputElement | null;

if (!palette || !canvas || !inspectorFields || !inspectorSubtitle) {
  throw new Error('Editor DOM no encontrado');
}

const paletteEl = palette;
const canvasEl = canvas;
const inspectorFieldsEl = inspectorFields;
const inspectorSubtitleEl = inspectorSubtitle;

const schemas: Record<DsComponent, ComponentSchema> = {
  'iv-heading': {
    title: 'Heading',
    defaultProps: { version: 'v1', level: 'h3' },
    defaultContent: { text: 'Titulo editable' },
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      {
        key: 'level',
        label: 'Level',
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      },
    ],
    contentFields: [{ key: 'text', label: 'Texto' }],
    createElement: (item) => {
      const el = document.createElement('iv-heading');
      applyProps(el, item.props);
      el.textContent = item.content.text;
      return el;
    },
  },
  'iv-text': {
    title: 'Text',
    defaultProps: { version: 'v1', variant: 'body', color: 'default' },
    defaultContent: { text: 'Texto de ejemplo en el editor.' },
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['body', 'caption', 'overline'],
      },
      { key: 'color', label: 'Color', type: 'select', options: ['default', 'muted', 'primary'] },
    ],
    contentFields: [{ key: 'text', label: 'Texto', multiline: true }],
    createElement: (item) => {
      const el = document.createElement('iv-text');
      applyProps(el, item.props);
      el.textContent = item.content.text;
      return el;
    },
  },
  'iv-button': {
    title: 'Button',
    defaultProps: {
      version: 'v2',
      variant: 'primary',
      appearance: 'solid',
      size: 'md',
      disabled: false,
    },
    defaultContent: { text: 'Accion' },
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'ghost'] },
      {
        key: 'appearance',
        label: 'Appearance',
        type: 'select',
        options: ['solid', 'outline', 'danger'],
      },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'disabled', label: 'Disabled', type: 'boolean' },
    ],
    contentFields: [{ key: 'text', label: 'Texto boton' }],
    createElement: (item) => {
      const el = document.createElement('iv-button');
      applyProps(el, item.props);
      el.textContent = item.content.text;
      return el;
    },
  },
  'iv-input': {
    title: 'Input',
    defaultProps: {
      version: 'v2',
      placeholder: 'Escribe aqui',
      label: 'Campo',
      helperText: '',
      state: 'default',
    },
    defaultContent: {},
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'helperText', label: 'Helper text', type: 'text' },
      { key: 'state', label: 'State', type: 'select', options: ['default', 'error', 'success'] },
    ],
    contentFields: [],
    createElement: (item) => {
      const el = document.createElement('iv-input');
      applyProps(el, item.props);
      return el;
    },
  },
  'iv-badge': {
    title: 'Badge',
    defaultProps: { version: 'v1', variant: 'info' },
    defaultContent: { text: 'Nuevo' },
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['default', 'success', 'warning', 'error', 'info'],
      },
    ],
    contentFields: [{ key: 'text', label: 'Texto badge' }],
    createElement: (item) => {
      const el = document.createElement('iv-badge');
      applyProps(el, item.props);
      el.textContent = item.content.text;
      return el;
    },
  },
  'iv-spinner': {
    title: 'Spinner',
    defaultProps: { version: 'v1', size: 'md', label: 'Loading' },
    defaultContent: {},
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'label', label: 'Label', type: 'text' },
    ],
    contentFields: [],
    createElement: (item) => {
      const el = document.createElement('iv-spinner');
      applyProps(el, item.props);
      return el;
    },
  },
  'iv-checkbox': {
    title: 'Checkbox',
    defaultProps: {
      version: 'v1',
      checked: false,
      indeterminate: false,
      disabled: false,
      label: 'Acepto terminos',
    },
    defaultContent: {},
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'checked', label: 'Checked', type: 'boolean' },
      { key: 'indeterminate', label: 'Indeterminate', type: 'boolean' },
      { key: 'disabled', label: 'Disabled', type: 'boolean' },
    ],
    contentFields: [],
    createElement: (item) => {
      const el = document.createElement('iv-checkbox');
      applyProps(el, item.props);
      return el;
    },
  },
  'iv-radio-group': {
    title: 'Radio Group',
    defaultProps: { name: 'editor-radio-group', label: 'Selecciona una opcion' },
    defaultContent: { optionA: 'Opcion A', optionB: 'Opcion B' },
    propFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'label', label: 'Label', type: 'text' },
    ],
    contentFields: [
      { key: 'optionA', label: 'Texto opcion A' },
      { key: 'optionB', label: 'Texto opcion B' },
    ],
    createElement: (item) => {
      const group = document.createElement('iv-radio-group');
      applyProps(group, item.props);

      const name = String(item.props.name || 'editor-radio-group');
      const radioA = document.createElement('iv-radio');
      radioA.setAttribute('name', name);
      radioA.setAttribute('value', 'a');
      radioA.setAttribute('label', item.content.optionA || 'Opcion A');

      const radioB = document.createElement('iv-radio');
      radioB.setAttribute('name', name);
      radioB.setAttribute('value', 'b');
      radioB.setAttribute('label', item.content.optionB || 'Opcion B');

      group.append(radioA, radioB);
      return group;
    },
  },
  'iv-toggle': {
    title: 'Toggle',
    defaultProps: { version: 'v1', checked: false, disabled: false, label: 'Activar opcion' },
    defaultContent: {},
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'checked', label: 'Checked', type: 'boolean' },
      { key: 'disabled', label: 'Disabled', type: 'boolean' },
    ],
    contentFields: [],
    createElement: (item) => {
      const el = document.createElement('iv-toggle');
      applyProps(el, item.props);
      return el;
    },
  },
  'iv-form-field': {
    title: 'Form Field',
    defaultProps: {
      version: 'v1',
      label: 'Correo',
      helperText: 'Usaremos este correo para contactarte',
      errorText: '',
      disabled: false,
      required: false,
    },
    defaultContent: { inputPlaceholder: 'tu@email.com' },
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'helperText', label: 'Helper text', type: 'text' },
      { key: 'errorText', label: 'Error text', type: 'text' },
      { key: 'disabled', label: 'Disabled', type: 'boolean' },
      { key: 'required', label: 'Required', type: 'boolean' },
    ],
    contentFields: [{ key: 'inputPlaceholder', label: 'Placeholder del input' }],
    createElement: (item) => {
      const field = document.createElement('iv-form-field');
      applyProps(field, item.props);

      const input = document.createElement('iv-input');
      input.setAttribute('version', 'v2');
      input.setAttribute('placeholder', item.content.inputPlaceholder || 'tu@email.com');
      field.appendChild(input);

      return field;
    },
  },
  'iv-dialog': {
    title: 'Dialog',
    defaultProps: {
      open: true,
      mode: 'modal',
      placement: 'right',
      anchor: '',
      closeOnBackdrop: true,
      closeOnEsc: true,
      label: 'Dialog de ejemplo',
      ariaLabelledby: '',
      ariaDescribedby: '',
      returnValue: '',
    },
    defaultContent: {
      title: 'Dialog del editor',
      body: 'Contenido de ejemplo dentro de iv-dialog.',
    },
    propFields: [
      { key: 'open', label: 'Open', type: 'boolean' },
      { key: 'mode', label: 'Mode', type: 'select', options: ['modal', 'drawer', 'list', 'alert'] },
      {
        key: 'placement',
        label: 'Placement',
        type: 'select',
        options: ['left', 'right', 'top', 'bottom'],
      },
      { key: 'anchor', label: 'Anchor selector', type: 'text' },
      { key: 'closeOnBackdrop', label: 'Close on backdrop', type: 'boolean' },
      { key: 'closeOnEsc', label: 'Close on esc', type: 'boolean' },
      { key: 'label', label: 'Aria label', type: 'text' },
      { key: 'ariaLabelledby', label: 'aria-labelledby', type: 'text' },
      { key: 'ariaDescribedby', label: 'aria-describedby', type: 'text' },
      { key: 'returnValue', label: 'Return value', type: 'text' },
    ],
    contentFields: [
      { key: 'title', label: 'Titulo' },
      { key: 'body', label: 'Contenido', multiline: true },
    ],
    createElement: (item) => {
      const dialog = document.createElement('iv-dialog');
      applyProps(dialog, item.props);

      const title = document.createElement('h3');
      title.setAttribute('slot', 'title');
      title.textContent = item.content.title;

      const content = document.createElement('p');
      content.textContent = item.content.body;

      dialog.append(title, content);
      return dialog;
    },
  },
};

let state: EditorState = loadState();
let draggingItemId: string | null = null;

renderAll();

paletteEl.querySelectorAll<HTMLElement>('.palette-item').forEach((item) => {
  item.addEventListener('dragstart', (event: DragEvent) => {
    const component = item.dataset.component as DsComponent | undefined;
    if (!component || !event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', component);
    event.dataTransfer.effectAllowed = 'copy';
  });
});

canvasEl.addEventListener('click', (event) => {
  const actionButton = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
  if (actionButton) {
    event.stopPropagation();
    const card = actionButton.closest<HTMLElement>('.canvas-item');
    if (!card) return;
    const itemId = card.dataset.itemId;
    if (!itemId) return;
    handleItemAction(actionButton.dataset.action || '', itemId);
    return;
  }

  const card = (event.target as HTMLElement).closest<HTMLElement>('.canvas-item');
  if (!card?.dataset.itemId) return;
  setState({ ...state, selectedItemId: card.dataset.itemId });
});

canvasEl.addEventListener('dragstart', (event) => {
  const card = (event.target as HTMLElement).closest<HTMLElement>('.canvas-item');
  if (!card || !event.dataTransfer) return;
  draggingItemId = card.dataset.itemId || null;
  if (!draggingItemId) return;
  event.dataTransfer.setData('application/x-editor-item', draggingItemId);
  event.dataTransfer.effectAllowed = 'move';
});

canvasEl.addEventListener('dragend', () => {
  draggingItemId = null;
  canvasEl.classList.remove('canvas--active');
  clearDropIndicators();
});

canvasEl.addEventListener('dragover', (event: DragEvent) => {
  event.preventDefault();
  canvasEl.classList.add('canvas--active');

  clearDropIndicators();
  const card = (event.target as HTMLElement).closest<HTMLElement>('.canvas-item');
  if (!card) return;

  const { top, height } = card.getBoundingClientRect();
  const position = event.clientY < top + height / 2 ? 'before' : 'after';
  card.dataset.dropPosition = position;
  card.classList.add(
    position === 'before' ? 'canvas-item--drop-before' : 'canvas-item--drop-after',
  );
});

canvasEl.addEventListener('dragleave', (event) => {
  const target = event.relatedTarget as Node | null;
  if (target && canvasEl.contains(target)) return;
  canvasEl.classList.remove('canvas--active');
  clearDropIndicators();
});

canvasEl.addEventListener('drop', (event: DragEvent) => {
  event.preventDefault();
  canvasEl.classList.remove('canvas--active');

  const targetCard = (event.target as HTMLElement).closest<HTMLElement>('.canvas-item');
  const targetId = targetCard?.dataset.itemId || null;
  const position = (targetCard?.dataset.dropPosition as 'before' | 'after' | undefined) || 'after';

  const droppedComponent = event.dataTransfer?.getData('text/plain') as DsComponent | '';
  const draggedId = event.dataTransfer?.getData('application/x-editor-item') || draggingItemId;

  if (droppedComponent && isDsComponent(droppedComponent)) {
    const newItem = createItem(droppedComponent);
    const nextItems = insertItemAtTarget(state.items, newItem, targetId, position);
    setState({ ...state, items: nextItems, selectedItemId: newItem.id });
    clearDropIndicators();
    return;
  }

  if (!draggedId) {
    clearDropIndicators();
    return;
  }

  const nextItems = reorderItems(state.items, draggedId, targetId, position);
  if (nextItems !== state.items) {
    setState({ ...state, items: nextItems, selectedItemId: draggedId });
  }

  clearDropIndicators();
});

clearButton?.addEventListener('click', () => {
  setState({ ...state, items: [], selectedItemId: null });
});

toggleGrid?.addEventListener('change', () => {
  setState({
    ...state,
    grid: { ...state.grid, showOverlay: toggleGrid.checked },
  });
});

gapSlider?.addEventListener('input', () => {
  const gap = Number(gapSlider.value || 12);
  setState({
    ...state,
    grid: { ...state.grid, gap },
  });
});

function handleItemAction(action: string, itemId: string): void {
  if (action === 'delete') {
    const nextItems = state.items.filter((item) => item.id !== itemId);
    const selectedItemId = state.selectedItemId === itemId ? null : state.selectedItemId;
    setState({ ...state, items: nextItems, selectedItemId });
    return;
  }

  if (action === 'duplicate') {
    const index = state.items.findIndex((item) => item.id === itemId);
    if (index < 0) return;
    const source = state.items[index];
    const clone: EditorItem = {
      ...source,
      id: generateId(),
      props: { ...source.props },
      content: { ...source.content },
      layout: { ...source.layout },
    };
    const nextItems = [...state.items];
    nextItems.splice(index + 1, 0, clone);
    setState({ ...state, items: nextItems, selectedItemId: clone.id });
  }
}

function renderAll(): void {
  renderCanvas();
  renderInspector();
  persistState();
}

function renderCanvas(): void {
  canvasEl.innerHTML = '';

  canvasEl.style.setProperty(
    'grid-template-columns',
    `repeat(${state.grid.columns}, minmax(0, 1fr))`,
  );
  canvasEl.style.setProperty('gap', `${state.grid.gap}px`);
  canvasEl.classList.toggle('canvas--show-grid', state.grid.showOverlay);

  if (state.items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'canvas__empty';
    empty.textContent = 'Suelta aqui los componentes para empezar.';
    canvasEl.appendChild(empty);
    return;
  }

  state.items.forEach((item) => {
    const schema = schemas[item.type];
    const card = document.createElement('article');
    card.className = 'canvas-item';
    if (item.id === state.selectedItemId) card.classList.add('canvas-item--selected');
    card.setAttribute('draggable', 'true');
    card.dataset.itemId = item.id;
    card.style.setProperty('--col-span', String(clamp(item.layout.colSpan, 1, 12)));
    card.style.setProperty('--row-span', String(clamp(item.layout.rowSpan, 1, 4)));

    const meta = document.createElement('div');
    meta.className = 'canvas-item__meta';

    const name = document.createElement('span');
    name.className = 'canvas-item__name';
    name.textContent = `${schema.title} · ${item.layout.colSpan}/12`;

    const actions = document.createElement('div');
    actions.className = 'canvas-item__actions';
    actions.innerHTML = `
      <button type="button" data-action="duplicate">Duplicar</button>
      <button type="button" data-action="delete">Eliminar</button>
    `;

    meta.append(name, actions);
    card.append(meta, schema.createElement(item));
    canvasEl.appendChild(card);
  });
}

function renderInspector(): void {
  const selected = state.items.find((item) => item.id === state.selectedItemId) || null;

  if (!selected) {
    inspectorSubtitleEl.textContent = 'Selecciona un bloque para editar sus propiedades.';
    inspectorFieldsEl.innerHTML =
      '<p class="inspector__empty">Selecciona un componente del lienzo.</p>';
    return;
  }

  const schema = schemas[selected.type];
  inspectorSubtitleEl.textContent = `Editando: ${schema.title}`;
  inspectorFieldsEl.innerHTML = '';

  const layoutSection = document.createElement('section');
  layoutSection.className = 'inspector__section';
  layoutSection.innerHTML = '<h3>Layout</h3>';
  layoutSection.append(
    createNumberField('colSpan', 'Columnas (1-12)', selected.layout.colSpan, 1, 12, 1, (value) => {
      updateSelectedItem((item) => {
        item.layout.colSpan = clamp(value, 1, 12);
      });
    }),
  );
  layoutSection.append(
    createNumberField('rowSpan', 'Filas (1-4)', selected.layout.rowSpan, 1, 4, 1, (value) => {
      updateSelectedItem((item) => {
        item.layout.rowSpan = clamp(value, 1, 4);
      });
    }),
  );

  const propSection = document.createElement('section');
  propSection.className = 'inspector__section';
  propSection.innerHTML = '<h3>Props</h3>';

  schema.propFields.forEach((field) => {
    propSection.append(createPropControl(selected, field));
  });

  const contentSection = document.createElement('section');
  contentSection.className = 'inspector__section';
  contentSection.innerHTML = '<h3>Contenido</h3>';

  if (schema.contentFields.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'inspector__empty';
    empty.textContent = 'Este componente no expone contenido textual.';
    contentSection.append(empty);
  } else {
    schema.contentFields.forEach((field) => {
      const wrap = document.createElement('div');
      wrap.className = 'field';

      const label = document.createElement('label');
      label.textContent = field.label;

      const input = field.multiline
        ? document.createElement('textarea')
        : document.createElement('input');
      input.value = selected.content[field.key] ?? '';
      input.addEventListener('input', () => {
        updateSelectedItem((item) => {
          item.content[field.key] = input.value;
        });
      });

      wrap.append(label, input);
      contentSection.append(wrap);
    });
  }

  const actions = document.createElement('section');
  actions.className = 'inspector__section';
  actions.innerHTML = '<h3>Acciones</h3>';

  const actionWrap = document.createElement('div');
  actionWrap.className = 'inspector__actions';
  actionWrap.innerHTML = `
    <button type="button" data-inspector-action="duplicate">Duplicar</button>
    <button type="button" data-inspector-action="delete">Eliminar</button>
  `;

  actionWrap.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.inspectorAction || '';
      handleItemAction(action, selected.id);
    });
  });

  actions.append(actionWrap);
  inspectorFieldsEl.append(layoutSection, propSection, contentSection, actions);
}

function createPropControl(item: EditorItem, field: PropField): HTMLElement {
  const currentValue = item.props[field.key];

  if (field.type === 'boolean') {
    const wrap = document.createElement('div');
    wrap.className = 'field field--checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(currentValue);

    const label = document.createElement('label');
    label.textContent = field.label;

    input.addEventListener('change', () => {
      updateSelectedItem((next) => {
        next.props[field.key] = input.checked;
      });
    });

    wrap.append(input, label);
    return wrap;
  }

  if (field.type === 'select') {
    const wrap = document.createElement('div');
    wrap.className = 'field';

    const label = document.createElement('label');
    label.textContent = field.label;

    const select = document.createElement('select');
    (field.options || []).forEach((optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });
    select.value = String(currentValue ?? '');
    select.addEventListener('change', () => {
      updateSelectedItem((next) => {
        next.props[field.key] = select.value;
      });
    });

    wrap.append(label, select);
    return wrap;
  }

  if (field.type === 'number') {
    return createNumberField(
      field.key,
      field.label,
      Number(currentValue ?? 0),
      field.min ?? 0,
      field.max ?? 100,
      field.step ?? 1,
      (value) => {
        updateSelectedItem((next) => {
          next.props[field.key] = value;
        });
      },
    );
  }

  const wrap = document.createElement('div');
  wrap.className = 'field';

  const label = document.createElement('label');
  label.textContent = field.label;

  const input =
    field.type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');
  input.value = String(currentValue ?? '');
  input.addEventListener('input', () => {
    updateSelectedItem((next) => {
      next.props[field.key] = input.value;
    });
  });

  wrap.append(label, input);
  return wrap;
}

function createNumberField(
  key: string,
  labelText: string,
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const label = document.createElement('label');
  label.setAttribute('for', `field-${key}`);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.id = `field-${key}`;
  input.type = 'number';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);

  input.addEventListener('input', () => {
    const next = Number(input.value || min);
    onChange(Number.isNaN(next) ? min : next);
  });

  wrap.append(label, input);
  return wrap;
}

function updateSelectedItem(mutate: (item: EditorItem) => void): void {
  if (!state.selectedItemId) return;
  const nextItems = state.items.map((item) => {
    if (item.id !== state.selectedItemId) return item;
    const draft: EditorItem = {
      ...item,
      props: { ...item.props },
      content: { ...item.content },
      layout: { ...item.layout },
    };
    mutate(draft);
    return draft;
  });
  setState({ ...state, items: nextItems });
}

function createItem(type: DsComponent): EditorItem {
  const schema = schemas[type];
  return {
    id: generateId(),
    type,
    props: { ...schema.defaultProps },
    content: { ...schema.defaultContent },
    layout: { colSpan: 12, rowSpan: 1 },
  };
}

function insertItemAtTarget(
  items: EditorItem[],
  item: EditorItem,
  targetId: string | null,
  position: 'before' | 'after',
): EditorItem[] {
  if (!targetId) return [...items, item];

  const index = items.findIndex((entry) => entry.id === targetId);
  if (index < 0) return [...items, item];

  const nextItems = [...items];
  const insertIndex = position === 'before' ? index : index + 1;
  nextItems.splice(insertIndex, 0, item);
  return nextItems;
}

function reorderItems(
  items: EditorItem[],
  dragId: string,
  targetId: string | null,
  position: 'before' | 'after',
): EditorItem[] {
  const fromIndex = items.findIndex((item) => item.id === dragId);
  if (fromIndex < 0) return items;

  if (!targetId) {
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.push(moved);
    return next;
  }

  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (targetIndex < 0 || targetId === dragId) return items;

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  let insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
  if (fromIndex < targetIndex) insertIndex -= 1;
  next.splice(insertIndex, 0, moved);

  return next;
}

function clearDropIndicators(): void {
  canvasEl.querySelectorAll<HTMLElement>('.canvas-item').forEach((card) => {
    card.classList.remove('canvas-item--drop-before', 'canvas-item--drop-after');
    delete card.dataset.dropPosition;
  });
}

function applyProps(el: HTMLElement, props: Record<string, PropValue>): void {
  Object.entries(props).forEach(([key, value]) => {
    const attrName = toKebabCase(key);
    if (typeof value === 'boolean') {
      if (value) {
        el.setAttribute(attrName, '');
      } else {
        el.removeAttribute(attrName);
      }
      return;
    }

    el.setAttribute(attrName, String(value));
  });
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function setState(nextState: EditorState): void {
  state = nextState;
  renderAll();
}

function persistState(): void {
  window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
}

function loadState(): EditorState {
  const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
  if (rawV2) {
    try {
      const parsed = JSON.parse(rawV2) as EditorState;
      if (parsed && parsed.version === 2 && Array.isArray(parsed.items)) {
        return {
          version: 2,
          selectedItemId: parsed.selectedItemId ?? null,
          grid: {
            columns: 12,
            gap: clamp(Number(parsed.grid?.gap ?? 12), 6, 24),
            rowHeight: 1,
            showOverlay: Boolean(parsed.grid?.showOverlay ?? true),
          },
          items: parsed.items.filter((item) => isDsComponent(item.type)),
        };
      }
    } catch {
      return createInitialState();
    }
  }

  const migrated = migrateFromV1();
  if (migrated) return migrated;

  return createInitialState();
}

function migrateFromV1(): EditorState | null {
  const rawV1 = window.localStorage.getItem(STORAGE_KEY_V1);
  if (!rawV1) return null;

  try {
    const parsed = JSON.parse(rawV1);
    if (!Array.isArray(parsed)) return null;

    const items = parsed
      .filter((value): value is DsComponent => isDsComponent(value))
      .map((type) => createItem(type));

    return {
      ...createInitialState(),
      items,
      selectedItemId: items[0]?.id ?? null,
    };
  } catch {
    return null;
  }
}

function createInitialState(): EditorState {
  return {
    version: 2,
    selectedItemId: null,
    grid: {
      columns: 12,
      gap: 12,
      rowHeight: 1,
      showOverlay: true,
    },
    items: [],
  };
}

function isDsComponent(value: unknown): value is DsComponent {
  return (
    typeof value === 'string' &&
    [
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
    ].includes(value)
  );
}

function generateId(): string {
  return `item-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
