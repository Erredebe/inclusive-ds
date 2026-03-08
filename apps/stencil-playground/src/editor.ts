import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElement as defineIvBadge } from '@inclusiv-ds/badge/components/iv-badge';
import { defineCustomElement as defineIvButton } from '@inclusiv-ds/button/components/iv-button';
import { defineCustomElement as defineIvCheckbox } from '@inclusiv-ds/checkbox/components/iv-checkbox';
import { defineCustomElement as defineIvDialog } from '@inclusiv-ds/dialog/components/iv-dialog';
import { defineCustomElement as defineIvContainer } from '@inclusiv-ds/container/components/iv-container';
import { defineCustomElement as defineIvFormField } from '@inclusiv-ds/form-field/components/iv-form-field';
import { defineCustomElement as defineIvInput } from '@inclusiv-ds/input/components/iv-input';
import { defineCustomElement as defineIvSelect } from '@inclusiv-ds/select/components/iv-select';
import { defineCustomElement as defineIvTextarea } from '@inclusiv-ds/textarea/components/iv-textarea';
import { defineCustomElement as defineIvAlert } from '@inclusiv-ds/alert/components/iv-alert';
import { defineCustomElement as defineIvRadio } from '@inclusiv-ds/radio/components/iv-radio';
import { defineCustomElement as defineIvRadioGroup } from '@inclusiv-ds/radio/components/iv-radio-group';
import { defineCustomElement as defineIvSpinner } from '@inclusiv-ds/spinner/components/iv-spinner';
import { defineCustomElement as defineIvToggle } from '@inclusiv-ds/toggle/components/iv-toggle';
import { defineCustomElement as defineIvToast } from '@inclusiv-ds/toast/components/iv-toast';
import { defineCustomElement as defineIvHeading } from '@inclusiv-ds/typography/components/iv-heading';
import { defineCustomElement as defineIvLabel } from '@inclusiv-ds/typography/components/iv-label';
import { defineCustomElement as defineIvText } from '@inclusiv-ds/typography/components/iv-text';

type DsComponent =
  | 'iv-container'
  | 'iv-heading'
  | 'iv-text'
  | 'iv-button'
  | 'iv-input'
  | 'iv-textarea'
  | 'iv-select'
  | 'iv-alert'
  | 'iv-badge'
  | 'iv-spinner'
  | 'iv-checkbox'
  | 'iv-radio-group'
  | 'iv-toggle'
  | 'iv-form-field'
  | 'iv-dialog'
  | 'iv-toast';

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

interface SlotComponentNode {
  id: string;
  kind: 'component';
  item: EditorItem;
}

interface SlotTextNode {
  id: string;
  kind: 'text';
  value: string;
}

type SlotNode = SlotComponentNode | SlotTextNode;

interface EditorItem {
  id: string;
  type: DsComponent;
  props: Record<string, PropValue>;
  content: Record<string, string>;
  layout: {
    colSpan: number;
    rowSpan: number;
  };
  slots: Record<string, SlotNode[]>;
}

interface EditorState {
  version: 3;
  selectedItemId: string | null;
  grid: {
    columns: number;
    gap: number;
    rowHeight: number;
    showOverlay: boolean;
  };
  items: EditorItem[];
}

interface InspectorFocusSnapshot {
  fieldId: string;
  selectionStart: number | null;
  selectionEnd: number | null;
}

interface ComponentSchema {
  title: string;
  defaultProps: Record<string, PropValue>;
  defaultContent: Record<string, string>;
  availableSlots: string[];
  fallbackContentBySlot?: Partial<Record<string, string[]>>;
  propFields: PropField[];
  contentFields: ContentField[];
  createElement: (item: EditorItem) => HTMLElement;
}

const ROOT_SLOT = 'default';
const STORAGE_KEY_V2 = 'ids-editor-layout-v2';
const STORAGE_KEY_V3 = 'ids-editor-layout-v3';
const STORAGE_KEY_V1 = 'ids-editor-layout-v1';

if (!customElements.get('iv-button')) defineIvButton();
if (!customElements.get('iv-input')) defineIvInput();
if (!customElements.get('iv-select')) defineIvSelect();
if (!customElements.get('iv-textarea')) defineIvTextarea();
if (!customElements.get('iv-alert')) defineIvAlert();
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
if (!customElements.get('iv-toast')) defineIvToast();
if (!customElements.get('iv-container')) defineIvContainer();

const palette = document.getElementById('palette');
const canvas = document.getElementById('drop-canvas');
const clearButton = document.getElementById('clear-canvas') as HTMLButtonElement | null;
const inspectorFields = document.getElementById('inspector-fields');
const inspectorSubtitle = document.getElementById('inspector-subtitle');
const toggleGrid = document.getElementById('toggle-grid') as HTMLInputElement | null;
const gapSlider = document.getElementById('grid-gap') as HTMLInputElement | null;
const previewToggleButton = document.getElementById(
  'toggle-preview-mode',
) as HTMLButtonElement | null;
const editorLayout = document.querySelector('.editor-layout') as HTMLElement | null;

const PREVIEW_STORAGE_KEY = 'ids-editor-preview-mode';
let isPreviewMode = window.localStorage.getItem(PREVIEW_STORAGE_KEY) === '1';

if (!palette || !canvas || !inspectorFields || !inspectorSubtitle) {
  throw new Error('Editor DOM no encontrado');
}

const paletteEl = palette;
const canvasEl = canvas;
const inspectorFieldsEl = inspectorFields;
const inspectorSubtitleEl = inspectorSubtitle;

const schemas: Record<DsComponent, ComponentSchema> = {
  'iv-container': {
    title: 'Container',
    defaultProps: {
      direction: 'column',
      align: 'stretch',
      justify: 'start',
      gap: '12',
      padding: '16',
      wrap: false,
    },
    defaultContent: {},
    availableSlots: [ROOT_SLOT],
    propFields: [
      { key: 'direction', label: 'Direction', type: 'select', options: ['row', 'column'] },
      {
        key: 'align',
        label: 'Align',
        type: 'select',
        options: ['start', 'center', 'end', 'stretch'],
      },
      {
        key: 'justify',
        label: 'Justify',
        type: 'select',
        options: ['start', 'center', 'end', 'between', 'around'],
      },
      { key: 'gap', label: 'Gap', type: 'number', min: 0, max: 64, step: 1 },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64, step: 1 },
      { key: 'wrap', label: 'Wrap', type: 'boolean' },
    ],
    contentFields: [],
    createElement: (item) => {
      const el = document.createElement('iv-container');
      applyProps(el, item.props);
      return el;
    },
  },
  'iv-heading': {
    title: 'Heading',
    defaultProps: { version: 'v1', level: 'h3' },
    defaultContent: { text: 'Titulo editable' },
    availableSlots: [ROOT_SLOT],
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
    availableSlots: [ROOT_SLOT],
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
    availableSlots: [ROOT_SLOT],
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
    availableSlots: [],
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
  'iv-textarea': {
    title: 'Textarea',
    defaultProps: {
      version: 'v2',
      placeholder: 'Escribe una descripcion',
      label: 'Descripcion',
      helperText: '',
      state: 'default',
      rows: 4,
    },
    defaultContent: {},
    availableSlots: [],
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'helperText', label: 'Helper text', type: 'text' },
      { key: 'state', label: 'State', type: 'select', options: ['default', 'error', 'success'] },
      { key: 'rows', label: 'Rows', type: 'number', min: 2, max: 12, step: 1 },
      { key: 'maxLength', label: 'Max length', type: 'number', min: 0, max: 500, step: 1 },
      { key: 'clearable', label: 'Clearable', type: 'boolean' },
      { key: 'required', label: 'Required', type: 'boolean' },
      { key: 'readonly', label: 'Readonly', type: 'boolean' },
      { key: 'disabled', label: 'Disabled', type: 'boolean' },
    ],
    contentFields: [],
    createElement: (item) => {
      const el = document.createElement('iv-textarea');
      applyProps(el, item.props);
      return el;
    },
  },
  'iv-select': {
    title: 'Select',
    defaultProps: {
      version: 'v2',
      label: 'Pais',
      helperText: '',
      state: 'default',
      value: '',
    },
    defaultContent: {},
    availableSlots: [ROOT_SLOT],
    fallbackContentBySlot: {
      [ROOT_SLOT]: ['optionA', 'optionB', 'optionC'],
    },
    propFields: [
      { key: 'version', label: 'Version', type: 'select', options: ['v1', 'v2'] },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'helperText', label: 'Helper text', type: 'text' },
      { key: 'state', label: 'State', type: 'select', options: ['default', 'error', 'success'] },
      { key: 'value', label: 'Value', type: 'text' },
      { key: 'required', label: 'Required', type: 'boolean' },
      { key: 'disabled', label: 'Disabled', type: 'boolean' },
      { key: 'invalid', label: 'Invalid', type: 'boolean' },
    ],
    contentFields: [
      { key: 'optionA', label: 'Opcion A' },
      { key: 'optionB', label: 'Opcion B' },
      { key: 'optionC', label: 'Opcion C' },
    ],
    createElement: (item) => {
      const el = document.createElement('iv-select');
      applyProps(el, item.props);

      if (!hasSlotNodes(item, ROOT_SLOT)) {
        const optionA = document.createElement('option');
        optionA.setAttribute('value', 'a');
        optionA.textContent = item.content.optionA || 'Opcion A';

        const optionB = document.createElement('option');
        optionB.setAttribute('value', 'b');
        optionB.textContent = item.content.optionB || 'Opcion B';

        const optionC = document.createElement('option');
        optionC.setAttribute('value', 'c');
        optionC.textContent = item.content.optionC || 'Opcion C';

        el.append(optionA, optionB, optionC);
      }

      return el;
    },
  },
  'iv-alert': {
    title: 'Alert',
    defaultProps: {
      appearance: 'info',
      title: 'Mensaje importante',
      description: 'Detalle contextual para la persona usuaria.',
      closable: true,
      open: true,
    },
    defaultContent: {},
    availableSlots: [ROOT_SLOT],
    fallbackContentBySlot: {
      [ROOT_SLOT]: ['description'],
    },
    propFields: [
      {
        key: 'appearance',
        label: 'Appearance',
        type: 'select',
        options: ['info', 'success', 'warning', 'error'],
      },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'closable', label: 'Closable', type: 'boolean' },
      { key: 'open', label: 'Open', type: 'boolean' },
    ],
    contentFields: [{ key: 'description', label: 'Contenido', multiline: true }],
    createElement: (item) => {
      const el = document.createElement('iv-alert');
      applyProps(el, item.props);

      if (!hasSlotNodes(item, ROOT_SLOT) && item.content.description) {
        el.textContent = item.content.description;
      }

      return el;
    },
  },
  'iv-badge': {
    title: 'Badge',
    defaultProps: { version: 'v1', variant: 'info' },
    defaultContent: { text: 'Nuevo' },
    availableSlots: [ROOT_SLOT],
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
    availableSlots: [],
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
    availableSlots: [],
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
    availableSlots: [ROOT_SLOT],
    fallbackContentBySlot: {
      [ROOT_SLOT]: ['optionA', 'optionB'],
    },
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

      if (!hasSlotNodes(item, ROOT_SLOT)) {
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
      }
      return group;
    },
  },
  'iv-toggle': {
    title: 'Toggle',
    defaultProps: { version: 'v1', checked: false, disabled: false, label: 'Activar opcion' },
    defaultContent: {},
    availableSlots: [],
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
    availableSlots: [ROOT_SLOT],
    fallbackContentBySlot: {
      [ROOT_SLOT]: ['inputPlaceholder'],
    },
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

      if (!hasSlotNodes(item, ROOT_SLOT)) {
        const input = document.createElement('iv-input');
        input.setAttribute('version', 'v2');
        input.setAttribute('placeholder', item.content.inputPlaceholder || 'tu@email.com');
        field.appendChild(input);
      }

      return field;
    },
  },
  'iv-dialog': {
    title: 'Dialog',
    defaultProps: {
      open: false,
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
    availableSlots: ['title', ROOT_SLOT, 'actions'],
    fallbackContentBySlot: {
      title: ['title'],
      [ROOT_SLOT]: ['body'],
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

      if (!hasSlotNodes(item, 'title')) {
        const title = document.createElement('h3');
        title.setAttribute('slot', 'title');
        title.textContent = item.content.title;
        dialog.appendChild(title);
      }

      if (!hasSlotNodes(item, ROOT_SLOT)) {
        const content = document.createElement('p');
        content.textContent = item.content.body;
        dialog.appendChild(content);
      }
      return dialog;
    },
  },
  'iv-toast': {
    title: 'Toast',
    defaultProps: {
      appearance: 'success',
      title: 'Guardado',
      message: 'Los cambios fueron aplicados.',
      open: true,
      closable: true,
      duration: 4000,
    },
    defaultContent: {},
    availableSlots: [ROOT_SLOT],
    fallbackContentBySlot: {
      [ROOT_SLOT]: ['message'],
    },
    propFields: [
      {
        key: 'appearance',
        label: 'Appearance',
        type: 'select',
        options: ['info', 'success', 'warning', 'error'],
      },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' },
      { key: 'open', label: 'Open', type: 'boolean' },
      { key: 'closable', label: 'Closable', type: 'boolean' },
      { key: 'duration', label: 'Duration ms', type: 'number', min: 0, max: 30000, step: 100 },
    ],
    contentFields: [{ key: 'message', label: 'Contenido', multiline: true }],
    createElement: (item) => {
      const el = document.createElement('iv-toast');
      applyProps(el, item.props);

      if (!hasSlotNodes(item, ROOT_SLOT) && item.content.message) {
        el.textContent = item.content.message;
      }

      return el;
    },
  },
};

let state: EditorState = loadState();
let draggingItemId: string | null = null;

canvasEl.dataset.dropSlot = ROOT_SLOT;
canvasEl.dataset.dropParentId = '';

renderAll();

paletteEl.querySelectorAll<HTMLElement>('.palette-item').forEach((item) => {
  item.addEventListener('dragstart', (event: DragEvent) => {
    if (isPreviewMode) {
      event.preventDefault();
      return;
    }

    const component = item.dataset.component as DsComponent | undefined;
    if (!component || !event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', component);
    event.dataTransfer.effectAllowed = 'copy';
  });
});

canvasEl.addEventListener('click', (event) => {
  if (isPreviewMode) return;

  const actionButton = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
  if (actionButton) {
    event.stopPropagation();
    const card = actionButton.closest<HTMLElement>('.canvas-item');
    if (!card) return;
    const itemId = card.dataset.itemId;
    if (!itemId) return;
    handleItemAction(actionButton.dataset.action || '', itemId, actionButton.dataset.slotName);
    return;
  }

  const card = (event.target as HTMLElement).closest<HTMLElement>('.canvas-item');
  if (!card?.dataset.itemId) return;
  setState({ ...state, selectedItemId: card.dataset.itemId });
});

canvasEl.addEventListener('dragstart', (event) => {
  if (isPreviewMode) {
    event.preventDefault();
    return;
  }

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
  canvasEl.querySelectorAll<HTMLElement>('.slot-dropzone--active').forEach((el) => {
    el.classList.remove('slot-dropzone--active');
  });
});

canvasEl.addEventListener('dragover', (event: DragEvent) => {
  if (isPreviewMode) return;

  const slotZone = (event.target as HTMLElement).closest<HTMLElement>('[data-drop-slot]');
  if (!slotZone) return;
  event.preventDefault();
  canvasEl.classList.add('canvas--active');
  slotZone.classList.add('slot-dropzone--active');
});

canvasEl.addEventListener('dragleave', (event) => {
  if (isPreviewMode) return;

  const slotZone = (event.target as HTMLElement).closest<HTMLElement>('[data-drop-slot]');
  if (!slotZone) return;
  const target = event.relatedTarget as Node | null;
  if (target && slotZone.contains(target)) return;
  slotZone.classList.remove('slot-dropzone--active');
});

canvasEl.addEventListener('drop', (event: DragEvent) => {
  if (isPreviewMode) return;

  const slotZone = (event.target as HTMLElement).closest<HTMLElement>('[data-drop-slot]');
  if (!slotZone) return;
  event.preventDefault();
  canvasEl.classList.remove('canvas--active');
  slotZone.classList.remove('slot-dropzone--active');

  const slotName = slotZone.dataset.dropSlot || ROOT_SLOT;
  const targetParentId = slotZone.dataset.dropParentId || null;

  const droppedComponent = event.dataTransfer?.getData('text/plain') as DsComponent | '';
  const draggedId = event.dataTransfer?.getData('application/x-editor-item') || draggingItemId;

  if (droppedComponent && isDsComponent(droppedComponent)) {
    const newItem = createItem(droppedComponent);
    const nextItems = insertItemAtSlot(state.items, targetParentId, slotName, newItem);
    setState({ ...state, items: nextItems, selectedItemId: newItem.id });
    return;
  }

  if (!draggedId) {
    return;
  }

  const nextItems = moveItemToSlot(state.items, draggedId, targetParentId, slotName);
  setState({ ...state, items: nextItems, selectedItemId: draggedId });
});

clearButton?.addEventListener('click', () => {
  if (isPreviewMode) return;
  setState({ ...state, items: [], selectedItemId: null });
});

toggleGrid?.addEventListener('change', () => {
  if (isPreviewMode) return;
  setState({
    ...state,
    grid: { ...state.grid, showOverlay: toggleGrid.checked },
  });
});

gapSlider?.addEventListener('input', () => {
  if (isPreviewMode) return;
  const gap = Number(gapSlider.value || 12);
  setState({
    ...state,
    grid: { ...state.grid, gap },
  });
});

previewToggleButton?.addEventListener('click', () => {
  setPreviewMode(!isPreviewMode);
});

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() !== 'p') return;

  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement instanceof HTMLSelectElement ||
    activeElement instanceof HTMLButtonElement
  ) {
    return;
  }

  event.preventDefault();
  setPreviewMode(!isPreviewMode);
});

function handleItemAction(action: string, itemId: string, slotName?: string): void {
  if (action === 'add-text') {
    if (!slotName) return;
    updateItemById(itemId, (item) => {
      const slotNodes = item.slots[slotName] || [];
      item.slots[slotName] = [
        ...slotNodes,
        { id: generateId(), kind: 'text', value: 'Texto editable' },
      ];
    });
    return;
  }

  if (action === 'delete') {
    const nextItems = removeItemById(state.items, itemId).items;
    const selectedItemId =
      state.selectedItemId && findItemById(nextItems, state.selectedItemId)
        ? state.selectedItemId
        : null;
    setState({ ...state, items: nextItems, selectedItemId });
    return;
  }

  if (action === 'duplicate') {
    const source = findItemById(state.items, itemId);
    if (!source) return;
    const location = findItemLocation(state.items, itemId);
    if (!location) return;
    const clone = cloneItemForDuplicate(source);
    const nextItems = insertItemAtSlot(state.items, location.parentId, location.slotName, clone);
    setState({ ...state, items: nextItems, selectedItemId: clone.id });
  }
}

function renderAll(): void {
  applyPreviewMode();
  renderCanvas();
  renderInspector();
  persistState();
}

function renderCanvas(): void {
  canvasEl.innerHTML = '';
  canvasEl.classList.toggle('canvas--preview', isPreviewMode);

  canvasEl.style.setProperty(
    'grid-template-columns',
    `repeat(${state.grid.columns}, minmax(0, 1fr))`,
  );
  canvasEl.style.setProperty('gap', `${state.grid.gap}px`);
  canvasEl.classList.toggle('canvas--show-grid', state.grid.showOverlay && !isPreviewMode);

  if (state.items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'canvas__empty';
    empty.textContent = 'Suelta aqui los componentes para empezar.';
    canvasEl.appendChild(empty);
  }

  if (isPreviewMode) {
    state.items.forEach((item) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'canvas-preview-item';
      previewItem.style.setProperty('--col-span', String(clamp(item.layout.colSpan, 1, 12)));
      previewItem.style.setProperty('--row-span', String(clamp(item.layout.rowSpan, 1, 4)));
      previewItem.appendChild(createPreviewElement(item, true, 'preview'));
      canvasEl.appendChild(previewItem);
    });
    return;
  }

  state.items.forEach((item) => {
    canvasEl.appendChild(renderCanvasItem(item));
  });
}

function renderInspector(): void {
  const selected = state.selectedItemId ? findItemById(state.items, state.selectedItemId) : null;

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
    createNumberField(
      'colSpan',
      'Columnas (1-12)',
      selected.layout.colSpan,
      1,
      12,
      1,
      (value) => {
        updateSelectedItem((item) => {
          item.layout.colSpan = clamp(value, 1, 12);
        });
      },
      'layout-colSpan',
    ),
  );
  layoutSection.append(
    createNumberField(
      'rowSpan',
      'Filas (1-4)',
      selected.layout.rowSpan,
      1,
      4,
      1,
      (value) => {
        updateSelectedItem((item) => {
          item.layout.rowSpan = clamp(value, 1, 4);
        });
      },
      'layout-rowSpan',
    ),
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

  const blockedContentKeys = new Set<string>();
  Object.entries(schema.fallbackContentBySlot || {}).forEach(([slotName, keys]) => {
    if (!hasSlotNodes(selected, slotName)) return;
    (keys || []).forEach((key) => blockedContentKeys.add(key));
  });

  const visibleContentFields = schema.contentFields.filter(
    (field) => !blockedContentKeys.has(field.key),
  );

  if (schema.contentFields.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'inspector__empty';
    empty.textContent = 'Este componente no expone contenido textual.';
    contentSection.append(empty);
  } else if (visibleContentFields.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'inspector__empty';
    empty.textContent = 'Hay contenido reemplazado por nodos en slots.';
    contentSection.append(empty);
  } else {
    visibleContentFields.forEach((field) => {
      const wrap = document.createElement('div');
      wrap.className = 'field';

      const label = document.createElement('label');
      label.textContent = field.label;

      const input = field.multiline
        ? document.createElement('textarea')
        : document.createElement('input');
      input.dataset.fieldId = `content-${field.key}`;
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

  const slotsSection = document.createElement('section');
  slotsSection.className = 'inspector__section';
  slotsSection.innerHTML = '<h3>Slots</h3>';

  if (schema.availableSlots.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'inspector__empty';
    empty.textContent = 'Este componente no acepta children por slots.';
    slotsSection.append(empty);
  } else {
    schema.availableSlots.forEach((slotName) => {
      const row = document.createElement('div');
      row.className = 'slot-inspector-row';

      const slotNodes = selected.slots[slotName] || [];

      const header = document.createElement('div');
      header.className = 'slot-inspector-row__header';

      const title = document.createElement('p');
      title.className = 'inspector__empty';
      title.textContent = `${slotName}: ${slotNodes.length} nodo(s)`;

      const addTextButton = document.createElement('button');
      addTextButton.type = 'button';
      addTextButton.textContent = '+ Texto';
      addTextButton.addEventListener('click', () => {
        updateSelectedItem((item) => {
          item.slots[slotName] = [
            ...(item.slots[slotName] || []),
            { id: generateId(), kind: 'text', value: 'Texto editable' },
          ];
        });
      });

      header.append(title, addTextButton);
      row.appendChild(header);

      if (slotNodes.length > 0) {
        const list = document.createElement('div');
        list.className = 'slot-inspector-row__list';

        slotNodes.forEach((slotNode, index) => {
          const itemRow = document.createElement('div');
          itemRow.className = 'slot-inspector-row__item';

          const label = document.createElement('p');
          label.className = 'inspector__empty';
          if (slotNode.kind === 'text') {
            label.textContent = `Texto: ${slotNode.value.slice(0, 30) || '(vacio)'}`;
          } else {
            label.textContent = `Componente: ${schemas[slotNode.item.type].title}`;
          }

          const controls = document.createElement('div');
          controls.className = 'slot-inspector-row__controls';

          const up = document.createElement('button');
          up.type = 'button';
          up.textContent = '↑';
          up.disabled = index === 0;
          up.addEventListener('click', () => {
            updateSelectedItem((item) => {
              const next = [...(item.slots[slotName] || [])];
              if (index === 0) return;
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              item.slots[slotName] = next;
            });
          });

          const down = document.createElement('button');
          down.type = 'button';
          down.textContent = '↓';
          down.disabled = index === slotNodes.length - 1;
          down.addEventListener('click', () => {
            updateSelectedItem((item) => {
              const next = [...(item.slots[slotName] || [])];
              if (index >= next.length - 1) return;
              [next[index], next[index + 1]] = [next[index + 1], next[index]];
              item.slots[slotName] = next;
            });
          });

          const remove = document.createElement('button');
          remove.type = 'button';
          remove.textContent = 'Eliminar';
          remove.addEventListener('click', () => {
            updateSelectedItem((item) => {
              item.slots[slotName] = (item.slots[slotName] || []).filter(
                (node) => node.id !== slotNode.id,
              );
            });
          });

          controls.append(up, down);
          if (slotNode.kind === 'component') {
            const select = document.createElement('button');
            select.type = 'button';
            select.textContent = 'Seleccionar';
            select.addEventListener('click', () => {
              setState({ ...state, selectedItemId: slotNode.item.id });
            });
            controls.appendChild(select);
          }
          controls.appendChild(remove);

          itemRow.append(label, controls);

          if (slotNode.kind === 'text') {
            const input = document.createElement('textarea');
            input.className = 'slot-inspector-row__text';
            input.dataset.fieldId = `slot-text-${slotName}-${slotNode.id}`;
            input.value = slotNode.value;
            input.addEventListener('input', () => {
              updateSelectedItem((item) => {
                item.slots[slotName] = (item.slots[slotName] || []).map((node) => {
                  if (node.id !== slotNode.id || node.kind !== 'text') return node;
                  return { ...node, value: input.value };
                });
              });
            });
            itemRow.appendChild(input);
          }

          list.appendChild(itemRow);
        });

        row.appendChild(list);
      }

      slotsSection.appendChild(row);
    });
  }

  actions.append(actionWrap);
  inspectorFieldsEl.append(layoutSection, propSection, contentSection, slotsSection, actions);
}

function createPropControl(item: EditorItem, field: PropField): HTMLElement {
  const currentValue = item.props[field.key];

  if (field.type === 'boolean') {
    const wrap = document.createElement('div');
    wrap.className = 'field field--checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.fieldId = `prop-${field.key}`;
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
    select.dataset.fieldId = `prop-${field.key}`;
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
      `prop-${field.key}`,
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
  input.dataset.fieldId = `prop-${field.key}`;
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
  fieldId: string,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const label = document.createElement('label');
  label.setAttribute('for', `field-${key}`);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.id = `field-${key}`;
  input.dataset.fieldId = fieldId;
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
  updateItemById(state.selectedItemId, mutate);
}

function updateItemById(itemId: string, mutate: (item: EditorItem) => void): void {
  const nextItems = mapItems(state.items, (item) => {
    if (item.id !== itemId) return item;
    const draft = cloneItemForUpdate(item);
    mutate(draft);
    return draft;
  });
  setState({ ...state, items: nextItems });
}

function createItem(type: DsComponent): EditorItem {
  const schema = schemas[type];
  const slots = schema.availableSlots.reduce<Record<string, SlotNode[]>>((acc, slotName) => {
    acc[slotName] = [];
    return acc;
  }, {});

  return {
    id: generateId(),
    type,
    props: { ...schema.defaultProps },
    content: { ...schema.defaultContent },
    layout: { colSpan: 12, rowSpan: 1 },
    slots,
  };
}

function renderCanvasItem(item: EditorItem): HTMLElement {
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

  const previewWrap = document.createElement('div');
  previewWrap.className = 'canvas-item__preview';
  previewWrap.appendChild(createPreviewElement(item, false, 'editor'));

  card.append(meta, previewWrap);

  if (schema.availableSlots.length > 0) {
    const slotList = document.createElement('div');
    slotList.className = 'canvas-item__slots';

    schema.availableSlots.forEach((slotName) => {
      const section = document.createElement('section');
      section.className = 'slot-section';

      const header = document.createElement('div');
      header.className = 'slot-section__header';

      const label = document.createElement('p');
      label.className = 'slot-section__title';
      label.textContent = `Slot: ${slotName}`;

      const addTextButton = document.createElement('button');
      addTextButton.type = 'button';
      addTextButton.className = 'slot-section__btn';
      addTextButton.dataset.action = 'add-text';
      addTextButton.dataset.slotName = slotName;
      addTextButton.textContent = '+ Texto';

      header.append(label, addTextButton);

      const zone = document.createElement('div');
      zone.className = 'slot-dropzone';
      zone.dataset.dropParentId = item.id;
      zone.dataset.dropSlot = slotName;

      const children = item.slots[slotName] || [];
      if (children.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'slot-dropzone__empty';
        empty.textContent = 'Suelta componentes aqui';
        zone.appendChild(empty);
      } else {
        children.forEach((child, index) => {
          if (child.kind === 'component') {
            zone.appendChild(renderCanvasItem(child.item));
            return;
          }

          zone.appendChild(renderSlotTextNode(item.id, slotName, child, index, children.length));
        });

        const hint = document.createElement('p');
        hint.className = 'slot-dropzone__hint';
        hint.textContent = 'Suelta mas componentes aqui';
        zone.appendChild(hint);
      }

      section.append(header, zone);
      slotList.appendChild(section);
    });

    card.appendChild(slotList);
  }

  return card;
}

function renderSlotTextNode(
  parentItemId: string,
  slotName: string,
  node: SlotTextNode,
  index: number,
  total: number,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'slot-text-node';

  const textarea = document.createElement('textarea');
  textarea.className = 'slot-text-node__input';
  textarea.value = node.value;
  textarea.addEventListener('input', () => {
    updateItemById(parentItemId, (item) => {
      const slotNodes = item.slots[slotName] || [];
      item.slots[slotName] = slotNodes.map((slotNode) => {
        if (slotNode.id !== node.id || slotNode.kind !== 'text') return slotNode;
        return { ...slotNode, value: textarea.value };
      });
    });
  });

  const actions = document.createElement('div');
  actions.className = 'slot-text-node__actions';

  const moveUp = document.createElement('button');
  moveUp.type = 'button';
  moveUp.textContent = '↑';
  moveUp.disabled = index === 0;
  moveUp.addEventListener('click', () => {
    updateItemById(parentItemId, (item) => {
      const slotNodes = [...(item.slots[slotName] || [])];
      if (index === 0) return;
      [slotNodes[index - 1], slotNodes[index]] = [slotNodes[index], slotNodes[index - 1]];
      item.slots[slotName] = slotNodes;
    });
  });

  const moveDown = document.createElement('button');
  moveDown.type = 'button';
  moveDown.textContent = '↓';
  moveDown.disabled = index === total - 1;
  moveDown.addEventListener('click', () => {
    updateItemById(parentItemId, (item) => {
      const slotNodes = [...(item.slots[slotName] || [])];
      if (index >= slotNodes.length - 1) return;
      [slotNodes[index], slotNodes[index + 1]] = [slotNodes[index + 1], slotNodes[index]];
      item.slots[slotName] = slotNodes;
    });
  });

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = 'Eliminar';
  remove.addEventListener('click', () => {
    updateItemById(parentItemId, (item) => {
      item.slots[slotName] = (item.slots[slotName] || []).filter(
        (slotNode) => slotNode.id !== node.id,
      );
    });
  });

  actions.append(moveUp, moveDown, remove);
  wrap.append(textarea, actions);
  return wrap;
}

type RenderContext = 'editor' | 'preview';

function createPreviewElement(
  item: EditorItem,
  includeChildren = true,
  context: RenderContext = 'preview',
): HTMLElement {
  const schema = schemas[item.type];
  const el = schema.createElement(item);

  if (context === 'editor' && item.type === 'iv-dialog') {
    el.removeAttribute('open');
    el.setAttribute('inert', '');
  }

  if (!includeChildren) return el;

  schema.availableSlots.forEach((slotName) => {
    (item.slots[slotName] || []).forEach((child) => {
      if (child.kind === 'text') {
        if (slotName === ROOT_SLOT) {
          el.appendChild(document.createTextNode(child.value));
          return;
        }

        const wrapper = document.createElement('span');
        wrapper.setAttribute('slot', slotName);
        wrapper.textContent = child.value;
        el.appendChild(wrapper);
        return;
      }

      const childElement = createPreviewElement(child.item, true, context);
      if (slotName !== ROOT_SLOT) {
        childElement.setAttribute('slot', slotName);
      } else {
        childElement.removeAttribute('slot');
      }
      el.appendChild(childElement);
    });
  });

  return el;
}

function mapItems(items: EditorItem[], update: (item: EditorItem) => EditorItem): EditorItem[] {
  return items.map((item) => {
    const next = update(item);
    const nextSlots = Object.entries(next.slots).reduce<Record<string, SlotNode[]>>(
      (acc, [slotName, slotNodes]) => {
        acc[slotName] = slotNodes.map((slotNode) => {
          if (slotNode.kind === 'text') return slotNode;
          return {
            ...slotNode,
            item: mapItems([slotNode.item], update)[0],
          };
        });
        return acc;
      },
      {},
    );
    return { ...next, slots: nextSlots };
  });
}

function removeItemById(
  items: EditorItem[],
  itemId: string,
): { items: EditorItem[]; removed: EditorItem | null } {
  let removed: EditorItem | null = null;
  const nextItems: EditorItem[] = [];

  items.forEach((item) => {
    if (item.id === itemId) {
      removed = item;
      return;
    }

    const nextSlots: Record<string, SlotNode[]> = {};
    Object.entries(item.slots).forEach(([slotName, slotNodes]) => {
      const rebuilt: SlotNode[] = [];
      slotNodes.forEach((slotNode) => {
        if (slotNode.kind === 'text') {
          rebuilt.push(slotNode);
          return;
        }

        if (slotNode.item.id === itemId) {
          if (!removed) removed = slotNode.item;
          return;
        }

        const nested = removeItemById([slotNode.item], itemId);
        if (!removed && nested.removed) removed = nested.removed;
        const nextItem = nested.items[0];
        if (nextItem) {
          rebuilt.push({
            ...slotNode,
            item: nextItem,
          });
        }
      });
      nextSlots[slotName] = rebuilt;
    });

    nextItems.push({ ...item, slots: nextSlots });
  });

  return { items: nextItems, removed };
}

function insertItemAtSlot(
  items: EditorItem[],
  parentId: string | null,
  slotName: string,
  item: EditorItem,
): EditorItem[] {
  if (!parentId) return [...items, item];

  return items.map((entry) => {
    if (entry.id === parentId) {
      const nextSlot: SlotNode[] = [
        ...(entry.slots[slotName] || []),
        { id: generateId(), kind: 'component', item },
      ];
      return {
        ...entry,
        slots: {
          ...entry.slots,
          [slotName]: nextSlot,
        },
      };
    }

    const nextSlots = Object.entries(entry.slots).reduce<Record<string, SlotNode[]>>(
      (acc, [name, slotNodes]) => {
        acc[name] = slotNodes.map((slotNode) => {
          if (slotNode.kind === 'text') return slotNode;
          return {
            ...slotNode,
            item: insertItemAtSlot([slotNode.item], parentId, slotName, item)[0],
          };
        });
        return acc;
      },
      {},
    );

    return {
      ...entry,
      slots: nextSlots,
    };
  });
}

function isDescendant(items: EditorItem[], ancestorId: string, targetId: string): boolean {
  const ancestor = findItemById(items, ancestorId);
  if (!ancestor) return false;
  return Boolean(findItemById(getComponentChildren(ancestor), targetId));
}

function moveItemToSlot(
  items: EditorItem[],
  dragId: string,
  targetParentId: string | null,
  targetSlot: string,
): EditorItem[] {
  if (targetParentId === dragId) return items;
  if (targetParentId && isDescendant(items, dragId, targetParentId)) return items;

  const removed = removeItemById(items, dragId);
  if (!removed.removed) return items;
  return insertItemAtSlot(removed.items, targetParentId, targetSlot, removed.removed);
}

function findItemById(items: EditorItem[], itemId: string): EditorItem | null {
  for (const item of items) {
    if (item.id === itemId) return item;
    const nested = findItemById(getComponentChildren(item), itemId);
    if (nested) return nested;
  }
  return null;
}

function findItemLocation(
  items: EditorItem[],
  itemId: string,
  parentId: string | null = null,
  slotName: string = ROOT_SLOT,
): { parentId: string | null; slotName: string } | null {
  for (const item of items) {
    if (item.id === itemId) {
      return { parentId, slotName };
    }

    for (const [nextSlotName, slotNodes] of Object.entries(item.slots)) {
      const location = findItemLocation(
        getComponentChildrenFromNodes(slotNodes),
        itemId,
        item.id,
        nextSlotName,
      );
      if (location) return location;
    }
  }

  return null;
}

function cloneItemForUpdate(item: EditorItem): EditorItem {
  const nextSlots = Object.entries(item.slots).reduce<Record<string, SlotNode[]>>(
    (acc, [slotName, slotNodes]) => {
      acc[slotName] = slotNodes.map((slotNode) => {
        if (slotNode.kind === 'text') {
          return { ...slotNode };
        }

        return {
          ...slotNode,
          item: cloneItemForUpdate(slotNode.item),
        };
      });
      return acc;
    },
    {},
  );

  return {
    ...item,
    props: { ...item.props },
    content: { ...item.content },
    layout: { ...item.layout },
    slots: nextSlots,
  };
}

function cloneItemForDuplicate(item: EditorItem): EditorItem {
  const nextSlots = Object.entries(item.slots).reduce<Record<string, SlotNode[]>>(
    (acc, [slotName, slotNodes]) => {
      acc[slotName] = slotNodes.map((slotNode) => {
        if (slotNode.kind === 'text') {
          return { ...slotNode, id: generateId() };
        }

        return {
          ...slotNode,
          id: generateId(),
          item: cloneItemForDuplicate(slotNode.item),
        };
      });
      return acc;
    },
    {},
  );

  return {
    ...item,
    id: generateId(),
    props: { ...item.props },
    content: { ...item.content },
    layout: { ...item.layout },
    slots: nextSlots,
  };
}

function getComponentChildren(item: EditorItem): EditorItem[] {
  return Object.values(item.slots).flatMap((slotNodes) => getComponentChildrenFromNodes(slotNodes));
}

function getComponentChildrenFromNodes(slotNodes: SlotNode[]): EditorItem[] {
  return slotNodes
    .filter((slotNode): slotNode is SlotComponentNode => slotNode.kind === 'component')
    .map((slotNode) => slotNode.item);
}

function hasSlotNodes(item: EditorItem, slotName: string): boolean {
  return (item.slots[slotName] || []).length > 0;
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
  const focusSnapshot = captureInspectorFocus();
  state = nextState;
  renderAll();
  restoreInspectorFocus(focusSnapshot);
}

function setPreviewMode(nextValue: boolean): void {
  isPreviewMode = nextValue;
  window.localStorage.setItem(PREVIEW_STORAGE_KEY, isPreviewMode ? '1' : '0');
  renderAll();
}

function applyPreviewMode(): void {
  document.body.classList.toggle('editor--preview', isPreviewMode);
  editorLayout?.classList.toggle('editor-layout--preview', isPreviewMode);

  if (previewToggleButton) {
    previewToggleButton.textContent = isPreviewMode ? 'Salir de preview' : 'Preview';
    previewToggleButton.setAttribute('aria-pressed', String(isPreviewMode));
  }
}

function captureInspectorFocus(): InspectorFocusSnapshot | null {
  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement)) return null;
  if (!inspectorFieldsEl.contains(activeElement)) return null;

  const fieldId = activeElement.dataset.fieldId;
  if (!fieldId) return null;

  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
    return {
      fieldId,
      selectionStart: activeElement.selectionStart,
      selectionEnd: activeElement.selectionEnd,
    };
  }

  return {
    fieldId,
    selectionStart: null,
    selectionEnd: null,
  };
}

function restoreInspectorFocus(snapshot: InspectorFocusSnapshot | null): void {
  if (!snapshot) return;

  const nextField = inspectorFieldsEl.querySelector<HTMLElement>(
    `[data-field-id="${snapshot.fieldId}"]`,
  );
  if (!nextField) return;

  nextField.focus();

  if (
    snapshot.selectionStart === null ||
    snapshot.selectionEnd === null ||
    !(nextField instanceof HTMLInputElement || nextField instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  const inputType = nextField instanceof HTMLInputElement ? nextField.type : '';
  if (inputType === 'checkbox' || inputType === 'radio') return;

  try {
    nextField.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
  } catch {}
}

function persistState(): void {
  window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(state));
}

function loadState(): EditorState {
  const rawV3 = window.localStorage.getItem(STORAGE_KEY_V3);
  if (rawV3) {
    try {
      const parsed = JSON.parse(rawV3) as EditorState;
      if (parsed && parsed.version === 3 && Array.isArray(parsed.items)) {
        return {
          version: 3,
          selectedItemId: parsed.selectedItemId ?? null,
          grid: {
            columns: 12,
            gap: clamp(Number(parsed.grid?.gap ?? 12), 6, 24),
            rowHeight: 1,
            showOverlay: Boolean(parsed.grid?.showOverlay ?? true),
          },
          items: parsed.items
            .filter((item) => isDsComponent(item.type))
            .map((item) => normalizeItem(item)),
        };
      }
    } catch {
      return createInitialState();
    }
  }

  const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
  if (rawV2) {
    try {
      const parsed = JSON.parse(rawV2) as {
        version?: number;
        selectedItemId?: string | null;
        grid?: { gap?: number; showOverlay?: boolean };
        items?: Array<Partial<EditorItem> & { type?: unknown }>;
      };
      if (parsed && parsed.version === 2 && Array.isArray(parsed.items)) {
        return {
          version: 3,
          selectedItemId: parsed.selectedItemId ?? null,
          grid: {
            columns: 12,
            gap: clamp(Number(parsed.grid?.gap ?? 12), 6, 24),
            rowHeight: 1,
            showOverlay: Boolean(parsed.grid?.showOverlay ?? true),
          },
          items: parsed.items
            .filter((item): item is Partial<EditorItem> & { type: DsComponent } =>
              isDsComponent(item.type),
            )
            .map((item) => normalizeItem(item)),
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
    version: 3,
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
      'iv-container',
      'iv-heading',
      'iv-text',
      'iv-button',
      'iv-input',
      'iv-textarea',
      'iv-select',
      'iv-alert',
      'iv-badge',
      'iv-spinner',
      'iv-checkbox',
      'iv-radio-group',
      'iv-toggle',
      'iv-form-field',
      'iv-dialog',
      'iv-toast',
    ].includes(value)
  );
}

function normalizeItem(item: Partial<EditorItem> & { type: DsComponent }): EditorItem {
  const schema = schemas[item.type];
  const slots = schema.availableSlots.reduce<Record<string, SlotNode[]>>((acc, slotName) => {
    const rawSlot = item.slots?.[slotName] as Array<unknown> | undefined;
    acc[slotName] = Array.isArray(rawSlot)
      ? rawSlot
          .map((slotEntry) => normalizeSlotNode(slotEntry))
          .filter((slotEntry): slotEntry is SlotNode => Boolean(slotEntry))
      : [];
    return acc;
  }, {});

  return {
    id: item.id && typeof item.id === 'string' ? item.id : generateId(),
    type: item.type,
    props: {
      ...schema.defaultProps,
      ...(item.props || {}),
    },
    content: {
      ...schema.defaultContent,
      ...(item.content || {}),
    },
    layout: {
      colSpan: clamp(Number(item.layout?.colSpan ?? 12), 1, 12),
      rowSpan: clamp(Number(item.layout?.rowSpan ?? 1), 1, 4),
    },
    slots,
  };
}

function normalizeSlotNode(slotEntry: unknown): SlotNode | null {
  if (!slotEntry || typeof slotEntry !== 'object') return null;

  const maybeNode = slotEntry as { kind?: unknown; id?: unknown; value?: unknown; item?: unknown };
  const nodeId = typeof maybeNode.id === 'string' ? maybeNode.id : generateId();

  if (maybeNode.kind === 'text') {
    return {
      id: nodeId,
      kind: 'text',
      value: typeof maybeNode.value === 'string' ? maybeNode.value : '',
    };
  }

  if (maybeNode.kind === 'component' && maybeNode.item && typeof maybeNode.item === 'object') {
    const nested = maybeNode.item as Partial<EditorItem> & { type?: unknown };
    if (!isDsComponent(nested.type)) return null;
    return {
      id: nodeId,
      kind: 'component',
      item: normalizeItem(nested as Partial<EditorItem> & { type: DsComponent }),
    };
  }

  const legacyComponent = slotEntry as Partial<EditorItem> & { type?: unknown };
  if (!isDsComponent(legacyComponent.type)) return null;
  return {
    id: nodeId,
    kind: 'component',
    item: normalizeItem(legacyComponent as Partial<EditorItem> & { type: DsComponent }),
  };
}

function generateId(): string {
  return `item-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
